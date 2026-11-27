import { randomUUID } from "node:crypto";
import { KeyedLock } from "../../utils/keyed-lock.js";
import { RateLimiter } from "../../utils/rate-limit.js";
import {
  ADMIN_LIST_MAX,
  LIST_STATUSES,
  REQUESTS_PER_DAY,
  expiryFrom,
  fail,
  isOpen,
  plan,
  toPublic,
  validateNote,
  validateReason,
  type Action,
  type AssistRow,
  type Outcome,
} from "./assist.core.js";
import type { AssistLogRow, AssistModel } from "./assist.model.js";

/** The data layer the service needs; tests pass an in-memory one. */
export type AssistModelPort = typeof AssistModel;
type Public = ReturnType<typeof toPublic>;

const DAY_MS = 24 * 60 * 60 * 1000;
const ACTIVITY_LIMIT = 20;
const byNewest = (a: { requested_at: string }, b: { requested_at: string }) => b.requested_at.localeCompare(a.requested_at);

export function createAssistService(model: AssistModelPort) {
  // One API instance (see utils/keyed-lock): a lock per couple/request keeps check-then-write steps from racing.
  const locks = new KeyedLock();
  const createLimiter = new RateLimiter(DAY_MS);

  const log = (row: Pick<AssistRow, "request_id" | "couple_id">, actorId: string, role: "couple" | "admin", action: string, now: Date) =>
    model.appendLog({
      log_id: randomUUID(),
      request_id: row.request_id,
      couple_id: row.couple_id,
      actor_id: actorId,
      actor_role: role,
      action,
      at: now.toISOString(),
    });

  /** Runs one transition under a per-request lock, writes the change and an audit row. */
  function transition(
    action: Action,
    requestId: string,
    coupleId: string | undefined,
    actorId: string,
    role: "couple" | "admin",
    data: (now: Date) => Record<string, unknown>,
    audit: string,
    now: Date,
  ): Promise<Outcome<Public>> {
    return locks.run(`req:${requestId}`, async () => {
      const row = await model.findById(requestId);
      // A couple only ever sees its own requests: another couple's id looks like "not found".
      if (!row || (coupleId && row.couple_id !== coupleId)) return fail("not_found", "Request not found");
      const step = plan(action, row, now);
      if (!step.ok) return step;
      if (step.value === "repeat") {
        // The change and its audit row are two sheet writes. If the second failed the first time, this retry
        // writes the missing row, so a finished action is never left without an audit entry.
        const logged = (await model.logByCouple(row.couple_id)).some((l) => l.request_id === requestId && l.action === audit);
        if (!logged) await log(row, actorId, role, audit, now);
        return { ok: true, value: toPublic(row, now) };
      }
      if (action === "accept") {
        const couple = await model.findCouple(row.couple_id);
        if (!couple || couple.status !== "active") return fail("conflict", "This couple's account is not active");
      }
      const changes = data(now);
      await model.update(requestId, changes);
      await log(row, actorId, role, audit, now);
      return { ok: true, value: toPublic({ ...row, ...changes }, now) };
    });
  }

  /**
   * The request cancel and revoke act on when the client names none: the open one, else the newest (so a retry
   * of an already finished action is a harmless repeat). A client that names one (`request_id`) always wins, which
   * keeps a delayed duplicate from cancelling a newer request.
   */
  async function targetId(coupleId: string, now: Date): Promise<string | null> {
    const rows = (await model.listByCouple(coupleId)).sort(byNewest);
    return (rows.find((r) => isOpen(r, now)) ?? rows[0])?.request_id ?? null;
  }

  async function coupleAction(
    action: "cancel" | "revoke",
    coupleId: string,
    userId: string,
    now: Date,
    requestId?: string,
  ): Promise<Outcome<Public>> {
    const id = requestId || (await targetId(coupleId, now));
    if (!id) return fail("not_found", "You have no help request");
    return action === "cancel"
      ? transition("cancel", id, coupleId, userId, "couple", () => ({ status: "cancelled" }), "cancelled", now)
      : transition("revoke", id, coupleId, userId, "couple", (n) => ({ status: "revoked", revoked_at: n.toISOString() }), "revoked", now);
  }

  return {
    async getForCouple(coupleId: string, now = new Date()) {
      const [rows, logs] = await Promise.all([model.listByCouple(coupleId), model.logByCouple(coupleId)]);
      const latest = rows.sort(byNewest)[0] ?? null;
      const activity = logs
        .sort((a: AssistLogRow, b: AssistLogRow) => b.at.localeCompare(a.at))
        .slice(0, ACTIVITY_LIMIT)
        // The couple sees who (role) and what, never admin ids or request bodies.
        .map((l) => ({ at: l.at, actor_role: l.actor_role, action: l.action, method: l.method || null, path: l.path || null }));
      return { request: latest ? toPublic(latest, now) : null, activity };
    },

    create(coupleId: string, userId: string, noteInput: unknown, now = new Date()): Promise<Outcome<Public>> {
      const note = validateNote(noteInput);
      if (!note.ok) return Promise.resolve(note);
      return locks.run(`couple:${coupleId}`, async (): Promise<Outcome<Public>> => {
        const couple = await model.findCouple(coupleId);
        if (!couple || couple.status !== "active") return fail("forbidden", "Your account is not active");
        const rows = await model.listByCouple(coupleId);
        const open = rows.find((r) => isOpen(r, now));
        if (open) {
          // A create whose audit write failed left a request with no "requested" row, and this retry would be
          // refused forever. Write the missing row, credited to the person who asked, then refuse as usual.
          const logged = (await model.logByCouple(coupleId)).some((l) => l.request_id === open.request_id && l.action === "requested");
          if (!logged) await log(open, open.requested_by, "couple", "requested", new Date(open.requested_at));
          return fail("conflict", "You already have an open help request");
        }
        // Counted only once the request is otherwise valid, so typos do not use up the daily allowance.
        if (!createLimiter.hit(coupleId, REQUESTS_PER_DAY)) return fail("rate_limited", "Too many requests today. Try again tomorrow.");
        const row: AssistRow = {
          request_id: randomUUID(),
          couple_id: coupleId,
          note: note.value,
          status: "pending",
          requested_by: userId,
          requested_at: now.toISOString(),
        };
        await model.create(row as unknown as Record<string, unknown>);
        await log(row, userId, "couple", "requested", now);
        return { ok: true, value: toPublic(row, now) };
      });
    },

    cancel: (coupleId: string, userId: string, requestId?: string, now = new Date()) =>
      coupleAction("cancel", coupleId, userId, now, requestId),
    revoke: (coupleId: string, userId: string, requestId?: string, now = new Date()) =>
      coupleAction("revoke", coupleId, userId, now, requestId),

    accept: (adminId: string, requestId: string, now = new Date()) =>
      transition(
        "accept",
        requestId,
        undefined,
        adminId,
        "admin",
        (n) => ({ status: "approved", decided_by: adminId, decided_at: n.toISOString(), expires_at: expiryFrom(n) }),
        "accepted",
        now,
      ),

    /** An admin ends access early (a mistaken accept, or the couple asked by phone). */
    adminRevoke: (adminId: string, requestId: string, now = new Date()) =>
      transition(
        "revoke",
        requestId,
        undefined,
        adminId,
        "admin",
        (n) => ({ status: "revoked", revoked_at: n.toISOString() }),
        "revoked",
        now,
      ),

    decline(adminId: string, requestId: string, reasonInput: unknown, now = new Date()): Promise<Outcome<Public>> {
      const reason = validateReason(reasonInput);
      if (!reason.ok) return Promise.resolve(reason);
      return transition(
        "decline",
        requestId,
        undefined,
        adminId,
        "admin",
        (n) => ({ status: "declined", decided_by: adminId, decided_at: n.toISOString(), decline_reason: reason.value }),
        "declined",
        now,
      );
    },

    /** Newest first. `cursor` is the `requested_at` of the last row of the previous page. */
    async listForAdmin(
      opts: { status?: string; cursor?: string; limit?: number },
      now = new Date(),
    ): Promise<Outcome<{ requests: Array<Public & { couple_name: string }>; next_cursor: string | null }>> {
      if (opts.status !== undefined && !(LIST_STATUSES as readonly string[]).includes(opts.status)) return fail("invalid", "Unknown status");
      if (opts.cursor !== undefined && Number.isNaN(Date.parse(opts.cursor))) return fail("invalid", "Invalid cursor");
      const limit = Math.min(Math.max(Math.trunc(opts.limit ?? 20) || 20, 1), ADMIN_LIST_MAX);
      // Stored statuses are filtered by the data layer; `expired` only exists after deriving, so it reads all.
      const stored = opts.status && opts.status !== "expired" ? opts.status : undefined;
      const [rows, couples] = await Promise.all([model.list(stored), model.listCouples()]);
      const names = new Map(
        couples.map((c) => [c.couple_id as string, [c.partner1_name, c.partner2_name].filter(Boolean).join(" & ") || (c.slug as string)]),
      );
      const items = rows
        .map((r) => toPublic(r, now))
        // Filter on the derived status so "expired" works even though it is not stored.
        .filter((r) => !opts.status || r.status === opts.status)
        .filter((r) => !opts.cursor || r.requested_at < opts.cursor)
        .sort(byNewest);
      const page = items.slice(0, limit);
      return {
        ok: true,
        value: {
          requests: page.map((r) => ({ ...r, couple_name: names.get(r.couple_id) ?? "Unknown couple" })),
          next_cursor: items.length > limit ? page[page.length - 1]!.requested_at : null,
        },
      };
    },
  };
}

import { randomUUID } from "node:crypto";
import { fail, isLive, type Outcome } from "./assist.core.js";
import { auditPath, pickActingMember, readClaim, tokenTtlSeconds, type AssistClaim } from "./assist.session.core.js";
import type { AssistModelPort } from "./assist.service.js";

export interface AssistSessionDeps {
  model: AssistModelPort;
  /** Signs the token; `ttlSeconds` is the whole lifetime. Injected so tests need no secret. */
  sign: (payload: Record<string, unknown>, ttlSeconds: number) => string;
}

export type OpenResult = { token: string; expires_at: string };

const ENDED = "Assist access ended";

export function createAssistSessionService({ model, sign }: AssistSessionDeps) {
  /** Admin side: turn a live, approved request into a short-lived editor token. */
  async function openSession(adminId: string, requestId: string, now = new Date()): Promise<Outcome<OpenResult>> {
    const row = await model.findById(requestId);
    if (!row) return fail("not_found", "Request not found");
    if (!isLive(row, now)) return fail("conflict", "This request is not active");

    const couple = await model.findCouple(row.couple_id);
    if (!couple || couple.status !== "active") return fail("conflict", "This couple's account is not active");

    const partner = pickActingMember(await model.listMembers(row.couple_id));
    const user = partner ? await model.findUser(partner.user_id) : null;
    if (!user || user.role !== "couple" || user.status !== "active") return fail("conflict", "This couple has no active partner to act as");

    const ttl = tokenTtlSeconds(now, row.expires_at);
    if (ttl === null) return fail("conflict", "This request is not active");

    // The audit row first: a token is never issued that the couple could not see in their activity.
    await model.appendLog({
      log_id: randomUUID(),
      request_id: row.request_id,
      couple_id: row.couple_id,
      actor_id: adminId,
      actor_role: "admin",
      action: "open",
      at: now.toISOString(),
    });
    const claim: AssistClaim = { request_id: row.request_id, admin_id: adminId, couple_id: row.couple_id };
    const token = sign({ user_id: user.user_id, role: "couple", email: user.email, status: user.status, assist: claim }, ttl);
    return { ok: true, value: { token, expires_at: new Date(now.getTime() + ttl * 1000).toISOString() } };
  }

  /**
   * Couple side, on every request that carries an assist claim: everything is read again, nothing is trusted from
   * the token. Access holds only while the request is live, belongs to the couple the caller resolved to, the
   * couple is active, and the admin who opened it is still an active admin.
   */
  async function checkAccess(claim: AssistClaim, ctx: { coupleId: string; coupleStatus: unknown }, now = new Date()): Promise<Outcome<true>> {
    if (claim.couple_id !== ctx.coupleId || ctx.coupleStatus !== "active") return fail("forbidden", ENDED);
    const row = await model.findById(claim.request_id);
    if (!row || row.couple_id !== ctx.coupleId || !isLive(row, now)) return fail("forbidden", ENDED);
    const admin = await model.findUser(claim.admin_id);
    if (!admin || admin.role !== "admin" || admin.status !== "active") return fail("forbidden", ENDED);
    return { ok: true, value: true };
  }

  /** One row for an admin reading couple data (throttled by the guard: not one per GET). Area only, never a body. */
  function recordView(claim: AssistClaim, url: string, now = new Date()) {
    return recordAction(claim, "view", "GET", url, now);
  }

  /** An attempt the policy refused, so a probe of a closed route leaves a trace. */
  function recordBlocked(claim: AssistClaim, method: string, url: string, now = new Date()) {
    return recordAction(claim, "blocked", method, url, now);
  }

  function recordAction(claim: AssistClaim, action: string, method: string, url: string, now: Date) {
    return model.appendLog({
      log_id: randomUUID(),
      request_id: claim.request_id,
      couple_id: claim.couple_id,
      actor_id: claim.admin_id,
      actor_role: "admin",
      action,
      method: method.toUpperCase(),
      path: auditPath(url),
      at: now.toISOString(),
    });
  }

  /** Written before a mutating assisted request runs. Method and path only: no body, no query string, no token. */
  function recordEdit(claim: AssistClaim, method: string, url: string, now = new Date()) {
    return recordAction(claim, "edit", method, url, now);
  }

  return { openSession, checkAccess, recordEdit, recordView, recordBlocked, readClaim };
}

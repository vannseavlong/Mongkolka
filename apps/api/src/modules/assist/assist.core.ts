/**
 * Pure rules for assisted-editing requests: states, transitions, validation. No database, no clock of its
 * own, so every rule is testable. The service wires it to the model and the audit log.
 */

export type StoredStatus = "pending" | "approved" | "declined" | "revoked" | "cancelled";
/** `expired` is derived, never stored. */
export type AssistStatus = StoredStatus | "expired";

export const ASSIST_DAYS = 7;
export const NOTE_MIN = 5;
export const NOTE_MAX = 500;
export const REASON_MAX = 300;
export const REQUESTS_PER_DAY = 3;
export const ADMIN_LIST_MAX = 50;
/** Statuses an admin may filter on: the stored ones plus the derived `expired`. */
export const LIST_STATUSES = ["pending", "approved", "declined", "revoked", "cancelled", "expired"] as const;

export interface AssistRow {
  request_id: string;
  couple_id: string;
  note: string;
  status: string;
  requested_by: string;
  requested_at: string;
  decided_by?: string | null;
  decided_at?: string | null;
  decline_reason?: string | null;
  expires_at?: string | null;
  revoked_at?: string | null;
}

export type Failure = { ok: false; code: "invalid" | "conflict" | "not_found" | "rate_limited" | "forbidden"; message: string };
export type Outcome<T> = { ok: true; value: T } | Failure;

export const fail = (code: Failure["code"], message: string): Failure => ({ ok: false, code, message });

export function effectiveStatus(row: Pick<AssistRow, "status" | "expires_at">, now: Date): AssistStatus {
  if (row.status === "approved") {
    // Fails closed: an approval with no readable expiry (a hand-edited sheet) counts as expired, never as live.
    const end = row.expires_at ? new Date(row.expires_at).getTime() : NaN;
    if (!Number.isFinite(end) || end <= now.getTime()) return "expired";
  }
  return row.status as StoredStatus;
}

/** Pending, or approved and not yet expired. A couple may have at most one. */
export const isOpen = (row: AssistRow, now: Date) => {
  const s = effectiveStatus(row, now);
  return s === "pending" || s === "approved";
};

/** The only state in which an admin may get an editor token. */
export const isLive = (row: AssistRow, now: Date) => effectiveStatus(row, now) === "approved";

export function validateNote(value: unknown): Outcome<string> {
  if (typeof value !== "string") return fail("invalid", "note is required");
  const note = value.trim();
  if (note.length < NOTE_MIN) return fail("invalid", `note must be at least ${NOTE_MIN} characters`);
  if (note.length > NOTE_MAX) return fail("invalid", `note must be at most ${NOTE_MAX} characters`);
  return { ok: true, value: note };
}

export function validateReason(value: unknown): Outcome<string> {
  if (typeof value !== "string" || !value.trim()) return fail("invalid", "reason is required");
  const reason = value.trim();
  if (reason.length > REASON_MAX) return fail("invalid", `reason must be at most ${REASON_MAX} characters`);
  return { ok: true, value: reason };
}

export function expiryFrom(now: Date): string {
  return new Date(now.getTime() + ASSIST_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

export type Action = "cancel" | "accept" | "decline" | "revoke";

/**
 * What a transition does to a row. `repeat` means the row is already in the target state, so the call is
 * answered with the current row and nothing is written (idempotent retries). Anything else is a conflict.
 */
export function plan(action: Action, row: AssistRow, now: Date): Outcome<"apply" | "repeat"> {
  const s = effectiveStatus(row, now);
  const target: Record<Action, { from: AssistStatus; done: AssistStatus }> = {
    cancel: { from: "pending", done: "cancelled" },
    accept: { from: "pending", done: "approved" },
    decline: { from: "pending", done: "declined" },
    revoke: { from: "approved", done: "revoked" },
  };
  const t = target[action];
  if (s === t.from) return { ok: true, value: "apply" };
  // A live approval stays "approved" when accept is retried; an expired one is not a repeat.
  if (s === t.done) return { ok: true, value: "repeat" };
  return fail("conflict", `Cannot ${action} a request that is ${s}`);
}

/** The shape every API returns: derived status, no internal fields. */
export function toPublic(row: AssistRow, now: Date) {
  return {
    request_id: row.request_id,
    couple_id: row.couple_id,
    note: row.note,
    status: effectiveStatus(row, now),
    requested_at: row.requested_at,
    decided_at: row.decided_at || null,
    decline_reason: row.decline_reason || null,
    expires_at: row.expires_at || null,
    revoked_at: row.revoked_at || null,
  };
}

import type { AssistRequest } from "../data/schema";
import { currentStatus, timeLeft } from "./assist-rules";

/** A request as the table shows it: `status` is the one in force now, and the access dates are already decided. */
export interface RequestRow extends AssistRequest {
  accessEndsAt: string | null;
  accessLeft: string;
}

export function toRequestRow(r: AssistRequest, now: Date): RequestRow {
  const status = currentStatus(r, now);
  const accessEndsAt = status === "approved" || status === "expired" ? r.expiresAt : status === "revoked" ? r.revokedAt : null;
  return { ...r, status, accessEndsAt, accessLeft: status === "approved" ? timeLeft(r.expiresAt, now) : "" };
}

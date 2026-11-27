import type { AssistRequest, AssistStatus } from "../data/schema";

export type Tab = "pending" | "approved" | "closed";

export const TABS: Array<{ id: Tab; label: string; empty: string }> = [
  { id: "pending", label: "Pending", empty: "No couples are waiting for help." },
  { id: "approved", label: "Approved", empty: "You are not helping any couple right now." },
  { id: "closed", label: "Closed", empty: "No closed requests yet." },
];

/** The API filters on one status. "Closed" covers four, so it reads everything and filters here. */
export const apiStatusFor = (tab: Tab): AssistStatus | undefined => (tab === "closed" ? undefined : tab);

const CLOSED: AssistStatus[] = ["declined", "revoked", "cancelled", "expired"];

/** An approval can run out while the page is open, so "approved" is only believed until its expiry. Unreadable means expired. */
export function currentStatus(r: Pick<AssistRequest, "status" | "expiresAt">, now: Date): AssistStatus {
  if (r.status !== "approved") return r.status;
  const end = r.expiresAt ? new Date(r.expiresAt).getTime() : NaN;
  return Number.isFinite(end) && end > now.getTime() ? "approved" : "expired";
}

export function inTab(r: Pick<AssistRequest, "status" | "expiresAt">, tab: Tab, now: Date): boolean {
  const status = currentStatus(r, now);
  // An approval that has just expired stays where the admin saw it, with its buttons gone.
  if (tab === "approved") return r.status === "approved";
  return tab === "closed" ? CLOSED.includes(status) : status === tab;
}

export const STATUS_LABEL: Record<AssistStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  declined: "Declined",
  revoked: "Access ended",
  cancelled: "Cancelled by couple",
  expired: "Expired",
};

/** What the admin may do. The server enforces the same rules; this only decides which buttons show. */
export function actionsFor(r: Pick<AssistRequest, "status" | "expiresAt">, now: Date) {
  const status = currentStatus(r, now);
  return {
    accept: status === "pending",
    decline: status === "pending",
    openEditor: status === "approved",
    revoke: status === "approved",
  };
}

export function timeLeft(expiresAt: string | null, now: Date): string {
  const ms = expiresAt ? new Date(expiresAt).getTime() - now.getTime() : NaN;
  if (!Number.isFinite(ms) || ms <= 0) return "";
  const hours = Math.floor(ms / 3_600_000);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? "day" : "days"} left`;
  }
  if (hours >= 1) return `${hours} ${hours === 1 ? "hour" : "hours"} left`;
  return "less than an hour left";
}

export const REASON_MAX = 300;

export function reasonError(reason: string): string | null {
  const text = reason.trim();
  if (!text) return "Write a reason. The couple will see it.";
  if (text.length > REASON_MAX) return `Keep it under ${REASON_MAX} characters.`;
  return null;
}

/**
 * Last check before the browser is sent to an editor link: a web address (plain http only on this machine) that
 * carries the token in the fragment and nowhere else.
 */
export function isSafeEditorUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !(url.protocol === "http:" && local)) return false;
  return !url.search && !url.username && !url.password && url.hash.startsWith("#assist=") && url.hash.length > "#assist=".length;
}

export function countLabel(count: number, hasMore: boolean): string | undefined {
  if (count === 0) return undefined;
  return hasMore ? `${count}+` : String(count);
}

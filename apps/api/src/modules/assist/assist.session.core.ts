/**
 * Pure rules for assisted-editing sessions: what an admin's acting-as-couple token may do, how long it lives, who
 * it acts as, and how requests are written to the audit log. No database and no clock of its own.
 */

export const MAX_TOKEN_SECONDS = 60 * 60;

/** Claim carried by an assisted token. Only ever used as a key to look the request up again. */
export interface AssistClaim {
  request_id: string;
  admin_id: string;
  couple_id: string;
}

export type ClaimRead = { kind: "none" } | { kind: "claim"; claim: AssistClaim } | { kind: "invalid" };

/** A token without an `assist` claim is an ordinary login. One with a malformed claim is refused, never treated as ordinary. */
export function readClaim(payload: Record<string, unknown> | undefined): ClaimRead {
  const raw = payload?.assist;
  if (raw === undefined) return { kind: "none" };
  if (!raw || typeof raw !== "object") return { kind: "invalid" };
  const { request_id, admin_id, couple_id } = raw as Record<string, unknown>;
  if ([request_id, admin_id, couple_id].some((v) => typeof v !== "string" || !v)) return { kind: "invalid" };
  return { kind: "claim", claim: { request_id, admin_id, couple_id } as AssistClaim };
}

/** Seconds the token may live: an hour, never past the request's own expiry. Null when there is no time left or it is unreadable. */
export function tokenTtlSeconds(now: Date, expiresAt: string | null | undefined): number | null {
  const end = expiresAt ? new Date(expiresAt).getTime() : NaN;
  if (!Number.isFinite(end)) return null;
  const left = Math.floor((end - now.getTime()) / 1000);
  return left > 0 ? Math.min(MAX_TOKEN_SECONDS, left) : null;
}

interface MemberLike {
  user_id: string;
  member_role?: string | null;
  joined_at?: string | null;
}

/**
 * Who the admin acts as: the couple's partner who joined first (the one who registered). Collaborators are never
 * used, and a member with no join time sorts last. Ties break on user id so the choice is stable.
 */
export function pickActingMember<T extends MemberLike>(members: T[]): T | null {
  const time = (m: T) => {
    const t = m.joined_at ? new Date(m.joined_at).getTime() : NaN;
    return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
  };
  const partners = members.filter((m) => m.member_role === "partner");
  partners.sort((a, b) => time(a) - time(b) || a.user_id.localeCompare(b.user_id));
  return partners[0] ?? null;
}

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);
export const isMutating = (method: string) => MUTATING.has(method.toUpperCase());

const ANY = "*" as const;
const READ = ["GET", "HEAD"] as const;

/**
 * What an assisted token may reach, by the first path segment under /couple/api. An allow-list on purpose: a route
 * added later is refused until someone decides an admin may use it. People and Drive settings and the help
 * request itself are read-only (an admin must not invite or remove people, connect or drop the couple's Google
 * Drive, or end or file requests as the couple). No password, email or account routes exist for the couple today;
 * none are listed, so any added later are refused as well.
 */
const POLICY: Record<string, typeof ANY | readonly string[]> = {
  profile: ANY,
  website: ANY,
  guests: ANY,
  "budget-categories": ANY,
  "checklist-items": ANY,
  milestones: ANY,
  photos: ANY,
  wishes: ANY,
  overview: READ,
  // GET /couple/api/session does not run requireActiveCouple (a pending account must reach it), so this entry is
  // never evaluated; it is listed so the route inventory test can account for every route.
  session: READ,
  members: READ,
  drive: READ,
  assist: READ,
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/;
/** A fixed route word: lower-case letters and hyphens only. Anything else in a path is a value, not a route. */
const WORD = /^[a-z][a-z-]{0,23}$/;
export const AUDIT_PATH_MAX_SEGMENTS = 6;

/** Path without query or hash, lower-cased (Express routes ignore case), repeated and trailing slashes removed. */
export function cleanPath(url: string): string {
  const path = (url.split("#")[0] ?? "").split("?")[0] ?? "";
  const cleaned = path.toLowerCase().replace(/\/{2,}/g, "/").replace(/\/+$/, "");
  return cleaned || "/";
}

export function assistPolicy(method: string, url: string): "allow" | "deny" {
  const parts = cleanPath(url).split("/").filter(Boolean);
  if (parts[0] !== "couple" || parts[1] !== "api") return "deny";
  const rule = parts[2] ? POLICY[parts[2]] : undefined;
  if (!rule) return "deny";
  return rule === ANY || rule.includes(method.toUpperCase()) ? "allow" : "deny";
}

/** What the audit log stores for a request: the path with ids replaced, no query string, never a body or token. */
export function auditPath(url: string): string {
  const parts = cleanPath(url)
    .split("/")
    .filter(Boolean)
    .slice(0, AUDIT_PATH_MAX_SEGMENTS)
    .map((seg) => (WORD.test(seg) && !UUID.test(seg) ? seg : ":id"));
  return `/${parts.join("/")}`;
}

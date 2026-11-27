import type { Assist, AssistActivity, AssistRequest } from "../data/assist-api";

export const NOTE_MIN = 5;
export const NOTE_MAX = 500;

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/** What the card shows. `expired` and `ended` are kept apart from `none` so the copy can say what happened. */
export type AssistView =
  | { kind: "none" }
  | { kind: "pending"; request: AssistRequest }
  | { kind: "approved"; request: AssistRequest; until: Date; left: string }
  | { kind: "declined"; request: AssistRequest; reason: string | null }
  | { kind: "ended"; request: AssistRequest; why: "expired" | "revoked" | "cancelled" };

/**
 * Derives the view from the API answer and the clock. The API already reports `expired`, but the page can sit
 * open past the expiry, so an approval whose time is up (or unreadable) is treated as ended here too.
 */
export function assistView(assist: Assist | null, now: Date): AssistView {
  const request = assist?.request;
  if (!request) return { kind: "none" };
  switch (request.status) {
    case "pending":
      return { kind: "pending", request };
    case "approved": {
      const until = request.expiresAt;
      if (!until || until.getTime() <= now.getTime()) return { kind: "ended", request, why: "expired" };
      return { kind: "approved", request, until, left: timeLeft(until, now) };
    }
    case "declined":
      return { kind: "declined", request, reason: request.declineReason };
    default:
      return { kind: "ended", request, why: request.status };
  }
}

/** The couple may ask again unless a request is still open. */
export function canAsk(view: AssistView): boolean {
  return view.kind !== "pending" && view.kind !== "approved";
}

/** "6 days", "1 day", "5 hours", "under an hour": rounded down, so it never promises more time than there is. */
export function timeLeft(until: Date, now: Date): string {
  const ms = until.getTime() - now.getTime();
  if (ms < HOUR) return "under an hour";
  if (ms < DAY) return plural(Math.floor(ms / HOUR), "hour");
  return plural(Math.floor(ms / DAY), "day");
}

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

/** Message for the note box, or null when it is fine to send. */
export function noteError(raw: string): string | null {
  const n = raw.trim().length;
  if (n < NOTE_MIN) return `Tell us a little more (at least ${NOTE_MIN} characters).`;
  if (n > NOTE_MAX) return `Please keep it under ${NOTE_MAX} characters.`;
  return null;
}

/** Areas of the site a path belongs to, so the list says "your photos" and not a URL. */
const AREAS: Array<[prefix: string, label: string]> = [
  ["/couple/api/website/assets", "your photos"],
  ["/couple/api/website", "your website"],
  ["/couple/api/profile", "your profile"],
  ["/couple/api/guests", "your guest list"],
  ["/couple/api/budget", "your budget"],
  ["/couple/api/checklist", "your checklist"],
  ["/couple/api/milestones", "your milestones"],
  ["/couple/api/photos", "your guests' photos"],
  ["/couple/api/wishes", "your guests' wishes"],
  ["/couple/api/members", "who has access"],
  ["/couple/api/drive", "your storage settings"],
];

export function areaOf(path: string | null): string {
  const hit = path ? AREAS.find(([prefix]) => path.startsWith(prefix)) : undefined;
  return hit ? hit[1] : "your site";
}

/** One plain sentence for an activity row. */
export function activityText(a: AssistActivity): string {
  const who = a.by === "admin" ? "Mongkolka" : "You";
  switch (a.action) {
    case "requested":
      return "You asked Mongkolka for help";
    case "cancelled":
      return "You cancelled the request";
    case "accepted":
      return "Mongkolka accepted your request";
    case "declined":
      return "Mongkolka declined your request";
    case "revoked":
      return a.by === "admin" ? "Mongkolka ended its access" : "You ended Mongkolka's access";
    case "open":
      return "Mongkolka opened your site editor";
    case "edit":
      return `Mongkolka changed ${areaOf(a.path)}`;
    case "view":
      return `Mongkolka looked at ${areaOf(a.path)}`;
    case "blocked":
      return "Mongkolka tried something that is not allowed, and it was stopped";
    case "reconciled":
      return "An earlier update was recorded late";
    default:
      return `${who} made an update`;
  }
}

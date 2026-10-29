import type { GuestbookActions } from "../../types";

/** Same wish limit as the ink guestbook. */
export const MAX_WISH = 500;
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
/** The consuming app resizes photos; this only guards against absurd files before decoding. */
export const MAX_PHOTO_BYTES = 40 * 1024 * 1024;

export type PhotoErrorKind = "tooBig" | "type" | "limit" | "off" | "network";

export function validatePhoto(file: { type: string; size: number }): PhotoErrorKind | null {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) return "type";
  if (file.size > MAX_PHOTO_BYTES) return "tooBig";
  return null;
}

/** Maps what the consuming app throws (an Error with `code`/`status`, as the web app does) to a message kind. */
export function classifyError(err: unknown): PhotoErrorKind {
  const e = err as { code?: unknown; status?: unknown } | null;
  const code = typeof e?.code === "string" ? e.code : "";
  const status = typeof e?.status === "number" ? e.status : 0;
  if (code === "too_large" || status === 413) return "tooBig";
  if (code === "unsupported_type" || status === 415) return "type";
  if (code === "guest_limit" || code === "rate_limited" || status === 429) return "limit";
  if (code === "uploads_disabled") return "off";
  return "network";
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** Same calendar file as the ink guestbook (kept identical). */
export function buildIcs(c: NonNullable<GuestbookActions["calendar"]>): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = new Date(c.start);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const esc = (v: string) => v.replace(/[;,]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mongkolka//Wedding//EN",
    "BEGIN:VEVENT",
    `UID:${fmt(start)}-${Math.abs(hash(c.title))}@mongkolka`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(c.title)}`,
    c.location ? `LOCATION:${esc(c.location)}` : "",
    c.description ? `DESCRIPTION:${esc(c.description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

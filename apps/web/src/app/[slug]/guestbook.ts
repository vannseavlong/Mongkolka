import type { GuestbookActions, GuestbookData, GuestbookResult, GuestbookSubmission } from "@mongkolka/templates";
import type { PublicSiteResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const TOKEN_KEY = "mongkolka:guest-token";
// Phone photos are routinely 4–12 MB; the API caps uploads, and nobody needs more than
// this on a wedding page. Resizing client-side keeps uploads fast on venue mobile data.
const MAX_EDGE = 2000;
const JPEG_QUALITY = 0.86;

/** A random per-browser id, so the per-guest upload cap works without accounts. */
function guestToken(): string {
  try {
    let token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem(TOKEN_KEY, token);
    }
    return token;
  } catch {
    return crypto.randomUUID(); // storage blocked (private mode) — still works, cap is per-IP then
  }
}

async function shrink(file: File): Promise<{ blob: Blob; type: string }> {
  // GIFs would lose animation, and anything unreadable by the canvas goes up as-is.
  if (file.type === "image/gif") return { blob: file, type: file.type };
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return { blob: file, type: file.type };
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    if (blob && blob.size < file.size) return { blob, type: "image/jpeg" };
  } catch {
    /* fall through to the original file */
  }
  return { blob: file, type: file.type };
}

export class GuestbookError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code);
  }
}

export async function fetchGuestbook(slug: string): Promise<GuestbookData> {
  const [photos, wishes] = await Promise.all([
    fetch(`${API_URL}/public/api/site/${slug}/photos`).then((r) => (r.ok ? r.json() : { photos: [] })),
    fetch(`${API_URL}/public/api/site/${slug}/wishes`).then((r) => (r.ok ? r.json() : { wishes: [] })),
  ]);
  return { photos: photos.photos ?? [], wishes: wishes.wishes ?? [] };
}

export async function submitGuestbook(slug: string, input: GuestbookSubmission): Promise<GuestbookResult> {
  const token = guestToken();
  let photoId: string | undefined;
  let status: GuestbookResult["status"] = "pending";

  if (input.photo) {
    const { blob, type } = await shrink(input.photo);
    const res = await fetch(`${API_URL}/public/api/site/${slug}/photos`, {
      method: "POST",
      headers: {
        "Content-Type": type,
        "x-uploader-token": token,
        // header values must be latin1; names can be Khmer, so encode
        "x-uploader-name": encodeURIComponent(input.name).slice(0, 200),
      },
      body: blob,
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new GuestbookError(body.error ?? "upload_failed", res.status);
    photoId = body.photo_id;
    status = body.status;
  }

  if (input.message || input.gift || photoId) {
    const res = await fetch(`${API_URL}/public/api/site/${slug}/wishes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-uploader-token": token },
      body: JSON.stringify({ name: input.name, message: input.message, photoId, gift: input.gift }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new GuestbookError(body.error ?? "wish_failed", res.status);
    status = body.status;
  }
  return { status };
}

/** Best-effort start time from the wedding date + free-text ceremony time like "9:00 AM". */
function ceremonyStart(site: PublicSiteResponse): string | undefined {
  const dateIso = site.couple.wedding_date;
  if (!dateIso) return undefined;
  const base = new Date(dateIso);
  if (Number.isNaN(base.getTime())) return undefined;
  const m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i.exec(site.profile?.ceremony_time ?? "");
  let hour = 9;
  let minute = 0;
  if (m) {
    hour = Number(m[1]);
    minute = Number(m[2] ?? 0);
    const mer = m[3]?.toLowerCase();
    if (mer === "pm" && hour < 12) hour += 12;
    if (mer === "am" && hour === 12) hour = 0;
  }
  // wedding_date is stored as a UTC midnight; use its calendar date in local time.
  const start = new Date(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), hour, minute);
  return start.toISOString();
}

export function buildActions(site: PublicSiteResponse, names: string): GuestbookActions {
  const place = site.profile?.ceremony_address || site.profile?.ceremony_venue;
  const start = ceremonyStart(site);
  return {
    mapsUrl: place ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}` : undefined,
    calendar: start
      ? {
          title: `${names} — Wedding`,
          start,
          location: [site.profile?.ceremony_venue, site.profile?.ceremony_address].filter(Boolean).join(", ") || undefined,
          description: site.profile?.dress_code ? `Dress code: ${site.profile.dress_code}` : undefined,
        }
      : undefined,
  };
}

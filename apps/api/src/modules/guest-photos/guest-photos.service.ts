import { randomUUID } from "node:crypto";
import { photoStorage } from "../../services/storage/index.js";
import { RateLimiter } from "../../utils/rate-limit.js";
import { TtlCache } from "../../utils/ttl-cache.js";
import { PublicSiteService } from "../public-site/public-site.service.js";
import { GuestPhotosModel } from "./guest-photos.model.js";
import { GuestPhotosQueue } from "./guest-photos.queue.js";
import {
  ALLOWED_MIME,
  PHOTO_STATUSES,
  photoSettingsFromProfile,
  type PhotoStatus,
} from "./guest-photos.limits.js";

export interface PublicPhoto {
  photo_id: string;
  url: string;
  uploader_name: string | null;
}

export type UploadResult =
  | { ok: true; photo_id: string; status: PhotoStatus }
  | {
      ok: false;
      status: 400 | 403 | 404 | 413 | 415 | 429;
      error: "empty" | "not_found" | "uploads_disabled" | "too_large" | "unsupported_type" | "rate_limited" | "guest_limit";
    };

const uploadLimiter = new RateLimiter(60 * 60 * 1000);

// Public gallery, keyed by the couple's actor sheet id (so moderation can evict by it).
// Short TTL so new approved photos appear within seconds with no coupling to the
// upload path; moderation deletes the entry so a removal is instant.
const galleryCache = new TtlCache<PublicPhoto[]>(20_000, 1000);

/** Checks the file's magic bytes match the claimed type — a client-supplied header isn't proof. */
function matchesSignature(mime: string, b: Buffer): boolean {
  switch (mime) {
    case "image/jpeg":
      return b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    case "image/png":
      return b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case "image/gif":
      return b.length > 6 && b.subarray(0, 4).toString("ascii") === "GIF8";
    case "image/webp":
      return b.length > 12 && b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP";
    default:
      return false;
  }
}

function normalizeStatus(row: Record<string, unknown>): PhotoStatus {
  return (PHOTO_STATUSES as readonly unknown[]).includes(row.status) ? (row.status as PhotoStatus) : "pending";
}

type PhotoRow = Record<string, unknown> & { queued: boolean };

async function allRows(actorSheetId: string): Promise<PhotoRow[]> {
  const stored = await GuestPhotosModel.findMany(actorSheetId);
  const queued = GuestPhotosQueue.pending(actorSheetId);
  const queuedIds = new Set(queued.map((r) => r.photo_id));
  return [
    ...stored
      .filter((r) => !queuedIds.has(r.photo_id as string))
      .map((r): PhotoRow => ({ ...(r as Record<string, unknown>), queued: false })),
    ...queued.map((r): PhotoRow => ({ ...r, queued: true })),
  ];
}

export const GuestPhotosService = {
  // ---- public (guest) side ------------------------------------------------

  async upload(
    slug: string,
    input: { body: Buffer; mimeType: string; ip: string; uploaderName?: string; uploaderToken?: string },
  ): Promise<UploadResult> {
    const entry = await PublicSiteService.resolve(slug);
    if (!entry.site || !entry.actorSheetId || !entry.coupleId) {
      return { ok: false, status: 404, error: "not_found" };
    }
    const actorSheetId = entry.actorSheetId;
    const settings = photoSettingsFromProfile(entry.site.profile as Record<string, unknown> | null);

    if (settings.mode === "off") return { ok: false, status: 403, error: "uploads_disabled" };
    if (input.body.length === 0) return { ok: false, status: 400, error: "empty" };

    const ext = ALLOWED_MIME[input.mimeType];
    if (!ext || !matchesSignature(input.mimeType, input.body)) {
      return { ok: false, status: 415, error: "unsupported_type" };
    }
    if (input.body.length > settings.maxSizeMb * 1024 * 1024) {
      return { ok: false, status: 413, error: "too_large" };
    }
    if (!uploadLimiter.hit(`${slug}:${input.ip}`, settings.ratePerIpPerHour)) {
      return { ok: false, status: 429, error: "rate_limited" };
    }

    // Per-guest cap. Guests have no accounts and a wedding venue shares one IP, so the
    // client sends a random id it keeps in localStorage; fall back to the IP without one.
    const token = input.uploaderToken || `ip:${input.ip}`;
    const mine = (await allRows(actorSheetId)).filter((r) => r.uploader_token === token).length;
    if (mine >= settings.maxPerGuest) return { ok: false, status: 429, error: "guest_limit" };

    const photoId = randomUUID();
    const key = `${entry.coupleId}/${photoId}.${ext}`;
    const url = await photoStorage().put(key, input.body, input.mimeType);
    const status: PhotoStatus = settings.mode === "auto" ? "approved" : "pending";

    GuestPhotosQueue.enqueue(actorSheetId, {
      photo_id: photoId,
      storage_key: key,
      url,
      uploader_name: input.uploaderName?.trim().slice(0, 80) || undefined,
      uploader_token: token,
      mime_type: input.mimeType,
      size_bytes: input.body.length,
      status,
    });
    if (status === "approved") galleryCache.delete(actorSheetId);

    return { ok: true, photo_id: photoId, status };
  },

  /** Approved photos only; null if the site isn't published. */
  async listPublic(slug: string): Promise<PublicPhoto[] | null> {
    const entry = await PublicSiteService.resolve(slug);
    if (!entry.site || !entry.actorSheetId) return null;
    const actorSheetId = entry.actorSheetId;

    return galleryCache.getOrLoad(actorSheetId, async () => {
      const rows = await allRows(actorSheetId);
      return rows
        .filter((r) => normalizeStatus(r) === "approved")
        .map((r) => ({
          photo_id: r.photo_id as string,
          url: r.url as string,
          uploader_name: (r.uploader_name as string | null) ?? null,
        }));
    });
  },

  // ---- couple (moderation) side ------------------------------------------

  async list(actorSheetId: string) {
    const rows = await allRows(actorSheetId);
    return rows
      .map((r) => ({
        photo_id: r.photo_id as string,
        url: r.url as string,
        uploader_name: (r.uploader_name as string | null) ?? null,
        status: normalizeStatus(r),
        size_bytes: Number(r.size_bytes ?? 0),
        uploaded_at: (r._created_at as string | undefined) ?? null,
        queued: r.queued,
      }))
      .sort((a, b) => String(b.uploaded_at ?? "").localeCompare(String(a.uploaded_at ?? "")));
  },

  async setStatus(actorSheetId: string, photoId: string, status: PhotoStatus): Promise<boolean> {
    try {
      if (GuestPhotosQueue.updateStatus(actorSheetId, photoId, status)) return true;
      const row = await GuestPhotosModel.findById(actorSheetId, photoId);
      if (!row) return false;
      await GuestPhotosModel.update(actorSheetId, photoId, { status });
      return true;
    } finally {
      galleryCache.delete(actorSheetId);
    }
  },

  /**
   * Removes the metadata row (or cancels it if still queued) and the stored file.
   * Row first, file second: if the file delete fails the photo is already gone from
   * the site — we log the orphan instead of resurrecting it.
   */
  async remove(actorSheetId: string, photoId: string): Promise<boolean> {
    try {
      const queued = GuestPhotosQueue.cancel(actorSheetId, photoId);
      let key: string | undefined = queued?.storage_key as string | undefined;
      if (!queued) {
        const row = await GuestPhotosModel.findById(actorSheetId, photoId);
        if (!row) return false;
        key = row.storage_key as string;
        await GuestPhotosModel.delete(actorSheetId, photoId);
      }
      if (key) {
        await photoStorage()
          .delete(key)
          .catch((err) => console.error(`[guest-photos] orphaned file ${key}: could not delete`, err));
      }
      return true;
    } finally {
      galleryCache.delete(actorSheetId);
    }
  },

  async removeMany(actorSheetId: string, photoIds: string[]) {
    let removed = 0;
    for (const id of photoIds) {
      if (await GuestPhotosService.remove(actorSheetId, id)) removed += 1;
    }
    return removed;
  },
};

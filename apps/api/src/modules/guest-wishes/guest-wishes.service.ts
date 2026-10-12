import { randomUUID } from "node:crypto";
import { RateLimiter } from "../../utils/rate-limit.js";
import { TtlCache } from "../../utils/ttl-cache.js";
import { PublicSiteService } from "../public-site/public-site.service.js";
import { photoSettingsFromProfile, PHOTO_STATUSES, type PhotoStatus } from "../guest-photos/guest-photos.limits.js";
import { GuestWishesModel } from "./guest-wishes.model.js";
import { GuestWishesQueue } from "./guest-wishes.queue.js";

export const WISH_MAX_LENGTH = 500;
// Guests can't type their way into huge numbers: a gift report above this is rejected
// as a typo/abuse rather than clamped (clamping would silently change what they meant).
const MAX_REPORTED_GIFT = { USD: 100_000, KHR: 400_000_000 } as const;
const CURRENCIES = ["USD", "KHR"] as const;
type Currency = (typeof CURRENCIES)[number];

export interface PublicWish {
  wish_id: string;
  name: string;
  message: string | null;
  photo_id: string | null;
}

export type WishResult =
  | { ok: true; wish_id: string; status: PhotoStatus }
  | {
      ok: false;
      status: 400 | 403 | 404 | 429;
      error: "not_found" | "uploads_disabled" | "invalid" | "rate_limited" | "guest_limit";
    };

const limiter = new RateLimiter(60 * 60 * 1000);
const wallCache = new TtlCache<PublicWish[]>(20_000, 1000);

function normalizeStatus(row: Record<string, unknown>): PhotoStatus {
  return (PHOTO_STATUSES as readonly unknown[]).includes(row.status) ? (row.status as PhotoStatus) : "pending";
}

type WishRow = Record<string, unknown> & { queued: boolean };

async function allRows(actorSheetId: string): Promise<WishRow[]> {
  const stored = await GuestWishesModel.findMany(actorSheetId);
  const queued = GuestWishesQueue.pending(actorSheetId);
  const queuedIds = new Set(queued.map((r) => r.wish_id));
  return [
    ...stored
      .filter((r) => !queuedIds.has(r.wish_id as string))
      .map((r): WishRow => ({ ...(r as Record<string, unknown>), queued: false })),
    ...queued.map((r): WishRow => ({ ...r, queued: true })),
  ];
}

export const GuestWishesService = {
  async submit(
    slug: string,
    input: {
      name: string;
      message?: string;
      photoId?: string;
      gift?: { amount: number; currency: string };
      ip: string;
      uploaderToken?: string;
    },
  ): Promise<WishResult> {
    const entry = await PublicSiteService.resolve(slug);
    if (!entry.site || !entry.actorSheetId) return { ok: false, status: 404, error: "not_found" };
    const actorSheetId = entry.actorSheetId;
    const settings = photoSettingsFromProfile(entry.site.profile as Record<string, unknown> | null);
    if (settings.mode === "off") return { ok: false, status: 403, error: "uploads_disabled" };

    const name = input.name?.trim().slice(0, 80);
    const message = input.message?.trim().slice(0, WISH_MAX_LENGTH);
    if (!name || (!message && !input.photoId && !input.gift)) {
      return { ok: false, status: 400, error: "invalid" };
    }

    let giftAmount = 0;
    let giftCurrency: Currency | undefined;
    if (input.gift) {
      const amount = Number(input.gift.amount);
      const currency = input.gift.currency as Currency;
      if (!CURRENCIES.includes(currency) || !Number.isFinite(amount) || amount <= 0 || amount > MAX_REPORTED_GIFT[currency]) {
        return { ok: false, status: 400, error: "invalid" };
      }
      giftAmount = Math.round(amount * 100) / 100;
      giftCurrency = currency;
    }

    if (!limiter.hit(`${slug}:${input.ip}`, settings.ratePerIpPerHour)) {
      return { ok: false, status: 429, error: "rate_limited" };
    }
    const token = input.uploaderToken || `ip:${input.ip}`;
    const mine = (await allRows(actorSheetId)).filter((r) => r.uploader_token === token).length;
    if (mine >= settings.maxPerGuest) return { ok: false, status: 429, error: "guest_limit" };

    const wishId = randomUUID();
    const status: PhotoStatus = settings.mode === "auto" ? "approved" : "pending";
    GuestWishesQueue.enqueue(actorSheetId, {
      wish_id: wishId,
      name,
      message: message || undefined,
      photo_id: input.photoId || undefined,
      uploader_token: token,
      status,
      gift_amount: giftAmount,
      gift_currency: giftCurrency,
    });
    if (status === "approved") wallCache.delete(actorSheetId);
    return { ok: true, wish_id: wishId, status };
  },

  async listPublic(slug: string): Promise<PublicWish[] | null> {
    const entry = await PublicSiteService.resolve(slug);
    if (!entry.site || !entry.actorSheetId) return null;
    const actorSheetId = entry.actorSheetId;
    return wallCache.getOrLoad(actorSheetId, async () => {
      const rows = await allRows(actorSheetId);
      return rows
        .filter((r) => normalizeStatus(r) === "approved" && r.message)
        .map((r) => ({
          wish_id: r.wish_id as string,
          name: r.name as string,
          message: (r.message as string | null) ?? null,
          photo_id: (r.photo_id as string | null) ?? null,
        }));
    });
  },

  async list(actorSheetId: string) {
    const rows = await allRows(actorSheetId);
    return rows
      .map((r) => ({
        wish_id: r.wish_id as string,
        name: r.name as string,
        message: (r.message as string | null) ?? null,
        photo_id: (r.photo_id as string | null) ?? null,
        status: normalizeStatus(r),
        gift_amount: Number(r.gift_amount ?? 0),
        gift_currency: (r.gift_currency as string | null) ?? null,
        created_at: (r._created_at as string | undefined) ?? null,
        queued: r.queued,
      }))
      .sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
  },

  async setStatus(actorSheetId: string, wishId: string, status: PhotoStatus): Promise<boolean> {
    try {
      if (GuestWishesQueue.patch(actorSheetId, wishId, { status })) return true;
      const row = await GuestWishesModel.findById(actorSheetId, wishId);
      if (!row) return false;
      await GuestWishesModel.update(actorSheetId, wishId, { status });
      return true;
    } finally {
      wallCache.delete(actorSheetId);
    }
  },

  async remove(actorSheetId: string, wishId: string): Promise<boolean> {
    try {
      if (GuestWishesQueue.cancel(actorSheetId, wishId)) return true;
      const row = await GuestWishesModel.findById(actorSheetId, wishId);
      if (!row) return false;
      await GuestWishesModel.delete(actorSheetId, wishId);
      return true;
    } finally {
      wallCache.delete(actorSheetId);
    }
  },

  /**
   * Turns a guest's self-reported gift into a confirmed record on their guest row
   * (matched by name, created if the guest isn't on the list). Idempotent: running it
   * again overwrites with the same values.
   */
  async recordGift(actorSheetId: string, wishId: string): Promise<{ guest_id: string } | null> {
    const wish = await GuestWishesModel.findById(actorSheetId, wishId);
    if (!wish || !Number(wish.gift_amount)) return null;

    const fields = {
      gift_status: "received",
      gift_type: "cash",
      gift_amount: Number(wish.gift_amount),
      gift_currency: wish.gift_currency as string,
      gift_received_date: new Date().toISOString(),
    };
    const existing = await GuestWishesModel.findGuestByName(actorSheetId, wish.name as string);
    if (existing) {
      await GuestWishesModel.updateGuest(actorSheetId, existing.guest_id as string, fields);
      return { guest_id: existing.guest_id as string };
    }
    const guestId = randomUUID();
    await GuestWishesModel.createGuest(actorSheetId, {
      guest_id: guestId,
      name: wish.name as string,
      status: "confirmed",
      ...fields,
    });
    return { guest_id: guestId };
  },
};

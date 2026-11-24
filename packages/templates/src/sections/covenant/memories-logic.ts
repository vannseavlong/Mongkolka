import type { GuestbookData, GuestbookPhoto, GuestbookWish } from "../../types";

/** How many of the latest photos and wishes the invitation page shows before "see all". */
export const PREVIEW_PHOTOS = 6;
export const PREVIEW_WISHES = 3;

export interface MemoriesView {
  photos: GuestbookPhoto[];
  wishes: GuestbookWish[];
  /** Total counts, so the buttons can say there is more. */
  photoTotal: number;
  wishTotal: number;
  hasMorePhotos: boolean;
  hasMoreWishes: boolean;
}

/** Wishes that carry words (a photo-only wish is shown with the photos). The API sends newest first; the order is kept. */
export function wishesWithWords(data: GuestbookData | undefined): GuestbookWish[] {
  return (data?.wishes ?? []).filter((w) => (w.message ?? "").trim().length > 0);
}

export function memoriesView(data: GuestbookData | undefined, maxPhotos = PREVIEW_PHOTOS, maxWishes = PREVIEW_WISHES): MemoriesView {
  const allPhotos = (data?.photos ?? []).filter((p) => !!p.url);
  const allWishes = wishesWithWords(data);
  return {
    photos: allPhotos.slice(0, Math.max(0, maxPhotos)),
    wishes: allWishes.slice(0, Math.max(0, maxWishes)),
    photoTotal: allPhotos.length,
    wishTotal: allWishes.length,
    hasMorePhotos: allPhotos.length > maxPhotos,
    hasMoreWishes: allWishes.length > maxWishes,
  };
}

/** A site-relative sub-route for the couple's slug: `/<slug>/wishes`. The slug is encoded; anything empty gives null. */
export function subRoute(slug: string | undefined, page: "wishes" | "photos"): string | null {
  const s = (slug ?? "").trim();
  return s ? `/${encodeURIComponent(s)}/${page}` : null;
}

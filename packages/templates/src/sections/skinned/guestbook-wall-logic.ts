import type { GuestbookData, GuestbookPhoto, GuestbookWish } from "../../types";

/** One card on the wall: a wish (with its photo, if any) or a photo shared without words. */
export type WallItem =
  | { kind: "wish"; key: string; wish: GuestbookWish; photo?: GuestbookPhoto }
  | { kind: "photo"; key: string; photo: GuestbookPhoto };

const ASPECTS = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[2/3]", "aspect-square"] as const;

/** Stable per-item aspect: depends only on the id, so adding items never reshapes other tiles. */
export function aspectFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ASPECTS[h % ASPECTS.length]!;
}

/** Wishes first (each with the photo it came with), then photos nobody attached a wish to. */
export function buildWall(data: GuestbookData | undefined): WallItem[] {
  const photos = data?.photos ?? [];
  const wishes = data?.wishes ?? [];
  const byId = new Map(photos.map((p) => [p.photo_id, p]));
  const used = new Set<string>();
  const items: WallItem[] = wishes.map((w) => {
    const photo = w.photo_id ? byId.get(w.photo_id) : undefined;
    if (photo) used.add(photo.photo_id);
    return { kind: "wish", key: `w-${w.wish_id}`, wish: w, photo };
  });
  for (const p of photos) if (!used.has(p.photo_id)) items.push({ kind: "photo", key: `p-${p.photo_id}`, photo: p });
  return items;
}

export interface FormErrors {
  name: boolean;
  /** Neither a wish nor a photo. */
  empty: boolean;
}

/** What is wrong with the form, shown only after the first submit attempt. */
export function formErrors(input: { name: string; message: string; hasPhoto: boolean }, tried: boolean): FormErrors {
  return { name: tried && !input.name.trim(), empty: tried && !input.message.trim() && !input.hasPhoto };
}

/** Where focus goes after a failed attempt: the first field that needs attention, or null if it can submit. */
export function firstInvalid(input: { name: string; message: string; hasPhoto: boolean }): "name" | "wish" | null {
  if (!input.name.trim()) return "name";
  if (!input.message.trim() && !input.hasPhoto) return "wish";
  return null;
}

export const ERROR_KEY = {
  tooBig: "grace.guestbook.errorTooBig",
  type: "grace.guestbook.errorType",
  limit: "grace.guestbook.errorLimit",
  off: "grace.guestbook.errorOff",
  network: "grace.guestbook.errorNetwork",
} as const;

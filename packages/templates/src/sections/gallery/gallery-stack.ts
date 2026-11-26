/** Pure rules for a gallery that stacks several layouts (masonry, then carousel, ...). No React. */
import type { GalleryStackBlock } from "../../types";
import { homeLimit } from "../covenant/gallery-logic";

/** Layouts a stack may use. The Covenant/Skin/Plates styles draw their own frame and button, so they stay single. */
export const STACKABLE_LAYOUTS = ["gallery_grid", "gallery_masonry", "gallery_carousel"] as const;
export type StackableLayout = (typeof STACKABLE_LAYOUTS)[number];

export const isStackable = (layout: unknown): layout is StackableLayout => typeof layout === "string" && (STACKABLE_LAYOUTS as readonly string[]).includes(layout);

/** The photos the invitation page shows: all of them, or the couple's `maxPhotos` (clamped) when they set one. */
export function limitPhotos<T>(photos: readonly T[], maxPhotos: unknown): T[] {
  const set = typeof maxPhotos === "number" ? Number.isFinite(maxPhotos) : typeof maxPhotos === "string" && maxPhotos.trim() !== "";
  return set ? photos.slice(0, homeLimit(maxPhotos)) : [...photos];
}

export interface StackSlice {
  layout: StackableLayout;
  photos: string[];
}

/**
 * Hands the photos to the blocks in order. A block with a `count` takes that many; the last block (and any block
 * without a count) takes whatever is left. Blocks that end up empty or use an unknown layout are dropped.
 */
export function stackSlices(photos: readonly string[], stack: readonly GalleryStackBlock[] | undefined): StackSlice[] {
  const blocks = (stack ?? []).filter((b) => isStackable(b?.layout));
  const out: StackSlice[] = [];
  let at = 0;
  blocks.forEach((b, i) => {
    const last = i === blocks.length - 1;
    const n = !last && Number.isInteger(b.count) && (b.count as number) > 0 ? (b.count as number) : photos.length - at;
    const slice = photos.slice(at, at + n);
    at += slice.length;
    if (slice.length > 0) out.push({ layout: b.layout as StackableLayout, photos: slice });
  });
  return out;
}

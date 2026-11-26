/** Pure rules for a gallery that stacks several layouts (masonry, then carousel, ...). No React. */
import type { GalleryStackBlock } from "../../types";
import { homeLimit } from "../covenant/gallery-logic";

import { createContext, useContext } from "react";

/** Where a layout sits in a stack. Styles that draw their own heading show it only when `first`. */
const StackPosition = createContext<{ first: boolean }>({ first: true });
export const StackPositionProvider = StackPosition.Provider;
export const useIsFirstInStack = (): boolean => useContext(StackPosition).first;

/** The photos the invitation page shows: all of them, or the couple's `maxPhotos` (clamped) when they set one. */
export function limitPhotos<T>(photos: readonly T[], maxPhotos: unknown): T[] {
  const set = typeof maxPhotos === "number" ? Number.isFinite(maxPhotos) : typeof maxPhotos === "string" && maxPhotos.trim() !== "";
  return set ? photos.slice(0, homeLimit(maxPhotos)) : [...photos];
}

export interface StackSlice {
  layout: string;
  photos: string[];
}

/**
 * Hands the photos to the blocks in order. A block with a `count` takes that many; the last block (and any block
 * without a count) takes whatever is left. Blocks that end up empty or use a layout `isKnown` rejects are dropped.
 */
export function stackSlices(photos: readonly string[], stack: readonly GalleryStackBlock[] | undefined, isKnown: (layout: string) => boolean = () => true): StackSlice[] {
  const blocks = (stack ?? []).filter((b) => typeof b?.layout === "string" && isKnown(b.layout));
  const out: StackSlice[] = [];
  let at = 0;
  blocks.forEach((b, i) => {
    const last = i === blocks.length - 1;
    const n = !last && Number.isInteger(b.count) && (b.count as number) > 0 ? (b.count as number) : photos.length - at;
    const slice = photos.slice(at, at + n);
    at += slice.length;
    if (slice.length > 0) out.push({ layout: b.layout, photos: slice });
  });
  return out;
}

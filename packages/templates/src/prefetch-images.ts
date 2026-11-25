"use client";

import { useEffect } from "react";
import { cleanPhotos } from "./sections/skinned/gallery-layout";
import type { Orientation } from "./hero-photo";
import { resolveHeroPhoto } from "./hero-photo";
import type { HeroContent } from "./types";

/** Gallery photos fetched ahead of time: the ones the section shows first (a multiple of its mosaic rows). */
export const PREFETCH_GALLERY = 9;

interface SectionLike {
  section_key: string;
  enabled: boolean;
  content?: unknown;
}

/**
 * The images worth warming while the cover/opening plays: the hero photo for this screen first, then the first
 * gallery photos. Pure and de-duplicated; empty when nothing is set.
 */
export function prefetchTargets(sections: readonly SectionLike[], orientation: Orientation, galleryLimit = PREFETCH_GALLERY): string[] {
  const out: string[] = [];
  const hero = sections.find((s) => s.section_key === "hero" && s.enabled);
  const heroUrl = resolveHeroPhoto(hero?.content as HeroContent | undefined, orientation);
  if (heroUrl) out.push(heroUrl);
  const gallery = sections.find((s) => s.section_key === "gallery" && s.enabled);
  const photos = cleanPhotos((gallery?.content as { photos?: unknown } | null | undefined)?.photos);
  out.push(...photos.slice(0, galleryLimit));
  return [...new Set(out)];
}

/** Starts downloading (and decoding) the images in the background so the browser cache has them before the section scrolls in. */
export function usePrefetchImages(urls: readonly string[]): void {
  const key = urls.join("\n");
  useEffect(() => {
    if (!key) return;
    const held: HTMLImageElement[] = [];
    for (const url of key.split("\n")) {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      void img.decode?.().catch(() => undefined); // a failed warm-up is harmless; the section handles its own errors
      held.push(img);
    }
    return () => {
      held.length = 0;
    };
  }, [key]);
}

import type { HeroContent } from "./types";

export type Orientation = "portrait" | "landscape";

const clean = (url: unknown): string | undefined => (typeof url === "string" && url.trim() ? url.trim() : undefined);

/**
 * The hero photo for a screen: the banner made for that orientation, else the other banner, else the profile
 * cover photo. One banner alone is used everywhere; none leaves the hero without a photo (its own fallback).
 */
export function resolveHeroPhoto(content: HeroContent | undefined, orientation: Orientation): string | undefined {
  const portrait = clean(content?.portraitUrl);
  const landscape = clean(content?.landscapeUrl);
  const cover = clean(content?.coverPhotoUrl);
  return orientation === "portrait" ? (portrait ?? landscape ?? cover) : (landscape ?? portrait ?? cover);
}

/** Merges the profile-derived hero content with the section's own (banners) and picks the photo for this screen. */
export function heroContentFor(derived: unknown, stored: unknown, orientation: Orientation): HeroContent {
  const asObject = (v: unknown): HeroContent => (v && typeof v === "object" && !Array.isArray(v) ? (v as HeroContent) : {});
  const merged: HeroContent = { ...asObject(derived), ...asObject(stored) };
  return { ...merged, coverPhotoUrl: resolveHeroPhoto(merged, orientation) };
}

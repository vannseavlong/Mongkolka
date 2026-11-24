/** Pure rules for the Covenant hero's photo reveal. No JSX. */

export type HeroPhase = "loading" | "reveal";

/** How long to wait for the photo before revealing anyway (a slow or broken link must not hold the page). */
export const PHOTO_WAIT_MS = 6000;

/** The photo URL if it is something an <img> may load (https or site-relative), else null. */
export function usablePhoto(url: string | undefined | null): string | null {
  const u = (url ?? "").trim();
  if (!u) return null;
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  try {
    return new URL(u).protocol === "https:" ? u : null;
  } catch {
    return null;
  }
}

/** `loading` until the photo has loaded (or failed, or there is none); then `reveal`. */
export function nextHeroPhase(photo: string | null, event: "loaded" | "failed" | "timeout" | "mount"): HeroPhase {
  if (!photo) return "reveal";
  return event === "mount" ? "loading" : "reveal";
}

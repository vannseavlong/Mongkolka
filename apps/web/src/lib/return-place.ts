/**
 * Remembering where the reader was when they opened the gallery sub-page, so coming back puts them in the same
 * place instead of replaying the cover and the opening from the top. Kept in sessionStorage per site; pure logic
 * here, storage in the small wrappers below.
 */

export interface ReturnPlace {
  /** Scroll position of the invitation when the reader left. */
  y: number;
  /** When they left (ms). */
  at: number;
  /** Set when they came back with the page's own back link (the browser's back button is detected separately). */
  returning: boolean;
}

/** Longer than this away and it is a fresh visit again. */
export const RETURN_MAX_AGE_MS = 30 * 60_000;

/** Should the invitation skip its intro and restore the scroll? Only when coming back, and recently. */
export function shouldRestore(place: ReturnPlace | null, navigationType: string | undefined, now: number): boolean {
  if (!place) return false;
  if (now - place.at > RETURN_MAX_AGE_MS || now < place.at) return false;
  return place.returning || navigationType === "back_forward";
}

const key = (slug: string) => `mk-return-${slug}`;

export function saveReturnPlace(slug: string, y: number): void {
  try {
    sessionStorage.setItem(key(slug), JSON.stringify({ y: Math.max(0, Math.round(y)), at: Date.now(), returning: false } satisfies ReturnPlace));
  } catch {
    /* storage unavailable (private mode): the invitation simply starts from the top */
  }
}

export function markReturning(slug: string): void {
  const place = readReturnPlace(slug);
  if (!place) return;
  try {
    sessionStorage.setItem(key(slug), JSON.stringify({ ...place, returning: true }));
  } catch {
    /* see above */
  }
}

export function readReturnPlace(slug: string): ReturnPlace | null {
  try {
    const raw = sessionStorage.getItem(key(slug));
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<ReturnPlace>;
    return typeof v.y === "number" && typeof v.at === "number" ? { y: v.y, at: v.at, returning: v.returning === true } : null;
  } catch {
    return null;
  }
}

export function clearReturnPlace(slug: string): void {
  try {
    sessionStorage.removeItem(key(slug));
  } catch {
    /* see above */
  }
}

/** "navigate", "reload", "back_forward" ... for the current page load. */
export function navigationType(): string | undefined {
  const entry = typeof performance !== "undefined" ? (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined) : undefined;
  return entry?.type;
}

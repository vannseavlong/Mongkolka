/** Decides whether a section should wait (hidden) until scrolled into view. Pure. */
export function shouldDeferReveal(rectTop: number, viewportHeight: number, reducedMotion: boolean): boolean {
  if (reducedMotion) return false;
  // Already on screen when the page appears: showing it instantly avoids a flash.
  return rectTop >= viewportHeight * 0.92;
}

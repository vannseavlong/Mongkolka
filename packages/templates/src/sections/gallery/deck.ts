/** Pure layout rules for the stacked carousel. No React. */

/** Cards drawn on each side of the front one. */
export const DECK_DEPTH = 2;
/** Sideways finger travel that counts as a swipe. */
export const DECK_SWIPE_PX = 40;

/** Position of card `i` relative to the front card, taking the shorter way round the loop. */
export function deckOffset(i: number, front: number, total: number): number {
  if (total <= 0) return 0;
  const d = (((i - front) % total) + total) % total;
  return d > total / 2 ? d - total : d;
}

/** Where a card sits: neighbours peek out from behind, smaller and tilted; the rest wait hidden. */
export function deckPose(offset: number) {
  const depth = Math.abs(offset);
  const near = Math.max(-DECK_DEPTH, Math.min(DECK_DEPTH, offset));
  return { x: `${near * 22}%`, scale: 1 - Math.abs(near) * 0.14, rotate: near * 5, opacity: depth > DECK_DEPTH ? 0 : 1 - depth * 0.18, zIndex: 20 - depth };
}

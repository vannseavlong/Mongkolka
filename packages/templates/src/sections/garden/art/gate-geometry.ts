/**
 * Pure geometry of the wrought-iron gate (one leaf, hinge on the left, meeting edge on the right).
 * No JSX: the Gate component only maps these numbers onto SVG, and the tests check them.
 */
export const LEAF_W = 200;
export const LEAF_H = 700;
/** Cross rails (y in the leaf box). */
export const RAIL_MID = 330;
export const RAIL_LOW = 636;

/** Height of the top arch rail at x (a gentle curve rising toward the meeting edge). */
export function archY(x: number): number {
  const t = Math.min(1, Math.max(0, x / LEAF_W));
  // quadratic ease: low at the hinge, highest at the centre line
  return 140 - 112 * (1 - (1 - t) * (1 - t));
}

export interface Bar {
  x: number;
  top: number;
  bottom: number;
  /** Spear finial height above the rail. */
  finial: number;
}

export function gateBars(count = 7): Bar[] {
  const gap = LEAF_W / count;
  return Array.from({ length: count }, (_, i) => {
    const x = gap * (i + 0.5);
    const top = archY(x);
    return { x: Math.round(x * 10) / 10, top, bottom: LEAF_H - 14, finial: i % 2 === 0 ? 20 : 14 };
  });
}

/** Path of the arch rail along the top of the leaf. */
export function archRailPath(): string {
  const pts: string[] = [];
  for (let x = 0; x <= LEAF_W; x += 10) pts.push(`${x === 0 ? "M" : "L"}${x} ${archY(x).toFixed(1)}`);
  return pts.join("");
}

/** A spear-point finial on a bar: a diamond head with a collar. */
export function finialPath(x: number, y: number, h: number): string {
  return `M${x} ${y - h}L${x + 5} ${y - h * 0.35}L${x + 2.2} ${y}L${x - 2.2} ${y}L${x - 5} ${y - h * 0.35}Z`;
}

/** A C-scroll for the lower panel between two bars: open spiral on the left of x, mirrored via `dir`. */
export function scrollPath(cx: number, cy: number, r: number, dir: 1 | -1): string {
  const x = (n: number) => (cx + n * dir).toFixed(1);
  return `M${x(0)} ${cy - r}C${x(r * 1.2)} ${cy - r} ${x(r * 1.2)} ${cy + r * 0.6} ${x(0)} ${cy + r * 0.6}C${x(-r * 0.6)} ${cy + r * 0.6} ${x(-r * 0.6)} ${cy - r * 0.1} ${x(0)} ${cy - r * 0.1}`;
}

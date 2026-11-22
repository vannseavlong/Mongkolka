/** Pure geometry for the kids artwork (kept apart from the JSX so it can be tested). */

export interface Flag {
  x: number;
  y: number;
  rot: number;
}

/** Flags hung along a quadratic sag from (0,2) through the control point (width/2, 2+2*sag), so the middle hangs `sag` lower to (width,2). */
export function buntingFlags(count: number, width: number, sag: number): Flag[] {
  const y0 = 2;
  const cy = y0 + sag * 2;
  return Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    const x = (1 - t) ** 2 * 0 + 2 * (1 - t) * t * (width / 2) + t ** 2 * width;
    const y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t ** 2 * y0;
    // tangent of the curve, so each flag hangs along the string
    const dx = 2 * (1 - t) * (width / 2) + 2 * t * (width / 2);
    const dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y0 - cy);
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, rot: Math.round((Math.atan2(dy, dx) * 180) / Math.PI * 10) / 10 };
  });
}

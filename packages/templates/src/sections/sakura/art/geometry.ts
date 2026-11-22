/** Tiny pure geometry + seeded random helpers for the Sakura artwork. No JSX, no DOM. */

/** Deterministic PRNG (mulberry32): the same seed always draws the same branch. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rounds to one decimal so the SVG stays small. */
export const n1 = (x: number): number => Math.round(x * 10) / 10;

export interface Pt {
  x: number;
  y: number;
}

export function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
}

/** Points along an arch outline: left pillar up, a half-ellipse over the top, right pillar down. */
export function archPoints(cx: number, baseY: number, halfW: number, shoulderY: number, count: number): Pt[] {
  const pillar = baseY - shoulderY;
  const arc = Math.PI * halfW;
  const total = pillar * 2 + arc;
  const pts: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const d = (i / (count - 1)) * total;
    if (d <= pillar) pts.push({ x: cx - halfW, y: baseY - d });
    else if (d <= pillar + arc) {
      const a = Math.PI - ((d - pillar) / arc) * Math.PI;
      pts.push({ x: cx + Math.cos(a) * halfW, y: shoulderY - Math.sin(a) * halfW });
    } else pts.push({ x: cx + halfW, y: shoulderY + (d - pillar - arc) });
  }
  return pts;
}

/** `data:` URI for an SVG string, safe inside a CSS `url("...")`. */
export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22")}`;
}

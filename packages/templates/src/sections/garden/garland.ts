export type GarlandKind = "rose" | "leaf" | "bud";

export interface GarlandItem {
  kind: GarlandKind;
  /** Position in a 100 x 50 box whose top edge is the crown of the arch (springing line at y = 50). */
  x: number;
  y: number;
  size: number;
  rot: number;
}

/**
 * Items of the flower garland draped over the arch frame: roses (biggest at the crown), leaves that
 * follow the curve, buds between. Pure and deterministic, so the render and the tests agree.
 */
export function archGarland(count = 17): GarlandItem[] {
  const items: GarlandItem[] = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.PI * (i / (count - 1));
    const x = 50 - 50 * Math.cos(theta);
    const y = 50 - 50 * Math.sin(theta);
    const crown = Math.sin(theta); // 0 at the feet, 1 at the top
    const tangent = (theta * 180) / Math.PI - 90; // follows the curve
    const kind: GarlandKind = i % 3 === 0 ? "rose" : i % 3 === 1 ? "leaf" : "bud";
    const size = kind === "rose" ? 10 + 6 * crown : kind === "leaf" ? 11 : 6;
    items.push({ kind, x: round(x), y: round(y), size: round(size), rot: Math.round(tangent + (kind === "leaf" ? (i % 2 ? 20 : -20) : 0)) });
  }
  return items;
}

const round = (n: number) => Math.round(n * 10) / 10;

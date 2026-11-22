/** Deterministic layout of the floral wreath around the hero oval. Pure, tested, no randomness at render time. */

export type WreathKind = "peony" | "rose" | "bud" | "leaf";

export interface WreathItem {
  kind: WreathKind;
  x: number;
  y: number;
  /** Degrees; flowers face outward from the oval, leaves fan along it. */
  rot: number;
  scale: number;
}

/** Small seeded generator (mulberry32) so the same inputs always give the same wreath on server and client. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Flowers sit on an ellipse (cx,cy,rx,ry). The garland is heaviest at the bottom and lightest at the
 * top-sides, like a real arch of blooms: `weight` peaks at the bottom (90 degrees) and dips at the top.
 */
/** Base size of each kind at weight 1; exported so tests can compare like with like. */
export const BASE_SCALE: Record<WreathKind, number> = { peony: 1.0, rose: 0.82, bud: 0.7, leaf: 1.15 };

export function wreathPlacements(cx: number, cy: number, rx: number, ry: number, count = 18, seed = 7): WreathItem[] {
  const rand = seeded(seed);
  const items: WreathItem[] = [];
  const kinds: WreathKind[] = ["peony", "rose", "peony", "bud", "rose"];
  for (let i = 0; i < count; i++) {
    // Start at the bottom-left, wind round the oval once.
    const t = (i / count) * Math.PI * 2 + Math.PI / 2 + 0.2;
    const x = cx + Math.cos(t) * rx;
    const y = cy + Math.sin(t) * ry;
    const bottom = (Math.sin(t) + 1) / 2; // 0 top .. 1 bottom
    const weight = 0.7 + 0.55 * bottom ** 2;
    const outward = (Math.atan2(Math.sin(t) * rx, Math.cos(t) * ry) * 180) / Math.PI + 90;
    const kind = kinds[i % kinds.length]!;
    const jitter = (rand() - 0.5) * 0.18;
    items.push({
      kind,
      x: round(x + (rand() - 0.5) * 6),
      y: round(y + (rand() - 0.5) * 6),
      rot: round(outward + (rand() - 0.5) * 40),
      scale: round(BASE_SCALE[kind] * weight * (1 + jitter)),
    });
    // Two leaves fanned behind each bloom.
    for (const side of [-1, 1]) {
      items.push({
        kind: "leaf",
        x: round(x),
        y: round(y),
        rot: round(outward + side * (62 + rand() * 18)),
        scale: round(BASE_SCALE.leaf * weight * (0.9 + rand() * 0.3)),
      });
    }
  }
  return items;
}

const round = (n: number) => Math.round(n * 100) / 100;

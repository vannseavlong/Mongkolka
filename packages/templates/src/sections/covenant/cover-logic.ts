import { unit } from "./intro-logic";

/** Placement tables for the Covenant covers. Fixed numbers (not random) so the scene is the same every time and testable. */

export type CoverTone = "gold" | "rose" | "blush" | "white";

export interface CoverButterfly {
  /** Resting position, % of the screen. */
  x: number;
  y: number;
  /** Wing span in px. */
  size: number;
  /** When it starts flying in, ms. */
  delay: number;
  /** Resting tilt, degrees. */
  rot: number;
  tone: CoverTone;
}

export const BUTTERFLIES: readonly CoverButterfly[] = [
  { x: 14, y: 20, size: 58, delay: 200, rot: -18, tone: "gold" },
  { x: 85, y: 17, size: 48, delay: 500, rot: 16, tone: "rose" },
  { x: 20, y: 74, size: 42, delay: 900, rot: 14, tone: "rose" },
  { x: 82, y: 70, size: 60, delay: 300, rot: -12, tone: "gold" },
  { x: 50, y: 9, size: 36, delay: 1200, rot: 0, tone: "gold" },
  { x: 7, y: 47, size: 32, delay: 1500, rot: -8, tone: "rose" },
  { x: 93, y: 45, size: 34, delay: 1100, rot: 10, tone: "gold" },
];

/** Where a butterfly flies in from: the nearer side edge, below the screen. Returns vw / vh offsets. */
export function butterflyEntry(b: CoverButterfly): { dx: number; dy: number } {
  return { dx: b.x < 50 ? -70 : 70, dy: 45 };
}

export interface CoverSparkle {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export const SPARKLES: readonly CoverSparkle[] = [
  { x: 18, y: 30, size: 12, delay: 600, duration: 2600 },
  { x: 80, y: 26, size: 16, delay: 1100, duration: 3100 },
  { x: 10, y: 58, size: 10, delay: 1700, duration: 2800 },
  { x: 90, y: 62, size: 12, delay: 900, duration: 3400 },
  { x: 30, y: 86, size: 14, delay: 2100, duration: 2900 },
  { x: 70, y: 90, size: 10, delay: 1400, duration: 3200 },
  { x: 44, y: 14, size: 10, delay: 2400, duration: 3000 },
  { x: 60, y: 12, size: 14, delay: 800, duration: 2700 },
];

/** Large butterflies that cross the whole screen on a loop (see the cvc-fly-* keyframes). */
export interface CoverFlyer {
  path: "a" | "b" | "c";
  size: number;
  delay: number;
  duration: number;
  tone: CoverTone;
}

/** White doves that cross the screen in the garden cover (same flight paths as the butterflies). */
export const DOVES: readonly Omit<CoverFlyer, "tone">[] = [
  { path: "b", size: 92, delay: 1200, duration: 12500 },
  { path: "a", size: 76, delay: 5200, duration: 13500 },
];

export const FLYERS: readonly CoverFlyer[] = [
  { path: "a", size: 84, delay: 600, duration: 10500, tone: "gold" },
  { path: "b", size: 70, delay: 2600, duration: 11500, tone: "rose" },
  { path: "c", size: 60, delay: 4200, duration: 9500, tone: "gold" },
];

export interface Region {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface Bloom {
  /** Centre, % of the screen. */
  x: number;
  y: number;
  /** Width in vmin. */
  size: number;
  tone: CoverTone;
  rot: number;
  /** ms */
  delay: number;
  /** Far blooms are smaller, softer and blurred for depth. */
  far: boolean;
}

export interface Leafy {
  x: number;
  y: number;
  /** Width in vmin. */
  size: number;
  rot: number;
  delay: number;
  deep: boolean;
}

const TONE_CYCLE: readonly CoverTone[] = ["rose", "blush", "white", "blush", "rose", "gold", "white", "blush"];

/** Deterministic blooms scattered inside a region: the same every render, no Math.random. */
export function bloomCluster(region: Region, count: number, seed: number): Bloom[] {
  const n = Math.max(0, Math.floor(count));
  return Array.from({ length: n }, (_, i) => {
    const far = unit(i, seed + 1) > 0.55;
    return {
      x: region.x0 + unit(i, seed + 2) * (region.x1 - region.x0),
      y: region.y0 + unit(i, seed + 3) * (region.y1 - region.y0),
      size: far ? 4 + unit(i, seed + 4) * 4 : 8 + unit(i, seed + 4) * 8,
      tone: TONE_CYCLE[Math.floor(unit(i, seed + 5) * TONE_CYCLE.length)]!,
      rot: Math.round(unit(i, seed + 6) * 360),
      delay: 300 + Math.round(unit(i, seed + 7) * 1500),
      far,
    };
  });
}

export function leafCluster(region: Region, count: number, seed: number): Leafy[] {
  const n = Math.max(0, Math.floor(count));
  return Array.from({ length: n }, (_, i) => ({
    x: region.x0 + unit(i, seed + 12) * (region.x1 - region.x0),
    y: region.y0 + unit(i, seed + 13) * (region.y1 - region.y0),
    size: 5 + unit(i, seed + 14) * 7,
    rot: Math.round(unit(i, seed + 15) * 360),
    delay: 200 + Math.round(unit(i, seed + 16) * 1400),
    deep: unit(i, seed + 17) > 0.5,
  }));
}

/** Where the foliage sits: a hanging garland across the top, the two sides, and a bank along the bottom. */
export const FOLIAGE_REGIONS: readonly { region: Region; blooms: number; leaves: number }[] = [
  { region: { x0: 0, x1: 100, y0: -2, y1: 12 }, blooms: 16, leaves: 22 },
  { region: { x0: -2, x1: 14, y0: 8, y1: 92 }, blooms: 12, leaves: 18 },
  { region: { x0: 86, x1: 102, y0: 8, y1: 92 }, blooms: 12, leaves: 18 },
  { region: { x0: 0, x1: 100, y0: 86, y1: 102 }, blooms: 20, leaves: 24 },
];

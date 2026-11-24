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

export interface CoverFlower {
  x: number;
  y: number;
  size: number;
  delay: number;
  tone: CoverTone;
}

export const FLOWERS: readonly CoverFlower[] = [
  { x: 4, y: 5, size: 96, delay: 200, tone: "rose" },
  { x: 96, y: 5, size: 96, delay: 350, tone: "blush" },
  { x: 14, y: 14, size: 54, delay: 900, tone: "gold" },
  { x: 86, y: 14, size: 54, delay: 1000, tone: "white" },
  { x: 6, y: 96, size: 104, delay: 500, tone: "blush" },
  { x: 24, y: 99, size: 70, delay: 1100, tone: "gold" },
  { x: 42, y: 101, size: 60, delay: 1500, tone: "rose" },
  { x: 60, y: 101, size: 60, delay: 1400, tone: "white" },
  { x: 77, y: 99, size: 72, delay: 1200, tone: "gold" },
  { x: 95, y: 96, size: 104, delay: 600, tone: "rose" },
];

/** Where a butterfly flies in from: the nearer side edge, below the screen. Returns vw / vh offsets. */
export function butterflyEntry(b: CoverButterfly): { dx: number; dy: number } {
  return { dx: b.x < 50 ? -70 : 70, dy: 45 };
}

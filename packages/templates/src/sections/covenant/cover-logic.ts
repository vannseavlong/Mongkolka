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

/** Points on a circle around the medallion, as % of its box (centre 50,50). `angle` is the outward direction in degrees. */
export function wreath(count: number, radius: number): { x: number; y: number; angle: number }[] {
  const n = Math.max(0, Math.floor(count));
  return Array.from({ length: n }, (_, i) => {
    const angle = (360 / n) * i - 90;
    const rad = (angle * Math.PI) / 180;
    return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad), angle };
  });
}

/** First letter of a name for the monogram (code point aware, so Khmer and emoji do not split). "" when empty. */
export function initialOf(name: string | undefined): string {
  const first = Array.from((name ?? "").trim())[0];
  return first ? first.toLocaleUpperCase() : "";
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

export const FLYERS: readonly CoverFlyer[] = [
  { path: "a", size: 84, delay: 600, duration: 10500, tone: "gold" },
  { path: "b", size: 70, delay: 2600, duration: 11500, tone: "rose" },
  { path: "c", size: 60, delay: 4200, duration: 9500, tone: "gold" },
];

/** One corner vine, drawn in a 200x200 box anchored at the top-left; the other corners mirror it. */
export const VINE = {
  stem: "M-4 22 C40 18 86 34 104 74 C118 106 98 140 62 156",
  tendril: "M104 74 C122 64 138 74 132 90",
  /** Leaves along the stem: position, rotation (deg), scale. */
  leaves: [
    { x: 30, y: 21, rot: 12, s: 1 },
    { x: 56, y: 28, rot: -38, s: 0.9 },
    { x: 78, y: 46, rot: 40, s: 1.1 },
    { x: 100, y: 68, rot: -60, s: 0.9 },
    { x: 108, y: 96, rot: 70, s: 1 },
    { x: 98, y: 124, rot: -110, s: 0.9 },
    { x: 78, y: 148, rot: 150, s: 0.8 },
    { x: 132, y: 90, rot: 20, s: 0.7 },
  ],
  /** Where a bloom sits at the end of the stem (garden cover). */
  bloom: { x: 58, y: 158, size: 46 },
} as const;

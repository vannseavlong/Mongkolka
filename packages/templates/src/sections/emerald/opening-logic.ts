/** Pure timing and particle maths for the emerald door opening. No JSX, no timers. */

export type OpeningPhase = "closed" | "opening" | "done";

export interface OpeningTimeline {
  /** How long the doors take to swing (ms). */
  doorsMs: number;
  /** When `onOpen` fires, counted from the tap (ms). */
  totalMs: number;
}

export const FULL_TIMELINE: OpeningTimeline = { doorsMs: 1700, totalMs: 3000 };
/** Reduced motion: no swing, just a short beat so the tap still feels acknowledged. */
export const REDUCED_TIMELINE: OpeningTimeline = { doorsMs: 0, totalMs: 250 };

export function timelineFor(reducedMotion: boolean): OpeningTimeline {
  return reducedMotion ? REDUCED_TIMELINE : FULL_TIMELINE;
}

/** The only legal move out of `closed` is a tap; `opening` and `done` ignore further taps. */
export function nextPhase(phase: OpeningPhase, event: "tap" | "finished"): OpeningPhase {
  if (phase === "closed" && event === "tap") return "opening";
  if (phase === "opening" && event === "finished") return "done";
  return phase;
}

export interface Mote {
  /** Horizontal start, percent of the stage. */
  x: number;
  /** Diameter in px. */
  size: number;
  /** Seconds. */
  delay: number;
  duration: number;
  /** Sideways drift in px. */
  drift: number;
}

/** Deterministic pseudo-random in [0,1) from an integer; no Math.random, so server and client markup agree. */
export function unit(i: number, salt = 0): number {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function gildedMotes(count: number): Mote[] {
  return Array.from({ length: Math.max(0, Math.floor(count)) }, (_, i) => ({
    x: Math.round(unit(i, 1) * 100),
    size: 2 + Math.round(unit(i, 2) * 3),
    delay: Math.round(unit(i, 3) * 90) / 10,
    duration: 7 + Math.round(unit(i, 4) * 60) / 10,
    drift: Math.round((unit(i, 5) - 0.5) * 40),
  }));
}

export interface Spark {
  /** End offset from the centre, px. */
  dx: number;
  dy: number;
  size: number;
  delay: number;
}

/** A radial burst of sparks from the medallion, evenly spread with a little jitter. */
export function sparkBurst(count: number, radius: number): Spark[] {
  return Array.from({ length: Math.max(0, Math.floor(count)) }, (_, i) => {
    const angle = (Math.PI * 2 * i) / Math.max(1, count) + (unit(i, 6) - 0.5) * 0.4;
    const r = radius * (0.65 + unit(i, 7) * 0.5);
    return {
      dx: Math.round(Math.cos(angle) * r),
      dy: Math.round(Math.sin(angle) * r),
      size: 2 + Math.round(unit(i, 8) * 3),
      delay: Math.round(unit(i, 9) * 50) / 100,
    };
  });
}

type Pt = [number, number];

function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

/**
 * CSS `polygon()` of the pointed temple arch (the same ogive GateFrame strokes) in percent of the 400x640 gate,
 * so the doors can be clipped to the arch with one responsive clip-path. Pure; tested.
 */
export function archPolygon(steps = 14): string {
  const pts: Pt[] = [[0, 640], [0, 176]];
  for (let i = 1; i <= steps; i++) pts.push(bezier([0, 176], [0, 104], [112, 72], [200, 10], i / steps));
  for (let i = 1; i <= steps; i++) pts.push(bezier([200, 10], [288, 72], [400, 104], [400, 176], i / steps));
  pts.push([400, 640]);
  return `polygon(${pts.map(([x, y]) => `${((x / 400) * 100).toFixed(2)}% ${((y / 640) * 100).toFixed(2)}%`).join(",")})`;
}

/** True when the text contains Khmer script (U+1780-17FF, U+19E0-19FF). Latin names read better in the script face. */
export function hasKhmer(text: string): boolean {
  return /[\u1780-\u17FF\u19E0-\u19FF]/.test(text);
}

/**
 * The Sakura opening as a tiny pure timeline: the guest taps, the monogram bursts with light, a white
 * flash covers the cut, the misty blossom hallway dollies in, the gate fades and `onOpen` fires.
 * Times are milliseconds from the tap. No DOM, no React: the component only schedules these.
 */
export type OpeningPhase = "idle" | "burst" | "hallway" | "leave";

export interface OpeningStep {
  phase: Exclude<OpeningPhase, "idle">;
  at: number;
}

export const OPENING_STEPS: readonly OpeningStep[] = [
  { phase: "burst", at: 0 },
  { phase: "hallway", at: 1050 },
  { phase: "leave", at: 2450 },
];

/** When the guest is let into the site (after the gate has faded). */
export const OPENING_DONE_MS = 2900;

/** The phase on screen `elapsed` ms after the tap (used by tests and by the schedule). */
export function phaseAt(elapsed: number): OpeningPhase {
  let phase: OpeningPhase = "idle";
  for (const step of OPENING_STEPS) if (elapsed >= step.at) phase = step.phase;
  return phase;
}

/** Twinkle positions (percent) for the sparkle dust: fixed so server and client markup match. */
export const TWINKLES: ReadonlyArray<{ left: number; top: number; delay: number; scale: number }> = [
  { left: 12, top: 24, delay: 0.2, scale: 1 },
  { left: 84, top: 20, delay: 1.1, scale: 0.8 },
  { left: 26, top: 62, delay: 2.0, scale: 1.2 },
  { left: 72, top: 58, delay: 0.7, scale: 0.9 },
  { left: 8, top: 78, delay: 1.6, scale: 0.7 },
  { left: 90, top: 74, delay: 2.4, scale: 1.1 },
  { left: 48, top: 14, delay: 0.4, scale: 0.8 },
  { left: 58, top: 82, delay: 1.9, scale: 1 },
];

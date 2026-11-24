/** Pure phase and timing logic shared by every cover. No JSX, no timers. */

/** play: the scene animates. reveal: it fades away over the opening gate. done: it is gone. */
export type CoverPhase = "play" | "reveal" | "done";
export type CoverEvent = "tick" | "tap" | "finished";

export interface CoverTiming {
  /** How long the scene plays before it reveals by itself. */
  playMs: number;
  /** How long the reveal (fade away) takes. */
  revealMs: number;
}

export const COVER_TIMING: CoverTiming = { playMs: 6200, revealMs: 1600 };
/** Reduced motion: a still cover, auto-advancing after a short read, with a brief cross-fade. */
export const COVER_TIMING_REDUCED: CoverTiming = { playMs: 2500, revealMs: 200 };

export function coverTiming(reducedMotion: boolean): CoverTiming {
  return reducedMotion ? COVER_TIMING_REDUCED : COVER_TIMING;
}

/** A tap or the timer ends play early/on time; only the reveal timer ends the reveal. */
export function nextCoverPhase(phase: CoverPhase, event: CoverEvent): CoverPhase {
  if (phase === "play") return event === "tick" || event === "tap" ? "reveal" : phase;
  if (phase === "reveal") return event === "finished" ? "done" : phase;
  return phase;
}

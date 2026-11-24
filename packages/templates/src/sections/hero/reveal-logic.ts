/** Pure timing and layout maths for the reveal heroes (gift box, envelope, book). No JSX, no timers. */

export type RevealPhase = "idle" | "opening" | "open";

/** idle waits for a tap or the auto timer; opening plays the sequence; open is the finished hero. */
export function nextRevealPhase(phase: RevealPhase, event: "start" | "finished"): RevealPhase {
  if (phase === "idle") return event === "start" ? "opening" : phase;
  if (phase === "opening") return event === "finished" ? "open" : phase;
  return phase;
}

export interface RevealTiming {
  /** Waits this long in view before opening by itself if nobody taps. */
  autoMs: number;
  /** Length of the opening sequence. */
  openMs: number;
}

export const GIFT_TIMING: RevealTiming = { autoMs: 4500, openMs: 4200 };
export const BOOK_TIMING: RevealTiming = { autoMs: 4500, openMs: 4800 };

export interface Confetti {
  /** Sideways travel, px. */
  dx: number;
  /** How high it flies before falling, px (negative = up). */
  dy: number;
  rot: number;
  size: number;
  delay: number;
  tone: number;
}

/** Deterministic confetti: a fan of pieces thrown up and out of the box. */
export function confetti(count: number, unit: (i: number, salt?: number) => number): Confetti[] {
  const n = Math.max(0, Math.floor(count));
  return Array.from({ length: n }, (_, i) => {
    const spread = (i / Math.max(n - 1, 1)) * 2 - 1;
    return {
      dx: Math.round(spread * 220 + (unit(i, 1) - 0.5) * 70),
      dy: -Math.round(180 + unit(i, 2) * 200),
      rot: Math.round((unit(i, 3) - 0.5) * 900),
      size: 7 + Math.round(unit(i, 4) * 9),
      delay: Math.round(unit(i, 5) * 260),
      tone: Math.floor(unit(i, 6) * 4),
    };
  });
}

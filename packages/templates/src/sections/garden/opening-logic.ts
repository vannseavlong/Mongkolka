/**
 * Timing of the garden-gate opening as plain data, shared by the component (timers + CSS variables)
 * and the tests. Everything after the tap: the two leaves swing apart, the court is unveiled, the
 * tagline fades in, doves fly, then a soft fade hands over to the page.
 */
export interface GateTimeline {
  swingMs: number;
  taglineDelayMs: number;
  doveDelayMs: number;
  fadeDelayMs: number;
  fadeMs: number;
  /** When `onOpen` fires, counted from the tap. */
  totalMs: number;
}

export const GATE_TIMELINE: GateTimeline = {
  swingMs: 1800,
  taglineDelayMs: 1100,
  doveDelayMs: 1000,
  fadeDelayMs: 3300,
  fadeMs: 600,
  totalMs: 3950,
};

/** With reduced motion there is no animation: the invitation opens at once. */
export function timelineFor(reduceMotion: boolean): GateTimeline | null {
  return reduceMotion ? null : GATE_TIMELINE;
}

export type GatePhase = "closed" | "opening";

/** The tap is accepted once; later taps (or Enter) while opening are ignored. */
export function phaseAfterTap(phase: GatePhase): GatePhase {
  return phase === "closed" ? "opening" : phase;
}

export function canStart(phase: GatePhase): boolean {
  return phase === "closed";
}

/** CSS variables (ms) the stylesheet reads, so no duration is written twice. */
export function timelineVars(t: GateTimeline): Record<string, string> {
  return {
    "--gd-swing": `${t.swingMs}ms`,
    "--gd-tag": `${t.taglineDelayMs}ms`,
    "--gd-dove": `${t.doveDelayMs}ms`,
    "--gd-fade-delay": `${t.fadeDelayMs}ms`,
    "--gd-fade": `${t.fadeMs}ms`,
  };
}

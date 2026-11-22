/** Pure logic for the envelope opening: timing, phases, what the envelope is addressed to. No JSX. */

/** Milliseconds from the tap. The CSS in cream-styles.ts uses the same numbers; the test pins them. */
export const OPEN_TIMELINE = {
  /** Greeting and button fade away. */
  fadeOut: { at: 0, ms: 420 },
  /** The seal lifts off. */
  seal: { at: 80, ms: 460 },
  /** The flap turns over. */
  flap: { at: 380, ms: 900 },
  /** The card slides up out of the envelope. */
  rise: { at: 1180, ms: 900 },
  /** The card comes forward and the scene fades to paper. */
  zoom: { at: 2160, ms: 760 },
} as const;

export type OpenPhase = "closed" | "unsealing" | "flap" | "rising" | "zooming" | "done";

export function openingTotalMs(): number {
  return OPEN_TIMELINE.zoom.at + OPEN_TIMELINE.zoom.ms;
}

/** Which step of the unfolding is playing at `ms` after the tap (negative = not tapped yet). */
export function phaseAt(ms: number): OpenPhase {
  if (ms < 0) return "closed";
  if (ms >= openingTotalMs()) return "done";
  if (ms >= OPEN_TIMELINE.zoom.at) return "zooming";
  if (ms >= OPEN_TIMELINE.rise.at) return "rising";
  if (ms >= OPEN_TIMELINE.flap.at) return "flap";
  return "unsealing";
}

/** The guest name from the link (`?to=`), trimmed and capped so a long value cannot break the envelope. */
export function guestName(raw: string | undefined | null, max = 40): string | null {
  const v = raw?.replace(/\s+/g, " ").trim();
  if (!v) return null;
  const chars = Array.from(v);
  return chars.length > max ? `${chars.slice(0, max - 1).join("")}…` : v;
}

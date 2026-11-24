/** Pure timing, text and particle maths for the Covenant opening. No JSX, no timers. */

export interface IntroTimeline {
  /** Gold frame draws itself. */
  frameMs: number;
  /** When the blessing starts / how long it takes to write. */
  blessingAt: number;
  blessingMs: number;
  namesAt: number;
  namesMs: number;
  guestAt: number;
  guestMs: number;
  /** The open button appears and the intro waits for a tap. */
  readyAt: number;
  /** After the tap: the cross shows, then `onOpen` fires. */
  crossMs: number;
}

export const INTRO: IntroTimeline = {
  frameMs: 1400,
  blessingAt: 900,
  blessingMs: 2200,
  namesAt: 3200,
  namesMs: 1600,
  guestAt: 4900,
  guestMs: 1200,
  readyAt: 6300,
  crossMs: 1500,
};

/** Reduced motion: everything is there at once, the cross beat is short. */
export const INTRO_REDUCED: IntroTimeline = {
  frameMs: 0,
  blessingAt: 0,
  blessingMs: 0,
  namesAt: 0,
  namesMs: 0,
  guestAt: 0,
  guestMs: 0,
  readyAt: 0,
  crossMs: 200,
};

export function introFor(reducedMotion: boolean): IntroTimeline {
  return reducedMotion ? INTRO_REDUCED : INTRO;
}

/** True when the text contains Khmer script (U+1780-17FF, U+19E0-19FF). Latin text reads better in the script face. */
export function hasKhmer(text: string): boolean {
  return /[ក-៿᧠-᧿]/.test(text);
}

/**
 * The guest as set in the invitation link, exactly as given (whitespace tidied). Nothing is added to it.
 * Returns "" when no name was supplied; the opening then shows the default address from the strings.
 */
export function guestLine(name: string | undefined): string {
  return (name ?? "").replace(/\s+/g, " ").trim();
}

/** Deterministic pseudo-random in [0,1) from an integer; no Math.random, so server and client markup agree. */
export function unit(i: number, salt = 0): number {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export interface Petal {
  /** Horizontal start, percent of the stage. */
  x: number;
  /** Width in px. */
  size: number;
  /** Seconds. */
  delay: number;
  duration: number;
  /** Sideways sway in px. */
  drift: number;
  /** Start rotation, deg. */
  spin: number;
}

export function petals(count: number): Petal[] {
  return Array.from({ length: Math.max(0, Math.floor(count)) }, (_, i) => ({
    x: Math.round(unit(i, 1) * 100),
    size: 10 + Math.round(unit(i, 2) * 10),
    delay: Math.round(unit(i, 3) * 100) / 10,
    duration: 9 + Math.round(unit(i, 4) * 70) / 10,
    drift: Math.round((unit(i, 5) - 0.5) * 90),
    spin: Math.round(unit(i, 6) * 360),
  }));
}

/** Scale (0..1) that makes content of `natural` px fit in `available` px; never enlarges, never zero. */
export function fitScale(available: number, natural: number): number {
  if (!(available > 0) || !(natural > 0)) return 1;
  return Math.max(0.3, Math.min(1, available / natural));
}

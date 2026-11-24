import type { PreviewMode } from "./messages";

export type Device = "desktop" | "mobile";

/** Real viewport the site is laid out in, so vh/svh and breakpoints behave like on a real device. */
export const DEVICE_SIZE: Record<Device, { width: number; height: number }> = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 },
};

/** A tall section is shown at most this many screens tall (any more and the text is too small to read); past it the frame scrolls. */
const MAX_SCREENS = 1.5;

/**
 * Content only counts as taller than the screen past this much. Sections sized
 * with 100svh read a few pixels over (borders, rounding); growing the frame for
 * that would make them taller again, over and over.
 */
const OVERFLOW_TOLERANCE = 48;

export interface Fit {
  /** Laid-out size of the frame (before scaling). */
  width: number;
  height: number;
  /** Scale that fits the whole frame inside the stage. */
  scale: number;
}

/**
 * Picks the frame size and the scale to fit it in the stage. In section mode the
 * frame grows to the section's content height (up to MAX_SCREENS screens) so the
 * whole section is visible with no scrolling; in page mode it is one screen and scrolls.
 */
export function computeFit(
  device: Device,
  mode: PreviewMode,
  contentHeight: number,
  stage: { width: number; height: number },
): Fit {
  const base = DEVICE_SIZE[device];
  const overflows = mode === "section" && contentHeight > base.height + OVERFLOW_TOLERANCE;
  const height = overflows ? Math.min(contentHeight, base.height * MAX_SCREENS) : base.height;
  const scale = Math.min(1, stage.width / base.width, stage.height / height);
  return { width: base.width, height, scale: Math.max(scale, 0.05) };
}

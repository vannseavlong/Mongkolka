export type Device = "desktop" | "mobile";

/** Real viewport the site is laid out in, so vh/svh and breakpoints behave like on a real device. */
export const DEVICE_SIZE: Record<Device, { width: number; height: number }> = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 },
};

export interface Fit {
  /** Laid-out size of the frame (before scaling). */
  width: number;
  height: number;
  /** Scale that fits the whole frame inside the stage. */
  scale: number;
}

/**
 * The frame is always one real screen of the chosen device and is scaled to fit the stage, in Section and Full page
 * mode alike, so switching between them never changes its size. A section taller than the screen scrolls inside it.
 */
export function computeFit(device: Device, stage: { width: number; height: number }): Fit {
  const { width, height } = DEVICE_SIZE[device];
  const scale = Math.min(1, stage.width / width, stage.height / height);
  return { width, height, scale: Math.max(scale, 0.05) };
}

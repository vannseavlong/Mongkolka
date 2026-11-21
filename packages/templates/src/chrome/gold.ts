/**
 * Gold-foil colour math in plain JS (no CSS color-mix), so the foil renders on every browser and
 * is unit-testable. The reference studio's look is a 3-stop gradient with a soft bevel, never one
 * flat gold: highlight -> body -> shade. Everything derives from the theme's single accent color.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Parses #rgb / #rrggbb. Anything else (named colors, rgb(), 8-digit) returns null. */
export function parseHex(value: string): Rgb | null {
  const v = value.trim().toLowerCase();
  const long = /^#([0-9a-f]{6})$/.exec(v);
  const short = /^#([0-9a-f]{3})$/.exec(v);
  const hex = long ? long[1]! : short ? short[1]!.split("").map((c) => c + c).join("") : null;
  if (!hex) return null;
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

const toHex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");

/** `weightA` percent of `a` mixed with the rest of `b`. Non-hex input returns `a` unchanged. */
export function mixHex(a: string, b: string, weightA: number): string {
  const ca = parseHex(a);
  const cb = parseHex(b);
  if (!ca || !cb) return a;
  const w = Math.min(100, Math.max(0, weightA)) / 100;
  return `#${toHex(ca.r * w + cb.r * (1 - w))}${toHex(ca.g * w + cb.g * (1 - w))}${toHex(ca.b * w + cb.b * (1 - w))}`;
}

/** `rgba()` string from a hex color and alpha 0..1; non-hex input is returned as is. */
export function withAlpha(color: string, alpha: number): string {
  const c = parseHex(color);
  if (!c) return color;
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${Math.min(1, Math.max(0, alpha))})`;
}

export interface GoldStops {
  /** Bright catch-light. */
  hi: string;
  /** The accent itself. */
  mid: string;
  /** Deep shade for the bevel. */
  lo: string;
}

export function goldStops(accent: string): GoldStops {
  return { hi: mixHex(accent, "#ffffff", 52), mid: accent, lo: mixHex(accent, "#3a2400", 70) };
}

export function goldGradient(accent: string, angle = 135): string {
  const { hi, mid, lo } = goldStops(accent);
  return `linear-gradient(${angle}deg, ${hi} 0%, ${mid} 48%, ${lo} 100%)`;
}

import { goldStops, mixHex, parseHex } from "../../chrome/gold";

/** Pure colour decisions for gold foil text and card surfaces. No JSX. */

/** Relative luminance 0..1 of a plain hex colour; 0 for anything else. */
export function luminanceOf(hex: string): number {
  const c = parseHex(hex);
  if (!c) return 0;
  const ch = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
}

export function isDarkColor(hex: string): boolean {
  return luminanceOf(hex) < 0.35;
}

/**
 * Gradient for foil TEXT. On a dark ground the full catch-light is fine; on a light ground the
 * lightest stop is pulled toward the accent so large headings keep their contrast.
 */
export function foilTextGradient(accent: string, ground: string, angle = 135): string {
  const { hi, mid, lo } = goldStops(accent);
  const top = isDarkColor(ground) ? hi : mixHex(accent, "#ffffff", 84);
  return `linear-gradient(${angle}deg, ${top} 0%, ${mid} 46%, ${lo} 100%)`;
}

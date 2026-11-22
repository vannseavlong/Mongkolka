import { goldStops, mixHex, type GoldStops } from "../../chrome/gold";
import type { Theme } from "../../types";

/** Pure colour decisions for the emerald skin. Everything derives from the 4 theme keys (bg = emerald, accent = gold). */

export interface EmeraldPalette {
  gold: GoldStops;
  /** The theme ground (deep emerald). */
  ground: string;
  /** Darker than the ground: door panels, spandrels, vignette. */
  deep: string;
  /** Slightly lifted ground: door faces, card tops. */
  lift: string;
  ink: string;
}

export function emeraldPalette(theme: Theme): EmeraldPalette {
  return {
    gold: goldStops(theme.accent_color),
    ground: theme.bg_color,
    deep: mixHex(theme.bg_color, "#000000", 45),
    lift: mixHex(theme.bg_color, theme.accent_color, 90),
    ink: theme.text_color,
  };
}

/** Points of an n-pointed star as an SVG `points` string. Pure, so it can be tested. */
export function starPoints(cx: number, cy: number, outer: number, inner: number, n: number): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

/**
 * A tiling kbach lattice (diamond in diamond, corner ticks, centre dot) as a CSS `url(data:...)`.
 * Static, one request-free tile, so it costs nothing at runtime.
 */
export function latticeDataUri(accent: string, alpha = 0.1): string {
  const a = Math.min(1, Math.max(0, alpha));
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56' fill='none' stroke='${accent}' stroke-opacity='${a}' stroke-width='1'>` +
    `<path d='M28 2 54 28 28 54 2 28Z'/><path d='M28 14 42 28 28 42 14 28Z'/>` +
    `<path d='M0 8V0H8M48 0H56V8M56 48V56H48M8 56H0V48'/>` +
    `<circle cx='28' cy='28' r='2.2' fill='${accent}' fill-opacity='${a}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

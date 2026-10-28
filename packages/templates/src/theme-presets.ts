import type { Theme } from "./types";

/** font_style values the section components understand (anything else renders sans-serif). */
export const FONT_STYLES = [
  { value: "serif", label: "Serif" },
  { value: "sans", label: "Sans" },
] as const;

export interface ThemePreset {
  id: string;
  name: string;
  theme: Theme;
}

/** Named whole-site palettes. Every text/bg pair is >= 4.5:1 (WCAG AA); see contrastRatio(). */
export const THEME_PRESETS: ThemePreset[] = [
  { id: "ivory-gold", name: "Ivory & Gold", theme: { bg_color: "#fbf7ef", text_color: "#3a2f1f", accent_color: "#a8812c", font_style: "serif" } },
  { id: "blush-rose", name: "Blush Rose", theme: { bg_color: "#fdf1f2", text_color: "#4a2530", accent_color: "#b8456a", font_style: "serif" } },
  { id: "sage-garden", name: "Sage Garden", theme: { bg_color: "#f3f6f0", text_color: "#26352b", accent_color: "#4f7a5a", font_style: "serif" } },
  { id: "sky-linen", name: "Sky Linen", theme: { bg_color: "#f2f7fb", text_color: "#1f3347", accent_color: "#3a78a8", font_style: "sans" } },
  { id: "royal-navy", name: "Royal Navy", theme: { bg_color: "#14233a", text_color: "#f3ead6", accent_color: "#d4af37", font_style: "serif" } },
  { id: "midnight-plum", name: "Midnight Plum", theme: { bg_color: "#2a1630", text_color: "#f6e9f3", accent_color: "#e0a0c8", font_style: "serif" } },
  { id: "terracotta", name: "Terracotta", theme: { bg_color: "#fbf1e8", text_color: "#4a2c1f", accent_color: "#b5532f", font_style: "sans" } },
  { id: "lotus-pink", name: "Lotus Pink", theme: { bg_color: "#fff5f8", text_color: "#40202f", accent_color: "#c2457e", font_style: "sans" } },
  { id: "forest-night", name: "Forest Night", theme: { bg_color: "#10241c", text_color: "#e8f1e6", accent_color: "#8fcf9d", font_style: "sans" } },
  { id: "classic-mono", name: "Classic Mono", theme: { bg_color: "#ffffff", text_color: "#1c1c1c", accent_color: "#555555", font_style: "serif" } },
];

export function getThemePreset(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.id === id);
}

function channel(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance of #rgb / #rrggbb; null when unparseable. */
function luminance(hex: string): number | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  const n = parseInt(h, 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

/** WCAG contrast ratio (1 to 21) between two hex colors; 1 if either is invalid. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return 1;
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export const MIN_TEXT_CONTRAST = 4.5;

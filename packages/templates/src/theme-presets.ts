import type { DecorKey } from "./site-decor";
import type { Theme } from "./types";

export type ThemePresetKey = "bg_color" | "text_color" | "accent_color" | DecorKey;

export interface ThemePreset {
  id: string;
  name: string;
  theme: Pick<Theme, ThemePresetKey>;
}

/** Named looks: colors and background, never fonts (see FONT_PRESETS). Classic Mono keeps the template's own background. Text/bg and accent/bg are both >= 4.5:1 (WCAG AA); see contrastRatio(). */
export const THEME_PRESETS = [
  { id: "ivory-gold", name: "Ivory & Gold", theme: { bg_color: "#fbf7ef", text_color: "#3a2f1f", accent_color: "#8f6a1c", pattern: "diamond", corners: "on" } },
  { id: "blush-rose", name: "Blush Rose", theme: { bg_color: "#fdf1f2", text_color: "#4a2530", accent_color: "#b8456a", pattern: "blossom", corners: "off" } },
  { id: "sage-garden", name: "Sage Garden", theme: { bg_color: "#f3f6f0", text_color: "#26352b", accent_color: "#43694c", pattern: "blossom", corners: "off" } },
  { id: "sky-linen", name: "Sky Linen", theme: { bg_color: "#f2f7fb", text_color: "#1f3347", accent_color: "#2f6a96", pattern: "lotus", corners: "off" } },
  { id: "royal-navy", name: "Royal Navy", theme: { bg_color: "#14233a", text_color: "#f3ead6", accent_color: "#d4af37", pattern: "diamond", corners: "on" } },
  { id: "midnight-plum", name: "Midnight Plum", theme: { bg_color: "#2a1630", text_color: "#f6e9f3", accent_color: "#e0a0c8", pattern: "lotus", corners: "on" } },
  { id: "terracotta", name: "Terracotta", theme: { bg_color: "#fbf1e8", text_color: "#4a2c1f", accent_color: "#a84a28", pattern: "lotus", corners: "off" } },
  { id: "lotus-pink", name: "Lotus Pink", theme: { bg_color: "#fff5f8", text_color: "#40202f", accent_color: "#b03a70", pattern: "diamond", corners: "on" } },
  { id: "forest-night", name: "Forest Night", theme: { bg_color: "#10241c", text_color: "#e8f1e6", accent_color: "#8fcf9d", pattern: "diamond", corners: "off" } },
  { id: "classic-mono", name: "Classic Mono", theme: { bg_color: "#ffffff", text_color: "#1c1c1c", accent_color: "#555555" } },
] as const satisfies readonly ThemePreset[];

function channel(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Lowercase, trimmed, 3-digit hex expanded to 6 digits. Other strings come back lowercased/trimmed. */
export function normalizeColor(value: string): string {
  const v = value.trim().toLowerCase();
  return /^#[0-9a-f]{3}$/.test(v) ? `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}` : v;
}

export function sameColor(a: string, b: string): boolean {
  return normalizeColor(a) === normalizeColor(b);
}

/** Relative luminance of #rgb / #rrggbb; null for anything else (named, 8-digit, invalid). */
function luminance(hex: string): number | null {
  const h = normalizeColor(hex);
  if (!/^#[0-9a-f]{6}$/.test(h)) return null;
  const n = parseInt(h.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

/** WCAG contrast ratio (1 to 21) between two colors; null if either is not a plain hex color. */
export function contrastRatio(a: string, b: string): number | null {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export const MIN_TEXT_CONTRAST = 4.5;
export const MIN_ACCENT_CONTRAST = 4.5;

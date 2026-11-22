import type { Theme } from "../../types";
import { mixHex } from "../../chrome/gold";

/**
 * Colour decisions for the Sakura Romance skin. Pure (no JSX). Blossom pinks derive from the theme
 * accent (so a couple who recolours the accent recolours the blossoms); lavender, sage and the gold
 * foil are fixed skin identity colours from the studied palette (blush, lavender, magenta, deep purple,
 * cream, gold foil).
 */
export interface SakuraPalette {
  accent: string;
  /** Blossom petal tones, lightest to deepest. */
  petalPale: string;
  petalLight: string;
  petalMid: string;
  petalDeep: string;
  lavender: string;
  lavenderDeep: string;
  purple: string;
  cream: string;
  leaf: string;
  leafDeep: string;
  bark: string;
  barkLight: string;
  /** Foil used on artwork and linework (bright, decorative). */
  foilHi: string;
  foilMid: string;
  foilLo: string;
  /** Foil used on TEXT: darker stops so large headings keep >= 3:1 on the card. */
  textHi: string;
  textMid: string;
  textLo: string;
  /** Stationery card colours. */
  card: string;
  cardEdge: string;
}

export const SAKURA_GOLD = { hi: "#f3e5ab", mid: "#d4af37", lo: "#a67c2e" } as const;

export function sakuraPalette(theme: Pick<Theme, "accent_color" | "bg_color">): SakuraPalette {
  const accent = theme.accent_color;
  return {
    accent,
    petalPale: mixHex(accent, "#ffffff", 8),
    petalLight: mixHex(accent, "#ffffff", 20),
    petalMid: mixHex(accent, "#ffffff", 52),
    petalDeep: mixHex(accent, "#ffffff", 82),
    lavender: "#c8b6e2",
    lavenderDeep: "#9b7fc9",
    purple: "#6a3d9a",
    cream: "#fff8f0",
    leaf: "#b3c7a8",
    leafDeep: "#84a07c",
    bark: "#6a3a4c",
    barkLight: "#a06b80",
    foilHi: SAKURA_GOLD.hi,
    foilMid: SAKURA_GOLD.mid,
    foilLo: SAKURA_GOLD.lo,
    textHi: "#a47417",
    textMid: "#8d6312",
    textLo: "#64430a",
    card: mixHex("#fffafc", theme.bg_color, 72),
    cardEdge: mixHex("#ffffff", theme.bg_color, 40),
  };
}

/** Stable, CSS-identifier-safe key for an accent colour (used in custom property names). */
export function paletteKey(accent: string): string {
  return accent.trim().toLowerCase().replace(/[^0-9a-z]/g, "") || "x";
}

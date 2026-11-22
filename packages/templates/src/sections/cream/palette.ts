import type { Theme } from "../../types";
import { goldStops, mixHex } from "../../chrome/gold";

/**
 * Colour decisions for the Royal Cream skin. Everything derives from the four theme colours plus a few
 * fixed watercolour pigments (blush, rose, sage), so a couple who recolours the site still gets a
 * coherent skin. Pure: no JSX, unit-tested.
 */
export interface CreamPalette {
  ground: string;
  /** Lighter paper for cards and the envelope. */
  paper: string;
  /** Slightly deeper paper for the envelope inside and shadows. */
  paperDeep: string;
  champagne: string;
  blush: string;
  blushDeep: string;
  rose: string;
  sage: string;
  sageDeep: string;
  ink: string;
  gold: string;
  goldHi: string;
  goldLo: string;
}

export const PIGMENT = {
  champagne: "#e8d3a2",
  blush: "#f2c4c4",
  blushDeep: "#e39aa6",
  rose: "#c9707f",
  sage: "#9db393",
  sageDeep: "#6a8466",
} as const;

export function creamPalette(theme: Theme): CreamPalette {
  const { hi, mid, lo } = goldStops(theme.accent_color);
  return {
    ground: theme.bg_color,
    paper: mixHex(theme.bg_color, "#ffffff", 52),
    paperDeep: mixHex(theme.bg_color, PIGMENT.champagne, 62),
    champagne: mixHex(PIGMENT.champagne, theme.bg_color, 70),
    blush: PIGMENT.blush,
    blushDeep: PIGMENT.blushDeep,
    rose: PIGMENT.rose,
    sage: PIGMENT.sage,
    sageDeep: PIGMENT.sageDeep,
    ink: theme.text_color,
    gold: mid,
    goldHi: hi,
    goldLo: lo,
  };
}

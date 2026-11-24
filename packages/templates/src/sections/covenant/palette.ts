import { goldStops, mixHex, type GoldStops } from "../../chrome/gold";
import type { Theme } from "../../types";

/** Fixed soft pinks. The theme only has 4 keys, so pink is the ground tint plus these pigments. */
export const PINK = {
  blush: "#fbe3ea",
  petal: "#f4bccb",
  rose: "#d9869f",
  deepRose: "#b85c7a",
} as const;

/** Fixed soft greens for foliage (the theme has no green). */
export const GREEN = {
  leaf: "#a9bd98",
  deep: "#6f8a62",
} as const;

export interface CovenantPalette {
  gold: GoldStops;
  /** Page ground (white-pink). */
  ground: string;
  /** Slightly deeper pink wash for panels and the intro. */
  wash: string;
  /** White card paper. */
  paper: string;
  ink: string;
}

export function covenantPalette(theme: Theme): CovenantPalette {
  return {
    gold: goldStops(theme.accent_color),
    ground: theme.bg_color,
    wash: mixHex(theme.bg_color, PINK.petal, 70),
    paper: mixHex(theme.bg_color, "#ffffff", 35),
    ink: theme.text_color,
  };
}

import type { Theme } from "../../types";
import { goldStops, mixHex } from "../../chrome/gold";
import { isDarkColor } from "../khmer/foil";

/**
 * Colours of the Royal Garden skin as pure data. Gold, ground and text come from the couple's
 * 4-key theme (so a recolour still works); the garden colours (rose, sage, stone) are decorative
 * artwork only and never carry text.
 */
export interface GardenPalette {
  ground: string;
  text: string;
  accent: string;
  gold: { hi: string; mid: string; lo: string };
  dark: boolean;
  white: string;
  rose: string;
  roseDeep: string;
  roseLight: string;
  sage: string;
  sageDeep: string;
  stone: string;
  stoneLight: string;
  sky: string;
}

export type ColorToken = Exclude<keyof GardenPalette, "gold" | "dark">;

export function gardenPalette(theme: Theme): GardenPalette {
  const dark = isDarkColor(theme.bg_color);
  return {
    ground: theme.bg_color,
    text: theme.text_color,
    accent: theme.accent_color,
    gold: goldStops(theme.accent_color),
    dark,
    white: dark ? "#f4efe6" : "#ffffff",
    rose: "#d8a7a7",
    roseDeep: "#b97a82",
    roseLight: "#efd0cf",
    sage: "#9caf88",
    sageDeep: "#6e8a62",
    stone: "#b8a99a",
    stoneLight: mixHex("#d9cdbf", theme.bg_color, 70),
    sky: dark ? mixHex(theme.bg_color, "#ffffff", 88) : "#f6ebe4",
  };
}

/** Resolves an artwork colour token (or a literal colour) to a hex string. */
export function tone(p: GardenPalette, token: ColorToken | string): string {
  return token in p && typeof (p as unknown as Record<string, unknown>)[token] === "string"
    ? ((p as unknown as Record<string, string>)[token] as string)
    : token;
}

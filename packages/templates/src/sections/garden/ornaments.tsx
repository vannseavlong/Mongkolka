import type { CSSProperties } from "react";
import type { Theme } from "../../types";
import { CINZEL_FONT, MOUL_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import { foilTextGradient, isDarkColor } from "../khmer/foil";
import type { SkinOrnaments } from "../khmer/skin-ornament-types";
import { gardenPalette } from "./palette";
import { GardenCorner } from "./ornaments/GardenCorner";
import { GardenCrest } from "./ornaments/GardenCrest";
import { GardenDivider } from "./ornaments/GardenDivider";
import { GARDEN_ICONS } from "./ornaments/garden-icons";
import { gardenSectionBackground } from "./ornaments/section-backdrop";

/** Ivory parchment with a double gold line that follows the card's rounded shape and a blush bloom at the foot. */
function surface(theme: Theme): CSSProperties {
  const p = gardenPalette(theme);
  const accent = theme.accent_color;
  if (p.dark) {
    return {
      background: `linear-gradient(180deg, ${withAlpha(accent, 0.1)}, ${withAlpha(p.rose, 0.07)})`,
      border: `1px solid ${withAlpha(accent, 0.6)}`,
      boxShadow: `0 0 0 5px ${theme.bg_color}, 0 0 0 6px ${withAlpha(accent, 0.55)}, 0 28px 50px -24px rgba(0,0,0,0.7)`,
    };
  }
  return {
    background: `radial-gradient(120% 55% at 50% 100%, ${withAlpha(p.rose, 0.2)}, transparent 70%), linear-gradient(180deg, ${mixHex(theme.bg_color, "#ffffff", 40)}, ${mixHex(theme.bg_color, p.roseLight, 88)})`,
    border: `1.5px solid ${withAlpha(accent, 0.7)}`,
    boxShadow: `0 0 0 5px ${theme.bg_color}, 0 0 0 6.5px ${withAlpha(accent, 0.5)}, 0 26px 44px -26px rgba(110,70,60,0.4)`,
  };
}

function heading(theme: Theme, language: "en" | "kh"): CSSProperties {
  const dark = isDarkColor(theme.bg_color);
  return {
    fontFamily: language === "kh" ? MOUL_FONT : CINZEL_FONT,
    fontWeight: language === "kh" ? 400 : 600,
    letterSpacing: language === "kh" ? "normal" : "0.16em",
    textTransform: language === "kh" ? "none" : "uppercase",
    lineHeight: language === "kh" ? 1.9 : 1.4,
    color: theme.accent_color,
    backgroundImage: foilTextGradient(theme.accent_color, theme.bg_color),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: dark ? "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" : "drop-shadow(0 1px 0 rgba(255,255,255,0.7)) drop-shadow(0 1.5px 1.5px rgba(110,80,20,0.25))",
  };
}

/** The Royal Garden ornament set: rose-spray corners, a floral divider, a laurel crest, garden line icons. */
export const GARDEN_ORNAMENTS: SkinOrnaments = {
  id: "garden",
  Corner: GardenCorner,
  Divider: GardenDivider,
  Crest: GardenCrest,
  icons: GARDEN_ICONS,
  corners: true,
  inset: 9,
  radius: 28,
  surface,
  heading,
  iconStroke: 1.5,
  motion: "float",
  sectionBackground: gardenSectionBackground,
};

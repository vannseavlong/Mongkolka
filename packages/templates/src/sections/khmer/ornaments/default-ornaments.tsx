import type { CSSProperties } from "react";
import type { Theme } from "../../../types";
import { CINZEL_FONT, MOUL_FONT } from "../../../chrome/fonts";
import { mixHex, withAlpha } from "../../../chrome/gold";
import { foilTextGradient, isDarkColor } from "../foil";
import type { SkinOrnaments } from "../skin-ornament-types";
import { KbachCorner } from "./Corner";
import { LotusDivider } from "./Divider";
import { KbachCrest } from "./Crest";
import { DEFAULT_ICONS } from "./icons";

/** Card surface: glass on a dark theme, parchment on a light one; always a gold hairline. */
function surface(theme: Theme): CSSProperties {
  const dark = isDarkColor(theme.bg_color);
  if (dark) {
    return {
      background: `linear-gradient(180deg, ${withAlpha(theme.accent_color, 0.1)}, ${withAlpha(theme.accent_color, 0.03)})`,
      border: `1px solid ${withAlpha(theme.accent_color, 0.55)}`,
      boxShadow: `0 24px 60px -24px rgba(0,0,0,0.7), inset 0 0 0 1px ${withAlpha(theme.accent_color, 0.12)}`,
      WebkitBackdropFilter: "blur(6px)",
      backdropFilter: "blur(6px)",
    };
  }
  return {
    background: `linear-gradient(180deg, ${mixHex(theme.bg_color, "#ffffff", 55)}, ${mixHex(theme.bg_color, theme.accent_color, 92)})`,
    border: `1px solid ${withAlpha(theme.accent_color, 0.55)}`,
    boxShadow: `0 22px 44px -26px rgba(90,60,10,0.45), inset 0 1px 0 rgba(255,255,255,0.7)`,
  };
}

function heading(theme: Theme, language: "en" | "kh"): CSSProperties {
  const dark = isDarkColor(theme.bg_color);
  return {
    fontFamily: language === "kh" ? MOUL_FONT : CINZEL_FONT,
    fontWeight: language === "kh" ? 400 : 600,
    letterSpacing: language === "kh" ? "normal" : "0.12em",
    textTransform: language === "kh" ? "none" : "uppercase",
    lineHeight: language === "kh" ? 1.9 : 1.4,
    color: theme.accent_color,
    backgroundImage: foilTextGradient(theme.accent_color, theme.bg_color),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: dark
      ? "drop-shadow(0 2px 6px rgba(0,0,0,0.5))"
      : "drop-shadow(0 1px 0 rgba(255,255,255,0.55)) drop-shadow(0 2px 2px rgba(80,50,0,0.28))",
  };
}

/** The shared gold kbach set; every skin points here until its own task registers a replacement. */
export const DEFAULT_ORNAMENTS: SkinOrnaments = {
  id: "default",
  Corner: KbachCorner,
  Divider: LotusDivider,
  Crest: KbachCrest,
  icons: DEFAULT_ICONS,
  corners: true,
  inset: 7,
  radius: 22,
  surface,
  heading,
  iconStroke: 1.6,
  motion: "shimmer",
};

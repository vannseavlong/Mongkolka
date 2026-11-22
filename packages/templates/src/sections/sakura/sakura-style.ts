import type { CSSProperties } from "react";
import type { Theme } from "../../types";
import { CINZEL_FONT, MOUL_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import { paletteKey, sakuraPalette, type SakuraPalette } from "./palette";

/** Pure style decisions for the Sakura skin (no JSX). */

export const SCRIPT_FONT = 'var(--font-script), "Great Vibes", "Pinyon Script", cursive';

export const branchesVar = (accent: string): string => `--sk-br-${paletteKey(accent)}`;
export const bedVar = (accent: string): string => `--sk-bd-${paletteKey(accent)}`;

const KHMER = /[ក-៿]/;
/** Names typed in Khmer need the Khmer display face; Latin names use the script face. */
export const hasKhmer = (text: string): boolean => KHMER.test(text);

/** 3-stop gold foil for TEXT (dark enough for large type on the pale card), at any angle. */
export function foilText(p: SakuraPalette, angle = 160): CSSProperties {
  return {
    backgroundImage: `linear-gradient(${angle}deg, ${p.textHi} 0%, ${p.textMid} 48%, ${p.textLo} 100%)`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: p.textMid,
    // emboss: a white lip on top, a soft shadow underneath
    filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.9)) drop-shadow(0 2px 1.5px rgba(100,60,10,0.32))",
  };
}

/** Section heading: Moul foil for Khmer, tracked Cinzel foil for English. */
export function sakuraHeading(theme: Theme, language: "en" | "kh"): CSSProperties {
  const p = sakuraPalette(theme);
  return {
    ...foilText(p),
    fontFamily: language === "kh" ? MOUL_FONT : CINZEL_FONT,
    fontWeight: language === "kh" ? 400 : 700,
    letterSpacing: language === "kh" ? "normal" : "0.14em",
    textTransform: language === "kh" ? "none" : "uppercase",
    lineHeight: language === "kh" ? 1.9 : 1.4,
  };
}

/**
 * The stationery card: warm white to blush, a gold hairline, a rosy lift shadow, and the hanging
 * blossom branches on top and the flower bed along the bottom as two background layers. The art
 * lives in custom properties defined once per page by <SakuraArtStyle/>; `var(..., none)` keeps the
 * card readable if the style tag is not on the page.
 */
export function sakuraSurface(theme: Theme): CSSProperties {
  const p = sakuraPalette(theme);
  return {
    backgroundColor: p.card,
    backgroundImage: [
      `var(${branchesVar(p.accent)}, none)`,
      `var(${bedVar(p.accent)}, none)`,
      `radial-gradient(120% 70% at 50% 0%, ${withAlpha("#ffffff", 0.85)}, transparent 70%)`,
      `linear-gradient(180deg, ${p.card} 0%, ${mixHex(p.card, p.petalPale, 78)} 100%)`,
    ].join(", "),
    backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
    backgroundPosition: "top center, bottom center, top center, center",
    backgroundSize: "100% auto, 100% auto, auto, auto",
    border: `1px solid ${withAlpha(p.foilMid, 0.7)}`,
    boxShadow: `0 28px 50px -30px ${withAlpha(p.accent, 0.5)}, 0 0 0 5px ${withAlpha("#ffffff", 0.55)}, 0 0 0 6px ${withAlpha(p.foilMid, 0.4)}, inset 0 1px 0 rgba(255,255,255,0.9)`,
  };
}

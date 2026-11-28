import { type CSSProperties } from "react";
import type { Theme } from "../../types";
import { MOUL_FONT } from "../../chrome/fonts";
import { goldStops, mixHex, withAlpha } from "../../chrome/gold";
import { DEFAULT_ICONS } from "../khmer/ornaments/icons";
import { foilTextGradient, isDarkColor } from "../khmer/foil";
import type { MediaFrameProps, SkinMedia, SkinOrnaments } from "../khmer/skin-ornament-types";
import { PhotoBox } from "../skinned/gallery-media";
import { buttonStyle, fieldStyle, mediaTones, noteStyle } from "../skinned/gallery-tones";
import { Blossom } from "./cross";
import { CovenantCorner, CrossDivider, KbachCrest } from "./lai-ornaments";
import { covenantPalette, PINK } from "./palette";

const SCRIPT = 'var(--font-script), "Great Vibes", cursive';

/** White paper with a faint blush wash and a gold hairline; glass if a couple recolours it dark. */
function surface(theme: Theme): CSSProperties {
  const gold = withAlpha(theme.accent_color, 0.5);
  if (isDarkColor(theme.bg_color)) {
    return {
      background: `linear-gradient(180deg, ${withAlpha(theme.accent_color, 0.1)}, ${withAlpha(theme.accent_color, 0.03)})`,
      border: `1px solid ${gold}`,
      boxShadow: "0 24px 60px -24px rgba(0,0,0,0.7)",
    };
  }
  const p = covenantPalette(theme);
  return {
    background: `radial-gradient(120% 70% at 100% 0%, ${withAlpha(PINK.petal, 0.3)}, transparent 58%), linear-gradient(180deg, ${p.paper}, ${mixHex(theme.bg_color, "#ffffff", 70)})`,
    border: `1px solid ${gold}`,
    boxShadow: `0 26px 50px -30px ${withAlpha(PINK.deepRose, 0.55)}, inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 4px ${withAlpha("#ffffff", 0.6)}`,
  };
}

/** Latin headings in the calligraphic script, Khmer headings in Moul; both in gold foil. */
function heading(theme: Theme, language: "en" | "kh"): CSSProperties {
  const khmer = language === "kh";
  return {
    fontFamily: khmer ? MOUL_FONT : SCRIPT,
    fontWeight: 400,
    fontSize: khmer ? undefined : "2.2rem",
    letterSpacing: "normal",
    textTransform: "none",
    lineHeight: khmer ? 1.9 : 1.2,
    color: theme.accent_color,
    backgroundImage: foilTextGradient(theme.accent_color, theme.bg_color),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.7)) drop-shadow(0 2px 2px rgba(120,80,30,0.2))",
  };
}

/** An arch-topped gold frame with a pink mat; the blossom spray sits on the top corners of the arch. */
function CovenantFrame({ theme, index, aspect, variant, children }: MediaFrameProps) {
  const g = goldStops(theme.accent_color);
  const big = variant !== "wall";
  return (
    <span className="relative block w-full" style={{ filter: `drop-shadow(0 14px 14px ${withAlpha(PINK.deepRose, 0.22)})` }}>
      <span className="block p-[2.5px]" style={{ borderRadius: "999px 999px 16px 16px / 56% 56% 16px 16px", backgroundImage: `linear-gradient(135deg, ${g.hi}, ${g.mid} 50%, ${g.lo})` }}>
        <span className="block" style={{ padding: big ? 8 : 5, borderRadius: "999px 999px 14px 14px / 56% 56% 14px 14px", background: `linear-gradient(180deg, ${PINK.blush}, #ffffff)`, boxShadow: `inset 0 0 0 1px ${withAlpha(g.hi, 0.9)}` }}>
          <PhotoBox aspect={aspect ?? "aspect-[4/5]"} style={{ borderRadius: "999px 999px 10px 10px / 56% 56% 10px 10px", backgroundColor: PINK.blush }}>
            {children}
          </PhotoBox>
        </span>
      </span>
      {big && (
        <span aria-hidden className="pointer-events-none absolute" style={{ bottom: -6, [index % 2 ? "left" : "right"]: -4 }}>
          <svg width="34" height="34" viewBox="-17 -17 34 34">
            <Blossom x={0} y={0} r={13} petal={PINK.petal} centre={g.mid} />
          </svg>
        </span>
      )}
    </span>
  );
}

const COVENANT_MEDIA: SkinMedia = {
  Frame: CovenantFrame,
  aspect: "aspect-[4/5]",
  note: (theme) => {
    const base = noteStyle(theme, { radius: 22 });
    if (mediaTones(theme).dark) return base;
    return { ...base, backgroundColor: "#ffffff", backgroundImage: `radial-gradient(110% 70% at 100% 0%, ${withAlpha(PINK.petal, 0.28)}, transparent 62%)` };
  },
  field: (theme, invalid) => fieldStyle(theme, invalid, { radius: 16, background: "#ffffff" }),
  button: (theme) => buttonStyle(theme, { radius: 999 }),
};

export const COVENANT_ORNAMENTS: SkinOrnaments = {
  id: "covenant",
  Corner: CovenantCorner,
  Divider: CrossDivider,
  Crest: KbachCrest,
  icons: DEFAULT_ICONS,
  corners: true,
  inset: 6,
  radius: 28,
  surface,
  heading,
  iconStroke: 1.5,
  motion: "float",
  media: COVENANT_MEDIA,
};

import { useId, type CSSProperties } from "react";
import type { Theme } from "../../types";
import { MOUL_FONT } from "../../chrome/fonts";
import { goldStops, mixHex, withAlpha } from "../../chrome/gold";
import { foilTextGradient, isDarkColor } from "../khmer/foil";
import type { BackdropProps, CrestProps, DividerProps, OrnamentProps, SkinOrnaments } from "../khmer/skin-ornament-types";
import { SectionBackdrop } from "./art/Compositions";
import { Shield } from "./art/Shield";
import { CREAM_ICONS } from "./icons";
import { PIGMENT } from "./palette";

const svgId = (prefix: string) => `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
const SCRIPT = 'var(--font-script), "Great Vibes", cursive';

/** Top-left card corner: a rounded gold hairline with a blush rose and two leaves tucked into it. */
function CreamCorner({ color, size = 64 }: OrnamentProps) {
  const g = svgId("cc");
  const { hi, mid, lo } = goldStops(color);
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hi} />
          <stop offset="0.5" stopColor={mid} />
          <stop offset="1" stopColor={lo} />
        </linearGradient>
        <radialGradient id={`${g}r`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor={PIGMENT.blush} />
          <stop offset="1" stopColor={PIGMENT.rose} />
        </radialGradient>
      </defs>
      <g fill="none" stroke={`url(#${g})`} strokeLinecap="round">
        <path d="M3 62C3 22 22 3 62 3" strokeWidth="1.5" />
        <path d="M9 56C9 27 27 9 56 9" strokeWidth="0.7" opacity="0.7" />
        <path d="M44 6c5 1 9 4 10 9" strokeWidth="0.8" opacity="0.7" />
      </g>
      <path d="M17 24C21 18 30 18 36 22C30 28 22 29 17 24Z" fill={PIGMENT.sageDeep} opacity="0.85" />
      <path d="M24 17C30 14 38 17 40 23C33 24 26 23 24 17Z" fill={PIGMENT.sage} opacity="0.9" />
      <g transform="translate(15 15)">
        {[0, 72, 144, 216, 288].map((r) => (
          <path key={r} transform={`rotate(${r})`} d="M0 0C-7 -2 -9 -11 -2 -13C2 -14 6 -12 7 -8C9 -3 5 0 0 0Z" fill={`url(#${g}r)`} stroke={PIGMENT.rose} strokeOpacity="0.4" strokeWidth="0.5" />
        ))}
        <circle r="3" fill={`url(#${g}r)`} />
        <path d="M0 -1C3 -1 3 -4 1 -4C-2 -4 -3 -1 0 1" fill="none" stroke={PIGMENT.rose} strokeWidth="0.7" />
      </g>
      <circle cx="3" cy="3" r="2.4" fill={`url(#${g})`} />
      <path d="M3 80 0 75 3 70 6 75ZM80 3 75 0 70 3 75 6Z" fill={`url(#${g})`} />
    </svg>
  );
}

/** A floral divider: a small peony flanked by leaves and fine gold rules that fade out. */
function FloralDivider({ color, width = 220 }: DividerProps) {
  const g = svgId("cd");
  const { hi, mid, lo } = goldStops(color);
  return (
    <svg width={width} height={(width * 40) / 240} viewBox="0 0 240 40" aria-hidden focusable="false" style={{ display: "block", margin: "0 auto", maxWidth: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hi} />
          <stop offset="0.5" stopColor={mid} />
          <stop offset="1" stopColor={lo} />
        </linearGradient>
        <linearGradient id={`${g}l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={mid} stopOpacity="0" />
          <stop offset="1" stopColor={mid} />
        </linearGradient>
        <radialGradient id={`${g}p`} cx="0.5" cy="0.8" r="1">
          <stop offset="0" stopColor={PIGMENT.rose} />
          <stop offset="0.6" stopColor={PIGMENT.blushDeep} />
          <stop offset="1" stopColor={PIGMENT.blush} />
        </radialGradient>
      </defs>
      <path d="M6 20H92" stroke={`url(#${g}l)`} strokeWidth="1" />
      <path d="M234 20H148" stroke={`url(#${g}l)`} strokeWidth="1" />
      <path d="M96 20c-8 0-12 6-9 11M144 20c8 0 12 6 9 11" fill="none" stroke={`url(#${g})`} strokeWidth="0.9" strokeLinecap="round" />
      {[
        [96, 20, -20], [100, 20, 20], [140, 20, 160], [144, 20, 200],
      ].map(([x, y, r], i) => (
        <path key={i} transform={`translate(${x} ${y}) rotate(${r})`} d="M0 0C4 -6 13 -7 20 0C13 7 4 6 0 0Z" fill={PIGMENT.sageDeep} opacity="0.8" />
      ))}
      <g transform="translate(120 20)">
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <path key={r} transform={`rotate(${r})`} d="M0 0C-6 -3 -9 -12 -3 -17C0 -19 3 -19 5 -17C10 -12 6 -3 0 0Z" fill={`url(#${g}p)`} stroke={PIGMENT.rose} strokeOpacity="0.4" strokeWidth="0.5" />
        ))}
        {[30, 90, 150, 210, 270, 330].map((r) => (
          <path key={r} transform={`rotate(${r}) scale(0.62)`} d="M0 0C-6 -3 -9 -12 -3 -17C0 -19 3 -19 5 -17C10 -12 6 -3 0 0Z" fill={PIGMENT.rose} fillOpacity="0.8" />
        ))}
        <circle r="2.6" fill={`url(#${g})`} />
      </g>
      <path d="M6 20 10 17 14 20 10 23ZM234 20 230 17 226 20 230 23Z" fill={`url(#${g})`} />
    </svg>
  );
}

/** The shared slot hands over the accent and ground; the cream backdrop derives its pigments from those two. */
function CreamBackdrop({ color, ground }: BackdropProps) {
  return <SectionBackdrop theme={{ bg_color: ground, accent_color: color, text_color: "#000000", font_style: "serif" }} />;
}

function CreamCrest({ color, ground, label, size = 96 }: CrestProps) {
  return <Shield color={color} ground={ground} label={label} size={size} />;
}

/** Parchment card with watercolour blush and champagne washes; a glass card if a couple recolours it dark. */
function surface(theme: Theme): CSSProperties {
  const gold = withAlpha(theme.accent_color, 0.5);
  if (isDarkColor(theme.bg_color)) {
    return {
      background: `linear-gradient(180deg, ${withAlpha(theme.accent_color, 0.1)}, ${withAlpha(theme.accent_color, 0.03)})`,
      border: `1px solid ${gold}`,
      boxShadow: "0 24px 60px -24px rgba(0,0,0,0.7)",
    };
  }
  const paperHi = mixHex(theme.bg_color, "#ffffff", 40);
  const paperLo = mixHex(theme.bg_color, PIGMENT.champagne, 80);
  return {
    background:
      `radial-gradient(120% 70% at 100% 0%, ${withAlpha(PIGMENT.blush, 0.34)}, transparent 58%),` +
      `radial-gradient(110% 60% at 0% 100%, ${withAlpha(PIGMENT.champagne, 0.5)}, transparent 62%),` +
      `linear-gradient(180deg, ${paperHi}, ${paperLo})`,
    border: `1px solid ${gold}`,
    boxShadow: `0 26px 50px -28px rgba(120,80,30,0.5), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 0 0 4px ${withAlpha(paperHi, 0.55)}`,
  };
}

/** Latin headings in the calligraphic script; Khmer headings in Moul. Both in warm gold foil. */
function heading(theme: Theme, language: "en" | "kh"): CSSProperties {
  const khmer = language === "kh";
  return {
    fontFamily: khmer ? MOUL_FONT : SCRIPT,
    fontWeight: 400,
    fontSize: khmer ? undefined : "2.15rem",
    letterSpacing: "normal",
    textTransform: "none",
    lineHeight: khmer ? 1.9 : 1.2,
    color: theme.accent_color,
    backgroundImage: foilTextGradient(theme.accent_color, theme.bg_color),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.6)) drop-shadow(0 2px 2px rgba(110,70,20,0.25))",
  };
}


export const CREAM_ORNAMENTS: SkinOrnaments = {
  id: "cream",
  Corner: CreamCorner,
  Divider: FloralDivider,
  Crest: CreamCrest,
  icons: CREAM_ICONS,
  Backdrop: CreamBackdrop,
  corners: true,
  inset: 6,
  radius: 28,
  surface,
  heading,
  iconStroke: 1.4,
  motion: "float",
};

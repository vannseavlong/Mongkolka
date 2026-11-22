import type { CSSProperties, ReactNode } from "react";
import { AGENDA_ICONS, type AgendaIcon, type Theme } from "../../types";
import { CINZEL_FONT, MOUL_FONT } from "../../chrome/fonts";
import { goldStops, mixHex, withAlpha } from "../../chrome/gold";
import { GoldGradientDef, useSvgId } from "../khmer/ornaments/Corner";
import { DEFAULT_ICONS } from "../khmer/ornaments/icons";
import { foilTextGradient } from "../khmer/foil";
import type { CrestProps, DividerProps, IconProps, IconSet, OrnamentProps, SkinOrnaments } from "../khmer/skin-ornament-types";
import { Medallion } from "./art/Medallion";
import { emeraldPalette, latticeDataUri } from "./palette";

/** Art-Deco stepped corner: two stepped rules, a flame leaf on the diagonal and a jewel. Original. */
export function EmeraldCorner({ color, size = 64 }: OrnamentProps) {
  const g = useSvgId("ec");
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <GoldGradientDef id={g} color={color} />
      </defs>
      <g fill="none" stroke={`url(#${g})`} strokeLinejoin="miter" strokeLinecap="square">
        <path d="M2 78V30H8V22H16V14H24V8H32V2H78" strokeWidth="1.8" />
        <path d="M10 78V38H15V31H22V24H29V17H36V10H78" strokeWidth="0.8" opacity="0.7" />
        <path d="M20 20C20 32 28 40 42 42C40 28 32 20 20 20Z" strokeWidth="0.9" opacity="0.85" />
      </g>
      <path d="M14 14C14 30 26 40 48 44C42 24 32 14 14 14Z" fill={`url(#${g})`} opacity="0.9" />
      <path d="M2 2 8 2 2 8Z" fill={`url(#${g})`} />
      <path d="M62 8 66 12 62 16 58 12ZM8 62 12 66 8 70 4 66Z" fill={`url(#${g})`} />
    </svg>
  );
}

/** A diamond-chain rule with a centre lotus. */
export function EmeraldDivider({ color, width = 232 }: DividerProps) {
  const g = useSvgId("ev");
  return (
    <svg width={width} height={22} viewBox="0 0 232 22" aria-hidden focusable="false" style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}>
      <defs>
        <GoldGradientDef id={g} color={color} />
      </defs>
      <g fill="none" stroke={`url(#${g})`} strokeWidth="1">
        <path d="M6 11H92M140 11H226" />
        <path d="M6 7V15M226 7V15" />
        <path d="M100 11 106 6 112 11 106 16ZM120 11 126 6 132 11 126 16Z" />
      </g>
      <path d="M116 2C110 8 110 14 116 20C122 14 122 8 116 2Z" fill={`url(#${g})`} />
      <path d="M116 20C108 19 103 14 103 9C110 10 114 14 116 20ZM116 20C124 19 129 14 129 9C122 10 118 14 116 20Z" fill={`url(#${g})`} opacity="0.55" />
      <g fill={`url(#${g})`}>
        <path d="M96 11 98 9 100 11 98 13ZM132 11 134 9 136 11 134 13Z" />
      </g>
    </svg>
  );
}

function EmeraldCrest({ color, ground, label, size = 120 }: CrestProps) {
  return <Medallion color={color} ground={ground} label={label} size={size} glow={false} />;
}

/** Wraps a shared line icon in an octagonal gold cartouche, so the agenda reads as Art-Deco plaques. */
function badge(Icon: (p: IconProps) => ReactNode): (p: IconProps) => ReactNode {
  return function Badge({ color, size = 40, strokeWidth }: IconProps) {
    const g = useSvgId("eb");
    const inner = Math.round(size * 0.58);
    return (
      <span aria-hidden style={{ position: "relative", display: "inline-grid", placeItems: "center", width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 48 48" style={{ position: "absolute", inset: 0 }} focusable="false">
          <defs>
            <GoldGradientDef id={g} color={color} />
          </defs>
          <path d="M15 2H33L46 15V33L33 46H15L2 33V15Z" fill="none" stroke={`url(#${g})`} strokeWidth="1.6" />
          <path d="M16.5 6H31.5L42 16.5V31.5L31.5 42H16.5L6 31.5V16.5Z" fill="none" stroke={`url(#${g})`} strokeWidth="0.6" opacity="0.65" />
        </svg>
        <span style={{ position: "relative", display: "block", lineHeight: 0 }}>
          <Icon color={color} size={inner} strokeWidth={strokeWidth} />
        </span>
      </span>
    );
  };
}

const ICONS = Object.fromEntries(AGENDA_ICONS.map((k) => [k, badge(DEFAULT_ICONS[k as AgendaIcon] as (p: IconProps) => ReactNode)])) as unknown as IconSet;

function surface(theme: Theme): CSSProperties {
  const p = emeraldPalette(theme);
  const { hi, mid } = p.gold;
  return {
    background: `linear-gradient(180deg, ${withAlpha(p.lift, 0.96)}, ${withAlpha(p.deep, 0.97)})`,
    border: `1px solid ${mid}`,
    boxShadow: `0 28px 60px -26px rgba(0,0,0,0.85), inset 0 0 0 4px ${withAlpha(p.deep, 0.9)}, inset 0 0 0 5px ${withAlpha(mid, 0.45)}, inset 0 1px 0 ${withAlpha(hi, 0.35)}`,
  };
}

function heading(theme: Theme, language: "en" | "kh"): CSSProperties {
  return {
    fontFamily: language === "kh" ? MOUL_FONT : CINZEL_FONT,
    fontWeight: language === "kh" ? 400 : 700,
    letterSpacing: language === "kh" ? "normal" : "0.16em",
    textTransform: language === "kh" ? "none" : "uppercase",
    lineHeight: language === "kh" ? 1.9 : 1.4,
    color: theme.accent_color,
    backgroundImage: foilTextGradient(theme.accent_color, theme.bg_color),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.18)) drop-shadow(0 2px 5px rgba(0,0,0,0.65))",
  };
}

function sectionBackground(theme: Theme): CSSProperties {
  const p = emeraldPalette(theme);
  const glow = withAlpha(mixHex(theme.accent_color, theme.bg_color, 30), 0.16);
  return {
    backgroundColor: p.deep,
    backgroundImage: `${latticeDataUri(theme.accent_color, 0.07)}, radial-gradient(110% 55% at 50% 0%, ${glow}, transparent 70%), radial-gradient(90% 50% at 50% 100%, ${withAlpha(goldStops(theme.accent_color).mid, 0.1)}, transparent 70%), linear-gradient(180deg, ${p.deep}, ${p.ground} 50%, ${p.deep})`,
    backgroundSize: "56px 56px, auto, auto, auto",
  };
}

/** The emerald & gold Art-Deco kbach set the shared Khmer sections wear in this template. */
export const EMERALD_ORNAMENTS: SkinOrnaments = {
  id: "emerald",
  Corner: EmeraldCorner,
  Divider: EmeraldDivider,
  Crest: EmeraldCrest,
  icons: ICONS,
  corners: true,
  inset: 9,
  radius: 4,
  surface,
  heading,
  sectionBackground,
  iconStroke: 1.5,
  motion: "shimmer",
};

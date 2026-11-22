import type { CSSProperties } from "react";
import type { Theme } from "../../types";
import { ROUNDED_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import type { CrestProps, DividerProps, OrnamentProps, SkinOrnaments } from "../khmer/skin-ornament-types";
import { KIDS_MEDIA } from "./media";
import { KidsSectionBackdrop } from "./art/Backdrop";
import { KIDS_ICONS } from "./art/icons";
import { KIDS_PASTELS } from "./art/palette";

/** Corner: a little cluster of soft bubbles with a star, drawn for the top-left and mirrored by the frame. */
function BubbleCorner({ color, size = 54 }: OrnamentProps) {
  const soft = withAlpha(color, 0.22);
  return (
    <svg width={size} height={size} viewBox="0 0 54 54" aria-hidden focusable="false">
      <circle cx="13" cy="13" r="10" fill={KIDS_PASTELS.mint} />
      <circle cx="31" cy="9" r="6" fill={KIDS_PASTELS.lavender} />
      <circle cx="9" cy="31" r="6" fill={KIDS_PASTELS.peach} />
      <circle cx="13" cy="13" r="10" fill="none" stroke={soft} strokeWidth="2" />
      <path d="M33 25 35.2 30l5.2.6-3.9 3.5 1.1 5.1L33 36.6l-4.6 2.6 1.1-5.1-3.9-3.5 5.2-.6Z" fill={KIDS_PASTELS.gold} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="46" cy="14" r="2.2" fill={color} opacity=".55" />
      <circle cx="14" cy="46" r="2.2" fill={color} opacity=".55" />
    </svg>
  );
}

/** Divider: dotted lines either side of a star, a heart and a star. */
function PartyDivider({ color, width = 190 }: DividerProps) {
  return (
    <svg width={width} height="22" viewBox="0 0 190 22" aria-hidden focusable="false" style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}>
      <path d="M4 11H70M120 11H186" stroke={withAlpha(color, 0.5)} strokeWidth="3" strokeLinecap="round" strokeDasharray="0.1 9" />
      <path d="M82 11 84 6.4 88.8 6.4 85 9.4 86.4 14 82 11.2 77.6 14 79 9.4 75.2 6.4 80 6.4Z" fill={KIDS_PASTELS.gold} transform="translate(0 -1)" />
      <path d="M95 17C88 12 86 9 86 7A4 4 0 0 1 95 6.4 4 4 0 0 1 104 7C104 9 102 12 95 17Z" fill={color} transform="translate(0 0)" />
      <path d="M108 11 110 6.4 114.8 6.4 111 9.4 112.4 14 108 11.2 103.6 14 105 9.4 101.2 6.4 106 6.4Z" fill={KIDS_PASTELS.lavender} transform="translate(0 -1)" />
    </svg>
  );
}

/** Crest: a scalloped badge (like a cookie) with a crown-star on top and the monogram in a bubbly face. */
function BadgeCrest({ color, ground, label, size = 116 }: CrestProps) {
  const scallops = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return { x: 60 + Math.cos(a) * 46, y: 64 + Math.sin(a) * 46 };
  });
  const rose = mixHex(color, "#ff7a96", 30);
  return (
    <svg width={size} height={(size * 132) / 120} viewBox="0 0 120 132" role="img" aria-label={label} focusable="false">
      <defs>
        <linearGradient id="kd-crest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rose} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      {scallops.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="11" fill="url(#kd-crest)" />
      ))}
      <circle cx="60" cy="64" r="46" fill="url(#kd-crest)" />
      <circle cx="60" cy="64" r="38" fill="#fff" />
      <circle cx="60" cy="64" r="38" fill="none" stroke={withAlpha(color, 0.35)} strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
      <circle cx="60" cy="64" r="32" fill={ground} />
      <path d="M40 22 46 7 54 16 60 3 66 16 74 7 80 22Z" fill={KIDS_PASTELS.gold} stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="60" cy="12" r="2.6" fill={rose} />
      <text x="60" y="76" textAnchor="middle" fontFamily={ROUNDED_FONT} fontWeight="700" fontSize={label.length > 4 ? 22 : 30} fill={color}>
        {label}
      </text>
    </svg>
  );
}

function surface(theme: Theme): CSSProperties {
  const a = theme.accent_color;
  return {
    background: `linear-gradient(180deg, rgba(255,255,255,.94), ${withAlpha(mixHex(theme.bg_color, "#ffffff", 40), 0.9)})`,
    border: `2.5px solid ${withAlpha(a, 0.28)}`,
    boxShadow: `0 7px 0 -1px ${withAlpha(a, 0.16)}, 0 28px 50px -26px ${withAlpha(a, 0.5)}`,
    WebkitBackdropFilter: "blur(8px)",
    backdropFilter: "blur(8px)",
  };
}

function heading(theme: Theme, language: "en" | "kh"): CSSProperties {
  const a = theme.accent_color;
  return {
    fontFamily: ROUNDED_FONT,
    fontWeight: 700,
    letterSpacing: "0.01em",
    textTransform: "none",
    lineHeight: language === "kh" ? 1.7 : 1.25,
    color: a,
    backgroundImage: `linear-gradient(120deg, ${mixHex(a, "#ff7a96", 35)} 0%, ${a} 58%, ${mixHex(a, "#6b0f33", 78)} 100%)`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 2px 0 rgba(255,255,255,.95))",
  };
}

/** The kids skin's SkinOrnaments: bubble corners, a star-and-heart divider, a cookie badge, party icons, frosted cards, bubbly gradient headings and a painted backdrop. */
export const KIDS_ORNAMENTS: SkinOrnaments = {
  id: "kids",
  Corner: BubbleCorner,
  Divider: PartyDivider,
  Crest: BadgeCrest,
  icons: KIDS_ICONS,
  corners: true,
  inset: 9,
  radius: 34,
  surface,
  heading,
  iconStroke: 2.2,
  motion: "float",
  media: KIDS_MEDIA,
  Backdrop: KidsSectionBackdrop,
};

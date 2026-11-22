import type { CSSProperties, ReactNode } from "react";
import type { Theme } from "../../types";
import { CINZEL_FONT, MOUL_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import type { CrestProps, DividerProps, IconProps, IconSet, OrnamentProps, SkinOrnaments } from "../khmer/skin-ornament-types";
import { FAIRYTALE_MEDIA } from "./media";
import { Hydrangea, Leaf, Morpho, Sprig, useUid } from "./art";
import { PINK, PINK_DEEP, bloomsFor } from "./fairytale-logic";
import { Backdrop } from "./Backdrop";

export const SCRIPT_FONT = 'var(--font-script), "Great Vibes", var(--font-moul), "Noto Serif Khmer", cursive';

/** Top-left corner spray: a hydrangea head with baby's-breath running along the top and left edges. */
export function SprayCorner({ color, size = 64 }: OrnamentProps) {
  const blooms = bloomsFor(color, "#ffffff");
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <Sprig x={34} y={-6} rotate={78} scale={0.62} />
      <Sprig x={-6} y={36} rotate={168} scale={0.62} />
      <Hydrangea x={22} y={22} r={17} blooms={blooms} seed={7} count={11} leaves={false} />
      <Leaf x={34} y={30} rotate={40} scale={0.8} />
      <Leaf x={30} y={36} rotate={70} scale={0.7} />
      <circle cx="30" cy="12" r="2.4" fill={PINK} />
      <circle cx="12" cy="30" r="2.4" fill={PINK_DEEP} />
    </svg>
  );
}

/** A thin vine with a small blue butterfly in the middle. */
export function VineDivider({ color, width = 220 }: DividerProps) {
  const g = useUid("vd");
  const h = 30;
  return (
    <svg width={width} height={h} viewBox="0 0 220 30" aria-hidden focusable="false" style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={color} stopOpacity="0" />
          <stop offset="0.35" stopColor={color} stopOpacity="0.9" />
          <stop offset="0.65" stopColor={color} stopOpacity="0.9" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${g})`} strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M6 16C28 8 48 22 70 15C84 11 92 14 98 15" />
        <path d="M214 16C192 8 172 22 150 15C136 11 128 14 122 15" />
      </g>
      {[[24, 12], [46, 19], [66, 14], [196, 12], [174, 19], [154, 14]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 2 ? 1.6 : 2.2} fill={i % 3 === 0 ? PINK : "#ffffff"} stroke={color} strokeOpacity=".4" strokeWidth=".6" />
      ))}
      <Leaf x={34} y={16} rotate={-40} scale={0.34} />
      <Leaf x={186} y={16} rotate={220} scale={0.34} />
      <g transform="translate(97 3)">
        <Morpho size={26} flap={false} />
      </g>
    </svg>
  );
}

/** Round monogram crest: a wreath of leaves and baby's-breath around script initials, pink bow below. */
export function WreathCrest({ color, ground, label, size = 96 }: CrestProps) {
  const leaves = Array.from({ length: 14 }, (_, i) => i * (360 / 14));
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <circle cx="60" cy="60" r="41" fill={ground} stroke={color} strokeWidth="1.6" />
      <circle cx="60" cy="60" r="36" fill="none" stroke={color} strokeOpacity=".4" strokeWidth=".8" />
      {leaves.map((a, i) => (
        <g key={a} transform={`rotate(${a} 60 60)`}>
          <Leaf x={60} y={14} rotate={i % 2 ? 62 : 118} scale={0.5} color={i % 2 ? "#86b5a0" : "#a9cdbb"} />
          <circle cx="60" cy="9" r="2.3" fill="#ffffff" stroke={color} strokeOpacity=".35" strokeWidth=".6" />
        </g>
      ))}
      {[40, 130, 220, 310].map((a) => (
        <g key={a} transform={`rotate(${a} 60 60)`}>
          <circle cx="60" cy="16" r="3.6" fill={PINK} stroke={PINK_DEEP} strokeWidth=".6" />
        </g>
      ))}
      <path d="M60 104C52 100 44 102 46 109C48 114 56 110 60 104C64 110 72 114 74 109C76 102 68 100 60 104Z" fill={PINK} stroke={PINK_DEEP} strokeWidth=".8" />
      <text x="60" y="68" textAnchor="middle" fontSize="26" fill={color} style={{ fontFamily: SCRIPT_FONT }}>
        {label}
      </text>
    </svg>
  );
}

function Soft({ color, size = 40, strokeWidth = 1.6, children }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false" style={{ display: "block" }}>
      {children}
      <path d="M40 8v4M38 10h4" strokeWidth={1.1} opacity=".7" />
    </svg>
  );
}

const Monk = (p: IconProps) => (
  <Soft {...p}>
    <path d="M12 38C12 26 17 20 24 20C31 20 36 26 36 38Z" />
    <circle cx="24" cy="12" r="5.5" />
    <path d="M18 28C22 31 26 31 30 28" />
    <path d="M8 42H40" opacity=".6" />
  </Soft>
);
const Procession = (p: IconProps) => (
  <Soft {...p}>
    <path d="M10 22H38L35 31H13Z" />
    <path d="M24 22V15M19 15H29" />
    <path d="M16 31V40M32 31V40M12 40H20M28 40H36" />
    <circle cx="24" cy="12" r="2.4" />
  </Soft>
);
const Scissors = (p: IconProps) => (
  <Soft {...p}>
    <path d="M15 6L33 30M33 6L15 30" />
    <circle cx="14" cy="36" r="5" />
    <circle cx="34" cy="36" r="5" />
  </Soft>
);
const Thread = (p: IconProps) => (
  <Soft {...p}>
    <ellipse cx="24" cy="26" rx="14" ry="9" />
    <ellipse cx="24" cy="26" rx="9" ry="5" opacity=".6" />
    <path d="M22 17C20 11 26 9 26 14C26 17 22 14 22 17M26 17C30 12 33 15 29 19" />
    <path d="M12 38C16 42 32 42 36 38" opacity=".6" />
  </Soft>
);
const Ring = (p: IconProps) => (
  <Soft {...p}>
    <circle cx="24" cy="30" r="10" />
    <circle cx="24" cy="30" r="6.5" opacity=".6" />
    <path d="M20 14L24 8L28 14L24 20Z" />
  </Soft>
);
const Tea = (p: IconProps) => (
  <Soft {...p}>
    <path d="M10 20H34V28C34 34 29 38 22 38C15 38 10 34 10 28Z" />
    <path d="M34 22H38C41 22 41 30 36 30H34" />
    <path d="M8 42H36" opacity=".6" />
    <path d="M17 14C15 11 19 10 17 7M24 14C22 11 26 10 24 7" opacity=".7" />
  </Soft>
);
const Dinner = (p: IconProps) => (
  <Soft {...p}>
    <path d="M8 34C8 22 15 16 24 16C33 16 40 22 40 34Z" />
    <path d="M6 38H42" />
    <circle cx="24" cy="12" r="2.4" />
    <path d="M16 26C18 22 21 20 24 20" opacity=".6" />
  </Soft>
);
const Party = (p: IconProps) => (
  <Soft {...p}>
    <path d="M10 40L18 16L32 30Z" />
    <path d="M26 12C28 8 32 8 32 12C32 16 28 14 30 18" />
    <path d="M36 20L40 18M34 26L40 27M20 8L18 4" opacity=".7" />
    <circle cx="38" cy="36" r="1.4" fill="currentColor" />
  </Soft>
);
const Cake = (p: IconProps) => (
  <Soft {...p}>
    <path d="M10 26H38V40H10Z" />
    <path d="M10 32C14 36 18 28 22 32C26 36 30 28 34 32C36 34 37 33 38 32" />
    <path d="M24 26V18" />
    <path d="M24 10C26 13 26 16 24 18C22 16 22 13 24 10Z" />
  </Soft>
);

export const FAIRYTALE_ICONS: IconSet = { monk: Monk, procession: Procession, scissors: Scissors, thread: Thread, ring: Ring, tea: Tea, dinner: Dinner, party: Party, cake: Cake };

/** Frosted white card with a thin royal-blue hairline and a soft sky shadow. */
function surface(theme: Theme): CSSProperties {
  return {
    background: `linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.8))`,
    border: `1px solid ${withAlpha(theme.accent_color, 0.4)}`,
    boxShadow: `0 26px 56px -28px ${withAlpha(theme.accent_color, 0.55)}, inset 0 1px 0 #ffffff, inset 0 0 0 4px rgba(255,255,255,0.55)`,
    WebkitBackdropFilter: "blur(5px)",
    backdropFilter: "blur(5px)",
  };
}

/** Royal-blue foil with a white emboss: stays dark enough to read on the white card. */
function heading(theme: Theme, language: "en" | "kh"): CSSProperties {
  const top = mixHex(theme.accent_color, theme.text_color, 70);
  return {
    fontFamily: language === "kh" ? MOUL_FONT : CINZEL_FONT,
    fontWeight: language === "kh" ? 400 : 600,
    letterSpacing: language === "kh" ? "normal" : "0.14em",
    textTransform: language === "kh" ? "none" : "uppercase",
    lineHeight: language === "kh" ? 1.9 : 1.4,
    color: theme.accent_color,
    backgroundImage: `linear-gradient(160deg, ${mixHex(theme.accent_color, "#ffffff", 88)} 0%, ${theme.accent_color} 40%, ${top} 100%)`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.9)) drop-shadow(0 2px 3px rgba(23,45,100,0.25))",
  };
}

export const FAIRYTALE_ORNAMENTS: SkinOrnaments = {
  id: "fairytale",
  Corner: SprayCorner,
  Divider: VineDivider,
  Crest: WreathCrest,
  icons: FAIRYTALE_ICONS,
  corners: true,
  inset: 9,
  radius: 30,
  surface,
  heading,
  iconStroke: 1.5,
  motion: "float",
  media: FAIRYTALE_MEDIA,
  Backdrop,
};

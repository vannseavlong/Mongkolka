import { useId, type CSSProperties } from "react";
import type { Theme } from "../../types";
import { MOUL_FONT } from "../../chrome/fonts";
import { goldStops, mixHex, withAlpha } from "../../chrome/gold";
import { DEFAULT_ICONS } from "../khmer/ornaments/icons";
import { foilTextGradient, isDarkColor } from "../khmer/foil";
import type { CrestProps, DividerProps, MediaFrameProps, OrnamentProps, SkinMedia, SkinOrnaments } from "../khmer/skin-ornament-types";
import { PhotoBox } from "../skinned/gallery-media";
import { buttonStyle, fieldStyle, mediaTones, noteStyle } from "../skinned/gallery-tones";
import { Blossom, CROSS_PATH } from "./cross";
import { covenantPalette, PINK } from "./palette";

const svgId = (prefix: string) => `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
const SCRIPT = 'var(--font-script), "Great Vibes", cursive';

function GoldDef({ id, color }: { id: string; color: string }) {
  const { hi, mid, lo } = goldStops(color);
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={hi} />
      <stop offset="0.5" stopColor={mid} />
      <stop offset="1" stopColor={lo} />
    </linearGradient>
  );
}

/** Top-left card corner: a gold hairline that turns the corner, a leaf sprig and a blush blossom. */
function CovenantCorner({ color, size = 60 }: OrnamentProps) {
  const g = svgId("cvc");
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <GoldDef id={g} color={color} />
      </defs>
      <g fill="none" stroke={`url(#${g})`} strokeLinecap="round">
        <path d="M3 64C3 22 22 3 64 3" strokeWidth="1.5" />
        <path d="M9 58C9 27 27 9 58 9" strokeWidth="0.7" opacity="0.7" />
      </g>
      <path d="M20 30C24 22 33 21 40 25C34 32 25 34 20 30Z" fill="#9db08a" opacity="0.8" />
      <path d="M30 20C35 15 44 17 47 23C40 25 33 25 30 20Z" fill="#b3c4a0" opacity="0.85" />
      <Blossom x={17} y={17} r={9} petal={PINK.petal} centre={goldStops(color).mid} />
      <circle cx="3" cy="3" r="2.2" fill={`url(#${g})`} />
    </svg>
  );
}

/** Two fading gold rules around a small cross, with a blossom on each side. */
function CrossDivider({ color, width = 220 }: DividerProps) {
  const g = svgId("cvd");
  const { mid } = goldStops(color);
  return (
    <svg width={width} height={(width * 36) / 240} viewBox="0 0 240 36" aria-hidden focusable="false" style={{ display: "block", margin: "0 auto", maxWidth: "100%", overflow: "visible" }}>
      <defs>
        <GoldDef id={g} color={color} />
        <linearGradient id={`${g}l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={mid} stopOpacity="0" />
          <stop offset="1" stopColor={mid} />
        </linearGradient>
      </defs>
      <path d="M6 18H92" stroke={`url(#${g}l)`} strokeWidth="1" />
      <path d="M234 18H148" stroke={`url(#${g}l)`} strokeWidth="1" />
      <Blossom x={100} y={18} r={7} petal={PINK.petal} centre={mid} />
      <Blossom x={140} y={18} r={7} petal={PINK.petal} centre={mid} />
      <g transform="translate(120 18) scale(0.17) translate(-50 -70)">
        <path d={CROSS_PATH} fill={`url(#${g})`} />
      </g>
    </svg>
  );
}

/** A gold ring with the monogram, a small cross on top and a blush wreath of blossoms below. */
function CovenantCrest({ color, ground, label, size = 104 }: CrestProps) {
  const g = svgId("cvk");
  const { lo, mid } = goldStops(color);
  const long = Array.from(label).length > 5;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={label} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <GoldDef id={g} color={color} />
      </defs>
      <circle cx="60" cy="64" r="42" fill={ground} stroke={`url(#${g})`} strokeWidth="2" />
      <circle cx="60" cy="64" r="36.5" fill={withAlpha(PINK.blush, 0.55)} stroke={`url(#${g})`} strokeWidth="0.7" />
      <g transform="translate(60 14) scale(0.13) translate(-50 -70)">
        <path d={CROSS_PATH} fill={`url(#${g})`} />
      </g>
      {[-60, -30, 30, 60].map((a) => {
        const rad = ((a + 90) * Math.PI) / 180;
        return <Blossom key={a} x={60 + Math.cos(rad) * 42} y={64 + Math.sin(rad) * 42} r={5} petal={PINK.petal} centre={mid} />;
      })}
      <text x="60" y={long ? 71 : 74} textAnchor="middle" fontSize={long ? 21 : 29} fill={`url(#${g})`} stroke={lo} strokeWidth="0.15" style={{ fontFamily: SCRIPT }}>
        {label}
      </text>
    </svg>
  );
}

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
  Crest: CovenantCrest,
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

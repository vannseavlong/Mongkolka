"use client";

import { ROUNDED_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import type { MediaFrameProps, SkinMedia } from "../khmer/skin-ornament-types";
import { PhotoBox } from "../skinned/gallery-media";
import { buttonStyle, fieldStyle, noteStyle } from "../skinned/gallery-tones";
import { KIDS_PASTELS, kidsPalette } from "./art/palette";

const TILTS = [-2.2, 1.6, -1.2, 2.4] as const;

function Star({ size, fill }: { size: number; fill: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <path d="M20 3l5 11.2 12.2 1.2-9.2 8.2 2.7 12L20 29.3 9.3 35.6l2.7-12L2.8 15.4 15 14.2Z" fill={fill} stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

/** A sticker: thick white border over a candy-coloured ring, a chunky flat shadow, a star badge and a heart. */
function KidsFrame({ theme, index, aspect, variant, children }: MediaFrameProps) {
  const p = kidsPalette(theme);
  const ring = [p.rose, KIDS_PASTELS.mint, KIDS_PASTELS.lavender, KIDS_PASTELS.peach][index % 4]!;
  const big = variant !== "wall";
  return (
    <span className="relative block w-full">
      <span
        className="block"
        style={{ padding: big ? 6 : 4, borderRadius: 28, backgroundColor: ring, boxShadow: `0 6px 0 -1px ${withAlpha(p.berry, 0.28)}, 0 18px 24px -14px ${withAlpha(p.berry, 0.5)}` }}
      >
        <span className="block" style={{ padding: big ? 5 : 4, borderRadius: 22, backgroundColor: "#ffffff" }}>
          <PhotoBox aspect={aspect ?? "aspect-[4/5]"} style={{ borderRadius: 18, backgroundColor: KIDS_PASTELS.peach }}>
            {children}
          </PhotoBox>
        </span>
      </span>
      {variant !== "preview" && (
        <>
          <span aria-hidden className="pointer-events-none absolute -right-2 -top-3" style={{ transform: `rotate(${(index % 3) * 14 + 8}deg)` }}>
            <Star size={big ? 30 : 22} fill={index % 2 ? KIDS_PASTELS.gold : p.rose} />
          </span>
          <span aria-hidden className="pointer-events-none absolute -left-1 -top-2 text-xl leading-none" style={{ color: p.rose, textShadow: "0 2px 0 #fff" }}>
            ♥
          </span>
        </>
      )}
    </span>
  );
}

export const KIDS_MEDIA: SkinMedia = {
  Frame: KidsFrame,
  aspect: "aspect-[4/5]",
  fontFamily: ROUNDED_FONT,
  tilt: (i) => TILTS[Math.abs(Math.floor(i)) % TILTS.length]!,
  note: (theme) => ({
    ...noteStyle(theme, { radius: 26, borderWidth: 2.5 }),
    backgroundColor: "rgba(255,255,255,0.92)",
    border: `2.5px solid ${withAlpha(theme.accent_color, 0.28)}`,
    boxShadow: `0 6px 0 -1px ${withAlpha(theme.accent_color, 0.16)}, 0 22px 34px -22px ${withAlpha(theme.accent_color, 0.5)}`,
    fontFamily: ROUNDED_FONT,
    color: theme.text_color,
  }),
  field: (theme, invalid) => ({ ...fieldStyle(theme, invalid, { radius: 18, borderWidth: 2.5, background: "#ffffff" }), fontFamily: ROUNDED_FONT }),
  button: (theme) => ({
    ...buttonStyle(theme, { radius: 999, shade: mixHex(theme.accent_color, "#6b0f33", 72), background: `linear-gradient(180deg, ${mixHex(theme.accent_color, "#ff7a96", 70)}, ${theme.accent_color})` }),
    fontFamily: ROUNDED_FONT,
    fontWeight: 700,
  }),
};

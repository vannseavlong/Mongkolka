"use client";

import type { CSSProperties } from "react";
import { withAlpha } from "../../chrome/gold";
import type { MediaFrameProps, SkinMedia } from "../khmer/skin-ornament-types";
import { useSkinOrnaments } from "../khmer/skin-context";
import { PhotoBox } from "../skinned/gallery-media";
import { buttonStyle, fieldStyle, noteStyle } from "../skinned/gallery-tones";
import { emeraldPalette } from "./palette";

const CORNERS: Array<{ key: string; pos: CSSProperties }> = [
  { key: "tl", pos: { top: -4, left: -4 } },
  { key: "tr", pos: { top: -4, right: -4, transform: "scaleX(-1)" } },
  { key: "bl", pos: { bottom: -4, left: -4, transform: "scaleY(-1)" } },
  { key: "br", pos: { bottom: -4, right: -4, transform: "scale(-1,-1)" } },
];

/**
 * A gold-pinstriped plate: gold edge, deep-emerald mat, a double pin-stripe around the photo, art-deco
 * kbach corners and a small diamond plaque at the foot. Reads like a framed print in a gold-leaf wall.
 */
function EmeraldFrame({ theme, aspect, variant, children }: MediaFrameProps) {
  const p = emeraldPalette(theme);
  const sk = useSkinOrnaments();
  const big = variant !== "wall";
  const edge = big ? 6 : 4;
  const mat = big ? 8 : 5;
  return (
    <span className="relative block w-full" style={{ filter: "drop-shadow(0 14px 16px rgba(0,0,0,0.5))" }}>
      <span
        className="block"
        style={{ padding: edge, borderRadius: 3, backgroundImage: `linear-gradient(135deg, ${p.gold.hi}, ${p.gold.mid} 45%, ${p.gold.lo})` }}
      >
        <span className="block" style={{ padding: mat, borderRadius: 1, backgroundColor: p.deep, boxShadow: `inset 0 0 0 1px ${withAlpha(p.gold.lo, 0.9)}` }}>
          <PhotoBox
            aspect={aspect ?? "aspect-[4/5]"}
            style={{ boxShadow: `0 0 0 1px ${withAlpha(p.gold.hi, 0.9)}, 0 0 0 3px ${p.deep}, 0 0 0 4px ${withAlpha(p.gold.mid, 0.75)}`, backgroundColor: p.lift }}
          >
            {children}
          </PhotoBox>
        </span>
      </span>
      {big &&
        CORNERS.map((c) => (
          <span key={c.key} aria-hidden className="pointer-events-none absolute" style={c.pos}>
            <sk.Corner color={theme.accent_color} size={26} />
          </span>
        ))}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2"
        style={{
          bottom: -7,
          width: 11,
          height: 11,
          transform: "translateX(-50%) rotate(45deg)",
          backgroundImage: `linear-gradient(135deg, ${p.gold.hi}, ${p.gold.lo})`,
          boxShadow: `0 0 0 2px ${p.deep}`,
        }}
      />
    </span>
  );
}

export const EMERALD_MEDIA: SkinMedia = {
  Frame: EmeraldFrame,
  aspect: "aspect-[4/5]",
  note: (theme) => ({
    ...noteStyle(theme, { radius: 4 }),
    backgroundColor: withAlpha(theme.accent_color, 0.07),
    boxShadow: `0 0 0 3px ${theme.bg_color}, 0 0 0 4px ${withAlpha(theme.accent_color, 0.4)}, 0 18px 28px -20px rgba(0,0,0,0.9)`,
  }),
  field: (theme, invalid) => fieldStyle(theme, invalid, { radius: 3, background: "rgba(0,0,0,0.28)" }),
  button: (theme) => ({
    ...buttonStyle(theme, { radius: 4 }),
    letterSpacing: "0.04em",
    boxShadow: `0 0 0 2px ${emeraldPalette(theme).deep}, 0 0 0 3px ${withAlpha(theme.accent_color, 0.85)}, 0 14px 22px -12px rgba(0,0,0,0.8)`,
  }),
};

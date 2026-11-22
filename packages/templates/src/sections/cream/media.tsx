"use client";

import { goldStops, mixHex, withAlpha } from "../../chrome/gold";
import type { MediaFrameProps, SkinMedia } from "../khmer/skin-ornament-types";
import { useSkinOrnaments } from "../khmer/skin-context";
import { PhotoBox } from "../skinned/gallery-media";
import { buttonStyle, fieldStyle, mediaTones, noteStyle } from "../skinned/gallery-tones";
import { creamPalette, PIGMENT } from "./palette";

/**
 * A watercolour oval: a gold ring, a hand-washed blush-and-champagne mat that bleeds unevenly, and a
 * peony spray tucked on two opposite corners. Soft, warm, a little imperfect on purpose.
 */
function CreamFrame({ theme, index, aspect, variant, children }: MediaFrameProps) {
  const p = creamPalette(theme);
  const g = goldStops(theme.accent_color);
  const sk = useSkinOrnaments();
  const big = variant !== "wall";
  const wash = [
    `radial-gradient(70% 60% at 18% 20%, ${withAlpha(PIGMENT.blush, 0.95)}, transparent 70%)`,
    `radial-gradient(65% 60% at 86% 82%, ${withAlpha(PIGMENT.champagne, 0.95)}, transparent 70%)`,
    `radial-gradient(50% 45% at 80% 12%, ${withAlpha(PIGMENT.sage, 0.45)}, transparent 70%)`,
    p.paper,
  ].join(", ");
  const flip = index % 2 === 1;
  return (
    <span className="relative block w-full" style={{ filter: `drop-shadow(0 14px 14px ${withAlpha("#7a5a30", 0.28)})` }}>
      <span className="block rounded-[50%] p-[2.5px]" style={{ backgroundImage: `linear-gradient(135deg, ${g.hi}, ${g.mid} 50%, ${g.lo})` }}>
        <span className="block rounded-[50%]" style={{ padding: big ? 9 : 6, background: wash, boxShadow: `inset 0 0 0 1px ${withAlpha(g.hi, 0.9)}` }}>
          <PhotoBox aspect={aspect ?? "aspect-[4/5]"} className="rounded-[50%]" style={{ backgroundColor: p.champagne, boxShadow: `0 0 0 1.5px ${withAlpha(g.mid, 0.7)}` }}>
            {children}
          </PhotoBox>
        </span>
      </span>
      {big && (
        <>
          {/* An ellipse meets its bounding box at 14.6% in from each corner, so the sprigs sit on the arc, not in empty corners. */}
          <span aria-hidden className="pointer-events-none absolute" style={{ top: "calc(14.6% - 10px)", [flip ? "right" : "left"]: "calc(14.6% - 10px)", transform: flip ? "scaleX(-1)" : undefined }}>
            <sk.Corner color={theme.accent_color} size={52} />
          </span>
          <span aria-hidden className="pointer-events-none absolute" style={{ bottom: "calc(14.6% - 10px)", [flip ? "left" : "right"]: "calc(14.6% - 10px)", transform: flip ? "scaleY(-1)" : "scale(-1,-1)" }}>
            <sk.Corner color={theme.accent_color} size={44} />
          </span>
        </>
      )}
    </span>
  );
}

export const CREAM_MEDIA: SkinMedia = {
  Frame: CreamFrame,
  aspect: "aspect-[4/5]",
  note: (theme) => {
    const base = noteStyle(theme, { radius: 26 });
    if (mediaTones(theme).dark) return base;
    return {
      ...base,
      backgroundColor: undefined,
      backgroundImage: `radial-gradient(110% 70% at 100% 0%, ${withAlpha(PIGMENT.blush, 0.3)}, transparent 60%), linear-gradient(180deg, ${mixHex(theme.bg_color, "#ffffff", 40)}, ${mixHex(theme.bg_color, PIGMENT.champagne, 85)})`,
    };
  },
  field: (theme, invalid) => fieldStyle(theme, invalid, { radius: 18, background: mixHex(theme.bg_color, "#ffffff", 40) }),
  button: (theme) => buttonStyle(theme, { radius: 999 }),
};

"use client";

import { mixHex, withAlpha } from "../../chrome/gold";
import type { MediaFrameProps, SkinMedia } from "../khmer/skin-ornament-types";
import { useSkinOrnaments } from "../khmer/skin-context";
import { PhotoBox } from "../skinned/gallery-media";
import { buttonStyle, fieldStyle, noteStyle } from "../skinned/gallery-tones";
import { SAKURA_GOLD, sakuraPalette } from "./palette";

/**
 * A blossom-bordered keepsake: a rounded card with a gold foil edge and a petal-pink mat that glows
 * lavender, with a blossom sprig tucked into two opposite corners.
 */
function SakuraFrame({ theme, index, aspect, variant, children }: MediaFrameProps) {
  const p = sakuraPalette(theme);
  const sk = useSkinOrnaments();
  const big = variant !== "wall";
  const flip = index % 2 === 1;
  return (
    <span className="relative block w-full" style={{ filter: `drop-shadow(0 14px 16px ${withAlpha(p.lavenderDeep, 0.4)})` }}>
      <span className="block rounded-[22px] p-[2px]" style={{ backgroundImage: `linear-gradient(135deg, ${SAKURA_GOLD.hi}, ${SAKURA_GOLD.mid} 50%, ${SAKURA_GOLD.lo})` }}>
        <span
          className="block rounded-[20px]"
          style={{
            padding: big ? 8 : 5,
            backgroundImage: `linear-gradient(160deg, ${p.petalPale}, ${mixHex(p.petalPale, p.lavender, 70)} 60%, ${p.petalLight})`,
            boxShadow: `inset 0 0 0 1px ${withAlpha("#ffffff", 0.9)}`,
          }}
        >
          <PhotoBox aspect={aspect ?? "aspect-[4/5]"} className="rounded-[14px]" style={{ backgroundColor: p.petalPale, boxShadow: `0 0 0 1px ${withAlpha(SAKURA_GOLD.mid, 0.6)}` }}>
            {children}
          </PhotoBox>
        </span>
      </span>
      {big && (
        <>
          <span aria-hidden className="pointer-events-none absolute" style={{ top: -14, [flip ? "right" : "left"]: -14, transform: flip ? "scaleX(-1)" : undefined }}>
            <sk.Corner color={theme.accent_color} size={62} />
          </span>
          <span aria-hidden className="pointer-events-none absolute" style={{ bottom: -14, [flip ? "left" : "right"]: -14, transform: flip ? "scaleY(-1)" : "scale(-1,-1)" }}>
            <sk.Corner color={theme.accent_color} size={52} />
          </span>
        </>
      )}
    </span>
  );
}

export const SAKURA_MEDIA: SkinMedia = {
  Frame: SakuraFrame,
  aspect: "aspect-[4/5]",
  // the card art hangs blossom branches from the top and grows a flower bed at the foot
  cardPad: { top: 120, bottom: 100 },
  note: (theme) => {
    const p = sakuraPalette(theme);
    return {
      ...noteStyle(theme, { radius: 24, shadow: `0 16px 28px -20px ${withAlpha(p.lavenderDeep, 0.6)}` }),
      backgroundColor: p.card,
      border: `1px solid ${withAlpha(SAKURA_GOLD.mid, 0.55)}`,
      color: theme.text_color,
    };
  },
  field: (theme, invalid) => fieldStyle(theme, invalid, { radius: 16, background: sakuraPalette(theme).cardEdge }),
  button: (theme) => buttonStyle(theme),
};

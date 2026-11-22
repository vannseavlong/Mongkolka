"use client";

import { withAlpha } from "../../chrome/gold";
import type { MediaFrameProps, SkinMedia } from "../khmer/skin-ornament-types";
import { PhotoBox } from "../skinned/gallery-media";
import { buttonStyle, fieldStyle, noteStyle } from "../skinned/gallery-tones";
import { Daisy, HydrangeaSticker, Rose } from "./art";
import { fairytalePalette, polaroidTilt, stickerFor, type StickerCorner } from "./fairytale-logic";

const CORNER_POS: Record<StickerCorner, string> = {
  tl: "-left-3 -top-4",
  tr: "-right-3 -top-4",
  bl: "-bottom-3 -left-3",
  br: "-bottom-3 -right-3",
};

/** A polaroid: white card with a deep bottom margin, hearts on the caption strip and a flower sticker on a corner. */
function FairytaleFrame({ theme, index, aspect, variant, children }: MediaFrameProps) {
  const p = fairytalePalette(theme);
  const big = variant !== "wall";
  const picked = stickerFor(index);
  const kind = picked.kind;
  // On the wall a bottom sticker would sit on the guest's name, so it moves to the matching top corner.
  const corner: StickerCorner = variant === "wall" ? (picked.corner.endsWith("l") ? "tl" : "tr") : picked.corner;
  const size = big ? 1 : 0.72;
  return (
    <span
      className={`relative block w-full bg-white px-2 pt-2 ${big ? "pb-9" : "pb-7"}`}
      style={{ boxShadow: `0 14px 26px -12px ${withAlpha(p.royal, 0.6)}, 0 0 0 1px ${withAlpha(p.royal, 0.12)}` }}
    >
      <PhotoBox aspect={aspect ?? "aspect-[4/5]"} style={{ backgroundColor: p.skyLight }}>
        {children}
      </PhotoBox>
      <span aria-hidden className="absolute inset-x-0 bottom-2 block text-center text-[0.7rem] tracking-[0.3em]" style={{ color: p.royal, opacity: 0.6 }}>
        ♡ ♡ ♡
      </span>
      {variant !== "preview" && (
        <span aria-hidden className={`pointer-events-none absolute ${CORNER_POS[corner]}`} style={{ transform: `rotate(${(index % 3) * 12 - 10}deg)`, filter: "drop-shadow(0 3px 3px rgba(23,45,100,.25))" }}>
          {kind === "rose" ? <Rose size={46 * size} /> : kind === "daisy" ? <Daisy size={42 * size} /> : <HydrangeaSticker size={50 * size} blooms={p.blooms} />}
        </span>
      )}
    </span>
  );
}

export const FAIRYTALE_MEDIA: SkinMedia = {
  Frame: FairytaleFrame,
  aspect: "aspect-[4/5]",
  tilt: polaroidTilt,
  note: (theme) => {
    const p = fairytalePalette(theme);
    return {
      ...noteStyle(theme, { radius: 18, shadow: `0 14px 26px -16px ${withAlpha(p.royal, 0.55)}` }),
      backgroundColor: "rgba(255,255,255,0.9)",
      border: `1px solid ${withAlpha(p.royal, 0.25)}`,
      color: p.ink,
    };
  },
  field: (theme, invalid) => fieldStyle(theme, invalid, { radius: 14, background: "#ffffff" }),
  button: (theme) => buttonStyle(theme),
};

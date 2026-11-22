"use client";

import { withAlpha } from "../../chrome/gold";
import type { MediaFrameProps, SkinMedia } from "../khmer/skin-ornament-types";
import { PhotoBox } from "../skinned/gallery-media";
import { buttonStyle, fieldStyle, noteStyle } from "../skinned/gallery-tones";
import { Bud, Leaf, Rose } from "./art/Botanicals";
import { gardenPalette } from "./palette";

/**
 * An arch window: double gold line following the arch, ivory mat, and a spray of roses and leaves
 * tucked at the crown and the feet, like a garden niche in a palace wall.
 */
function GardenFrame({ theme, index, aspect, variant, children }: MediaFrameProps) {
  const p = gardenPalette(theme);
  const big = variant !== "wall";
  const rose = big ? 34 : 24;
  const flip = index % 2 === 1;
  return (
    <span className="relative block w-full">
      <span className="block rounded-t-[999px] p-[2px]" style={{ backgroundImage: `linear-gradient(135deg, ${p.gold.hi}, ${p.gold.mid} 50%, ${p.gold.lo})`, boxShadow: `0 16px 24px -16px ${withAlpha(p.roseDeep, 0.7)}` }}>
        <span className="block rounded-t-[999px] p-1" style={{ backgroundColor: p.white }}>
          <PhotoBox aspect={aspect ?? "aspect-[3/4]"} className="rounded-t-[999px]" style={{ backgroundColor: p.roseLight }}>
            {children}
          </PhotoBox>
        </span>
      </span>
      <span aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ top: -rose * 0.38 }}>
        <Rose palette={p} width={rose} />
      </span>
      <span aria-hidden className="pointer-events-none absolute" style={{ bottom: -8, [flip ? "right" : "left"]: -8 }}>
        <Leaf palette={p} width={big ? 30 : 22} style={{ transform: `rotate(${flip ? 28 : -28}deg)` }} />
        <Rose palette={p} width={big ? 24 : 18} style={{ position: "absolute", left: flip ? undefined : 8, right: flip ? 8 : undefined, bottom: 2 }} />
      </span>
      {big && (
        <span aria-hidden className="pointer-events-none absolute" style={{ bottom: -6, [flip ? "left" : "right"]: -6 }}>
          <Bud palette={p} width={16} style={{ transform: `rotate(${flip ? -18 : 18}deg)` }} />
        </span>
      )}
    </span>
  );
}

export const GARDEN_MEDIA: SkinMedia = {
  Frame: GardenFrame,
  aspect: "aspect-[3/4]",
  note: (theme) => {
    const p = gardenPalette(theme);
    return {
      ...noteStyle(theme, { radius: 22, shadow: `0 14px 26px -20px ${withAlpha(p.roseDeep, 0.6)}` }),
      backgroundColor: p.dark ? withAlpha(theme.accent_color, 0.08) : p.white,
      border: `1.5px solid ${withAlpha(theme.accent_color, 0.55)}`,
    };
  },
  field: (theme, invalid) => fieldStyle(theme, invalid, { radius: 16, background: gardenPalette(theme).dark ? undefined : "#ffffff" }),
  button: (theme) => buttonStyle(theme),
};

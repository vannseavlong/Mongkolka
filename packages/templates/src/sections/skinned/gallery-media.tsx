"use client";

import type { CSSProperties, ReactNode } from "react";
import type { MediaFrameProps, SkinMedia, SkinOrnaments } from "../khmer/skin-ornament-types";
import { goldGradient, withAlpha } from "../../chrome/gold";
import { buttonStyle, fieldStyle, mediaTones, noteStyle } from "./gallery-tones";

/** The photo box every frame wraps: positioned, clipped, aspect set by the caller. */
export function PhotoBox({ aspect, className = "", style, children }: { aspect: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <span className={`relative block w-full overflow-hidden ${aspect} ${className}`.trim()} style={style}>
      {children}
    </span>
  );
}

/** Neutral gold double frame: used by any skin that does not supply its own `media`. */
function DefaultFrame({ theme, aspect, variant, children }: MediaFrameProps) {
  const t = mediaTones(theme);
  const pad = variant === "wall" ? 3 : 4;
  return (
    <span className="block rounded-xl p-[2px]" style={{ backgroundImage: goldGradient(theme.accent_color), boxShadow: `0 14px 26px -18px ${withAlpha(theme.accent_color, 0.7)}` }}>
      <span className="block rounded-[10px]" style={{ padding: pad, backgroundColor: t.dark ? theme.bg_color : "#ffffff" }}>
        <PhotoBox aspect={aspect ?? "aspect-[4/5]"} className="rounded-md" style={{ backgroundColor: withAlpha(theme.accent_color, 0.12) }}>
          {children}
        </PhotoBox>
      </span>
    </span>
  );
}

export const DEFAULT_MEDIA: SkinMedia = {
  Frame: DefaultFrame,
  aspect: "aspect-[4/5]",
  note: (theme) => noteStyle(theme),
  field: (theme, invalid) => fieldStyle(theme, invalid),
  button: (theme) => buttonStyle(theme),
};

/** The skin's media set, or the neutral one. */
export function mediaFor(sk: SkinOrnaments): SkinMedia {
  return sk.media ?? DEFAULT_MEDIA;
}

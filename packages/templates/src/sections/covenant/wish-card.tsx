"use client";

import type { CSSProperties } from "react";
import type { GuestbookPhoto, GuestbookWish, Theme } from "../../types";
import { MOUL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { useSkinOrnaments } from "../khmer/skin-context";
import { mediaFor } from "../skinned/gallery-media";
import { Blossom } from "./cross";
import { hasKhmer } from "./intro-logic";
import { PINK } from "./palette";

const SCRIPT = 'var(--font-script), "Great Vibes", cursive';

/** One guest wish as a card: a gold-edged white note with a blossom, the words, the guest's name in script, and their photo if they sent one. */
export function WishCard({ theme, wish, photo, index }: { theme: Theme; wish: GuestbookWish; photo?: GuestbookPhoto; index: number }) {
  const sk = useSkinOrnaments();
  const media = mediaFor(sk);
  const accent = theme.accent_color;
  const name = wish.name;
  const tilt: CSSProperties = { transform: `rotate(${((index % 3) - 1) * 0.6}deg)` };
  return (
    <figure className="cv-wish m-0" style={{ ...media.note(theme), ...tilt, borderColor: withAlpha(accent, 0.5) }}>
      <span aria-hidden className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" style={{ lineHeight: 0 }}>
        <svg width="34" height="34" viewBox="-17 -17 34 34">
          <circle r="15" fill="#ffffff" stroke={withAlpha(accent, 0.6)} strokeWidth="1" />
          <Blossom x={0} y={0} r={11} petal={PINK.petal} centre={accent} />
        </svg>
      </span>
      {photo && (
        <div className="mb-3">
          <media.Frame theme={theme} index={index} variant="wall" aspect="aspect-[4/5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
          </media.Frame>
        </div>
      )}
      {wish.message && (
        <blockquote className="m-0 whitespace-pre-line break-words text-[15px] leading-relaxed" style={{ overflowWrap: "anywhere" }}>
          {wish.message}
        </blockquote>
      )}
      <figcaption
        className="mt-3 break-words"
        style={{ color: accent, fontFamily: hasKhmer(name) ? MOUL_FONT : SCRIPT, fontSize: hasKhmer(name) ? "0.95rem" : "1.6rem", lineHeight: hasKhmer(name) ? 1.9 : 1.2 }}
      >
        {name}
      </figcaption>
    </figure>
  );
}

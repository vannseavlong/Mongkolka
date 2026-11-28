"use client";

import type { CSSProperties } from "react";
import type { GuestbookPhoto, GuestbookWish, Theme } from "../../types";
import { MOUL_FONT } from "../../chrome/fonts";
import { goldStops, withAlpha } from "../../chrome/gold";
import { hasKhmer } from "./intro-logic";
import { LazyImage } from "./lazy-image";
import { guestInitial } from "./wall-logic";

const SCRIPT = 'var(--font-script), "Great Vibes", cursive';

/**
 * One guest wish as a card: the guest's photo (if they sent one) on top, then a gold quote mark, the words, and a
 * signature row with the guest's initial in a gold seal and their name. Plain white card with a gold hairline, so it
 * reads on any template colour. Cards sit in columns, so they keep their own height.
 */
export function WishCard({ theme, wish, photo, index }: { theme: Theme; wish: GuestbookWish; photo?: GuestbookPhoto; index: number }) {
  const accent = theme.accent_color;
  const g = goldStops(accent);
  const khName = hasKhmer(wish.name);
  const seal: CSSProperties = { background: `linear-gradient(135deg, ${g.hi}, ${g.mid} 55%, ${g.lo})`, boxShadow: `0 0 0 3px ${withAlpha(accent, 0.15)}` };
  return (
    <figure
      className="cv-wish m-0 overflow-hidden text-left"
      style={{ backgroundColor: "#ffffff", color: "#3d2a31", borderRadius: 22, border: `1px solid ${withAlpha(accent, 0.35)}`, boxShadow: `0 18px 34px -24px ${withAlpha(accent, 0.8)}`, padding: 0 }}
    >
      {photo && <LazyImage zoom src={photo.url} alt="" tint={accent} ratio={index % 2 ? "4 / 3" : "1 / 1"} />}
      <div className="px-5 pb-5 pt-4">
        <span aria-hidden className="block select-none leading-none" style={{ color: withAlpha(accent, 0.5), fontFamily: "Georgia, serif", fontSize: 44, height: 28 }}>
          &ldquo;
        </span>
        {wish.message && (
          <blockquote className="m-0 whitespace-pre-line break-words text-[15px] leading-relaxed" style={{ overflowWrap: "anywhere" }}>
            {wish.message}
          </blockquote>
        )}
        <figcaption className="mt-4 flex items-center gap-3 border-t pt-3" style={{ borderColor: withAlpha(accent, 0.2) }}>
          <span className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold" style={{ ...seal, color: "#fff" }} aria-hidden>
            {guestInitial(wish.name)}
          </span>
          <span className="min-w-0 break-words" style={{ color: accent, fontFamily: khName ? MOUL_FONT : SCRIPT, fontSize: khName ? "0.9rem" : "1.45rem", lineHeight: khName ? 1.8 : 1.15 }}>
            {wish.name}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

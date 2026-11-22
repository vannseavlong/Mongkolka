"use client";

import type { CoupleInfo, HeroContent, Theme } from "../../types";
import type { SkinId } from "../skins";
import { useLanguage } from "../../i18n";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { KHMER_BODY_FONT } from "../../chrome/fonts";
import { monogramOf } from "./skin-logic";
import { useHeadingFont } from "./stub-parts";

export interface SkinHeroProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

/**
 * PLACEHOLDER hero shared by the six skins until each skin task replaces its own Hero.tsx: cover photo in
 * an arch (monogram when there is none), names, date. Skins add their frame, florals and ornaments.
 */
export function SkinHero({ skin, couple, theme, content }: SkinHeroProps & { skin: SkinId }) {
  const { t, language } = useLanguage();
  const headingFont = useHeadingFont();
  const date = formatWeddingDate(couple.weddingDate, language);
  const accent = theme.accent_color;
  const photo = content?.coverPhotoUrl;

  return (
    <section
      className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-6 py-16 text-center"
      style={{ backgroundColor: theme.bg_color, color: theme.text_color, fontFamily: KHMER_BODY_FONT }}
    >
      <div
        className="flex h-72 w-56 items-center justify-center overflow-hidden rounded-t-full"
        style={{ border: `2px solid ${accent}`, boxShadow: `0 0 0 5px ${theme.bg_color}, 0 0 0 6px ${accent}` }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="size-full object-cover" />
        ) : (
          <span aria-hidden className="text-4xl" style={{ fontFamily: headingFont, color: accent }}>
            {monogramOf(couple)}
          </span>
        )}
      </div>
      <p className="m-0 text-sm tracking-widest" style={{ color: accent, fontFamily: headingFont }}>
        {t(`${skin}.greeting`)}
      </p>
      <h2 className="m-0 text-3xl leading-snug">{formatCoupleNames(couple)}</h2>
      {date && <p className="m-0 text-base opacity-80">{date}</p>}
    </section>
  );
}

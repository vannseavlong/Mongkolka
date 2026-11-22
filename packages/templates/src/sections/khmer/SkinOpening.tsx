"use client";

import type { OpeningProps } from "../../types";
import type { SkinId } from "../skins";
import { useLanguage } from "../../i18n";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { goldGradient, withAlpha } from "../../chrome/gold";
import { KHMER_BODY_FONT } from "../../chrome/fonts";
import { monogramOf } from "./skin-logic";
import { GoldButton, useHeadingFont } from "./stub-parts";

/**
 * PLACEHOLDER cover gate shared by the six skins until each skin task replaces its own Opening.tsx:
 * themed ground, gold double frame, monogram, greeting, guest name, pill CTA. It is intentionally
 * plain; the ceremonial animation (doors, gate, envelope, light burst, storybook) is the skin's job.
 */
export function SkinOpening({ skin, couple, theme, guestGreeting, onOpen }: OpeningProps & { skin: SkinId }) {
  const { t, language } = useLanguage();
  const headingFont = useHeadingFont();
  const date = formatWeddingDate(couple.weddingDate, language);
  const accent = theme.accent_color;

  return (
    <div
      className="flex min-h-[100svh] items-center justify-center px-5 py-10"
      style={{ backgroundColor: theme.bg_color, color: theme.text_color, fontFamily: KHMER_BODY_FONT }}
    >
      <div
        className="flex w-full max-w-md flex-col items-center gap-5 rounded-[2rem] px-6 py-12 text-center"
        style={{ border: `1px solid ${accent}`, boxShadow: `0 0 0 6px ${theme.bg_color}, 0 0 0 7px ${withAlpha(accent, 0.6)}` }}
      >
        <div
          aria-hidden
          className="flex size-24 items-center justify-center rounded-full text-2xl"
          style={{ border: `1px solid ${accent}`, fontFamily: headingFont, color: accent }}
        >
          <span style={{ backgroundImage: goldGradient(accent), WebkitBackgroundClip: "text", color: "transparent" }}>
            {monogramOf(couple)}
          </span>
        </div>
        <p className="m-0 text-base leading-relaxed" style={{ fontFamily: headingFont, color: accent }}>
          {t(`${skin}.greeting`)}
        </p>
        {guestGreeting && (
          <p className="m-0 text-sm opacity-80">
            {t("khmer.dear")} {guestGreeting}
          </p>
        )}
        <h1 className="m-0 text-2xl leading-snug">{formatCoupleNames(couple)}</h1>
        {date && <p className="m-0 text-sm opacity-80">{date}</p>}
        <GoldButton theme={theme} onClick={onOpen}>
          {t(`${skin}.open`)}
        </GoldButton>
      </div>
    </div>
  );
}

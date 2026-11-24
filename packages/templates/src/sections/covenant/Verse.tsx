"use client";

import type { CSSProperties } from "react";
import type { VerseContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { KHMER_BODY_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { useSkinOrnaments } from "../khmer/skin-context";
import { COVENANT_CSS } from "./covenant-styles";
import { Cross } from "./cross";
import { covenantPalette } from "./palette";

export interface CovenantVerseProps {
  theme: Theme;
  content?: VerseContent;
}

/**
 * The Bible verse as a white card that rises over the bottom edge of the hero (it is pulled up by 56px, so the
 * hero's names sit above it) with a gold cross medallion on its top edge. Returns nothing when no verse is set.
 */
export function CovenantVerse({ theme, content }: CovenantVerseProps) {
  const { language } = useLanguage();
  const sk = useSkinOrnaments();
  const p = covenantPalette(theme);
  const kh = language === "kh";
  const text = (kh && content?.textKh?.trim()) || content?.text?.trim();
  if (!text) return null;
  const reference = content?.reference?.trim();
  const meaning = (kh && content?.meaningKh?.trim()) || content?.meaning?.trim();
  const vars = { "--cv-ground": theme.bg_color, fontFamily: KHMER_BODY_FONT, color: theme.text_color } as CSSProperties;

  return (
    <section id="verse" className="cv-verse" style={vars} data-mk-lang={language}>
      <style href="mk-covenant-css" precedence="mk-covenant">
        {COVENANT_CSS}
      </style>
      <div className="cv-verse-card" style={sk.surface(theme)}>
        <span
          aria-hidden
          className="absolute left-1/2 top-0 flex size-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ background: p.paper, border: `1.5px solid ${withAlpha(theme.accent_color, 0.7)}`, boxShadow: `0 0 0 5px ${withAlpha("#ffffff", 0.9)}, 0 10px 24px -10px ${withAlpha(theme.accent_color, 0.6)}` }}
        >
          <Cross color={theme.accent_color} size={46} />
        </span>
        <figure className="m-0">
          <blockquote
            className="m-0 whitespace-pre-line break-words text-xl leading-[1.75] sm:text-2xl"
            style={{ fontStyle: kh ? "normal" : "italic", fontFamily: kh ? KHMER_BODY_FONT : 'Georgia, "Times New Roman", serif', textWrap: "balance", overflowWrap: "anywhere" }}
          >
            {text}
          </blockquote>
          {reference && (
            <figcaption className="mt-6 text-sm font-medium" style={{ color: theme.accent_color, letterSpacing: kh ? undefined : "0.2em", textTransform: kh ? undefined : "uppercase" }}>
              <span aria-hidden className="mx-auto mb-3 block h-px w-14" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${theme.accent_color}, transparent)` }} />
              <cite className="not-italic">{reference}</cite>
            </figcaption>
          )}
          {meaning && (
            <p className="m-0 mt-4 text-sm leading-relaxed opacity-80" style={{ fontFamily: KHMER_BODY_FONT }}>
              {meaning}
            </p>
          )}
        </figure>
      </div>
    </section>
  );
}

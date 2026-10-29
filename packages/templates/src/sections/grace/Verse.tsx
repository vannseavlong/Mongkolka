"use client";

import { GraceSection, Cross, GoldDivider, Reveal, gracePalette, nameFont } from "./shared";
import { useLanguage } from "../../i18n";
import type { VerseContent, Theme } from "../../types";

export interface GraceVerseProps {
  theme: Theme;
  content?: VerseContent;
}

export function GraceVerse({ theme, content }: GraceVerseProps) {
  const { language } = useLanguage();
  const p = gracePalette(theme);
  const kh = language === "kh";
  const text = kh && content?.textKh ? content.textKh : content?.text;
  if (!text) return null;

  return (
    <GraceSection theme={theme} id="verse" maxWidth="max-w-2xl" className="text-center">
      <Reveal>
        <div
          aria-hidden
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full sm:h-32 sm:w-32"
          style={{
            border: `1px solid ${p.foilLight}`,
            boxShadow: `0 0 0 5px ${p.ground}, 0 0 0 6px ${p.foilLight}`,
            backgroundColor: p.card,
          }}
        >
          <Cross spray stroke={p.accent} className="h-[4.5rem] w-auto sm:h-20" strokeWidth={2} />
        </div>
        <GoldDivider theme={theme} className="mt-10" />
        <figure className="m-0 mt-10">
          <blockquote
            className="m-0 whitespace-pre-line break-words text-xl leading-[1.75] sm:text-2xl sm:leading-[1.7] [overflow-wrap:anywhere]"
            style={{
              fontFamily: nameFont("kh"),
              fontStyle: kh ? "normal" : "italic",
              textWrap: "balance",
              color: p.text,
            }}
          >
            {text}
          </blockquote>
          {content?.reference ? (
            <figcaption
              className="mt-8 break-words text-sm font-medium [overflow-wrap:anywhere]"
              style={{
                color: p.accent,
                letterSpacing: kh ? undefined : "0.2em",
                textTransform: kh ? undefined : "uppercase",
              }}
            >
              <span
                aria-hidden
                className="mx-auto mb-4 block h-px w-14"
                style={{ backgroundColor: p.accent, backgroundImage: `linear-gradient(90deg, transparent, ${p.foilLight}, transparent)` }}
              />
              <cite className="not-italic">{content.reference}</cite>
            </figcaption>
          ) : null}
        </figure>
      </Reveal>
    </GraceSection>
  );
}

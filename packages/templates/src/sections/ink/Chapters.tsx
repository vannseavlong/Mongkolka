"use client";

import { motion } from "motion/react";
import type { Theme, TimelineContent } from "../../types";
import { useLanguage } from "../../i18n";
import { Eyebrow, InkSection, LABEL_FONT, toRoman } from "./shared";

export interface TimelineChaptersProps {
  theme: Theme;
  content?: TimelineContent;
}

/** Giant outlined chapter numerals down an inverted page, with a gold line that draws on scroll. */
export function TimelineChapters({ theme, content }: TimelineChaptersProps) {
  const { t } = useLanguage();
  const chapters = content?.chapters ?? [];
  if (chapters.length === 0) return null;
  const foil = theme.accent_color;

  return (
    <InkSection theme={theme} inverted className="px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-20 text-center">
          <Eyebrow color={foil}>{t("ink.chapter")}</Eyebrow>
          <h2 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)] font-light italic">{t("section.timeline.heading")}</h2>
        </header>

        <div className="relative">
          <motion.div
            aria-hidden
            className="absolute bottom-0 left-4 top-0 w-px origin-top sm:left-1/2"
            style={{ backgroundColor: foil }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
          {chapters.map((chapter, i) => {
            const right = i % 2 === 1;
            return (
              <motion.article
                key={`${chapter.title}-${i}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className={`relative mb-20 pl-12 sm:mb-28 sm:w-1/2 sm:pl-0 ${
                  right ? "sm:ml-auto sm:pl-14 sm:text-left" : "sm:pr-14 sm:text-right"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute left-4 top-5 size-2.5 -translate-x-1/2 rotate-45 sm:top-8 ${
                    right ? "sm:left-0" : "sm:left-auto sm:right-0 sm:translate-x-1/2"
                  }`}
                  style={{ backgroundColor: foil }}
                />
                <span
                  aria-hidden
                  className="block text-[clamp(5rem,16vw,9rem)] font-light italic leading-[0.85]"
                  style={{ color: "transparent", WebkitTextStroke: `1px ${foil}` }}
                >
                  {toRoman(i + 1)}
                </span>
                <p className="mt-2 text-[11px] uppercase tracking-[0.4em]" style={{ color: foil, fontFamily: LABEL_FONT }}>
                  {chapter.year}
                </p>
                <h3 className="mt-3 text-3xl font-light sm:text-4xl">{chapter.title}</h3>
                <p className="mt-3 text-lg leading-relaxed opacity-80">{chapter.text}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </InkSection>
  );
}

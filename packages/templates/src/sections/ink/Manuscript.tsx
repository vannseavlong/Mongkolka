"use client";

import { motion } from "motion/react";
import type { StoryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { Eyebrow, InkSection, Ornament, mix } from "./shared";

export interface StoryManuscriptProps {
  theme: Theme;
  content?: StoryContent;
}

/** Two-column set text with a drop cap and an oversized folio numeral in the margin. */
export function StoryManuscript({ theme, content }: StoryManuscriptProps) {
  const { t } = useLanguage();
  const paragraphs = (content?.loveStory ?? "").split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return null;
  const foil = theme.accent_color;

  return (
    <InkSection theme={theme} className="px-6 py-28 sm:px-10">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-4 top-6 select-none text-[clamp(10rem,28vw,22rem)] font-light italic leading-none"
        style={{ color: "transparent", WebkitTextStroke: `1px ${mix(foil, 55)}` }}
      >
        I
      </span>
      <div className="relative mx-auto max-w-5xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center"
        >
          <Eyebrow color={foil}>— I —</Eyebrow>
          <h2 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)] font-light italic">{t("section.story.heading")}</h2>
          <Ornament color={foil} className="mt-6" />
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1 }}
          className="gap-12 text-[1.15rem] leading-[1.85] md:columns-2"
          style={{ columnRule: `1px solid ${mix(theme.text_color, 18)}` }}
        >
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`mb-5 break-inside-avoid-column ${
                i === 0
                  ? "first-letter:text-[color:var(--foil)] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[4.6rem] first-letter:font-light first-letter:italic first-letter:leading-[0.8]"
                  : ""
              }`}
              style={i === 0 ? ({ "--foil": foil } as React.CSSProperties) : undefined}
            >
              {p}
            </p>
          ))}
        </motion.div>
      </div>
    </InkSection>
  );
}

"use client";

import { motion } from "motion/react";
import type { StoryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { InkSection } from "../ink/shared";
import { KbachCorner, KbachDivider, KbachStrip, Lotus } from "./shared";

export interface StoryKbachProps {
  theme: Theme;
  content?: StoryContent;
}

/** A centered letter under a lotus, framed by corner ornaments, with a foil drop cap. */
export function StoryKbach({ theme, content }: StoryKbachProps) {
  const { t } = useLanguage();
  const paragraphs = (content?.loveStory ?? "").split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return null;
  const foil = theme.accent_color;

  return (
    <InkSection theme={theme} className="px-6 py-24 sm:px-10">
      <KbachCorner color={foil} className="absolute left-2 top-3 size-16 sm:left-5 sm:top-5 sm:size-24" />
      <KbachCorner color={foil} className="absolute right-2 top-3 size-16 -scale-x-100 sm:right-5 sm:top-5 sm:size-24" />

      <div className="mx-auto max-w-2xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col items-center gap-4 text-center"
        >
          <Lotus color={foil} className="h-12 w-20" />
          <h2 className="text-[clamp(2.4rem,7vw,4rem)] font-light italic">{t("section.story.heading")}</h2>
          <KbachDivider color={foil} />
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1 }}
          className="text-center text-[1.12rem] leading-[1.9]"
        >
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`mb-5 ${
                i === 0
                  ? "first-letter:text-[color:var(--foil)] first-letter:text-[3.4rem] first-letter:font-light first-letter:italic first-letter:leading-[0.9]"
                  : ""
              }`}
              style={i === 0 ? ({ "--foil": foil } as React.CSSProperties) : undefined}
            >
              {p}
            </p>
          ))}
        </motion.div>
        <div className="mt-14">
          <KbachStrip color={foil} />
        </div>
      </div>
    </InkSection>
  );
}

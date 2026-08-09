"use client";

import { motion } from "motion/react";
import type { StoryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";

export interface StorySplitProps {
  theme: Theme;
  content?: StoryContent;
}

/** A two-column split: a large decorative heading on one side, the story text on the other. */
export function StorySplit({ theme, content }: StorySplitProps) {
  const { t } = useLanguage();
  if (!content?.loveStory) return null;

  return (
    <section
      className="px-6 py-20"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-[1fr_2fr] sm:gap-12">
        <motion.h2
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-medium leading-tight sm:text-5xl"
          style={{ color: theme.accent_color }}
        >
          {t("section.story.heading")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="whitespace-pre-line text-lg leading-relaxed opacity-90"
        >
          {content.loveStory}
        </motion.p>
      </div>
    </section>
  );
}

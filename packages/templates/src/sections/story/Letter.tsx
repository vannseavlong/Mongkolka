"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";
import type { StoryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";

export interface StoryLetterProps {
  theme: Theme;
  content?: StoryContent;
}

/** The love story presented as a handwritten letter unfolding open. */
export function StoryLetter({ theme, content }: StoryLetterProps) {
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
      <motion.div
        initial={{ opacity: 0, rotateX: -12, y: -16 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ transformOrigin: "top center", transformPerspective: 1000 }}
        className="mx-auto max-w-xl rounded-sm p-8 shadow-lg sm:p-12"
      >
        <div
          className="rounded-sm border p-8 sm:p-10"
          style={{ borderColor: theme.accent_color }}
        >
          <Quote className="mx-auto mb-4 size-6" style={{ color: theme.accent_color }} />
          <h2 className="mb-6 text-center text-2xl font-medium" style={{ color: theme.accent_color }}>
            {t("section.story.heading")}
          </h2>
          <p className="whitespace-pre-line text-center italic leading-relaxed opacity-90">
            {content.loveStory}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

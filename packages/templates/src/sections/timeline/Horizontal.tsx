"use client";

import { motion } from "motion/react";
import type { Theme, TimelineContent } from "../../types";
import { useLanguage } from "../../i18n";

export interface TimelineHorizontalProps {
  theme: Theme;
  content?: TimelineContent;
}

/** Chapters as a horizontal, scrollable strip connected by a top rail, instead of a vertical stack. */
export function TimelineHorizontal({ theme, content }: TimelineHorizontalProps) {
  const { t } = useLanguage();
  const chapters = content?.chapters ?? [];
  if (chapters.length === 0) return null;

  return (
    <section
      className="py-20"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <h2 className="mb-12 px-6 text-center text-2xl font-medium" style={{ color: theme.accent_color }}>
        {t("section.timeline.heading")}
      </h2>
      <div className="flex gap-8 overflow-x-auto px-6 pb-4" style={{ scrollbarWidth: "none" }}>
        {chapters.map((chapter, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="flex w-56 shrink-0 flex-col gap-3"
          >
            <div
              className="h-px w-full"
              style={{ backgroundColor: theme.accent_color, opacity: 0.4 }}
            />
            <div
              className="-mt-[7px] size-3 rounded-full"
              style={{ backgroundColor: theme.accent_color }}
            />
            <p className="text-sm font-medium uppercase tracking-widest" style={{ color: theme.accent_color }}>
              {chapter.year}
            </p>
            <h3 className="font-medium">{chapter.title}</h3>
            <p className="opacity-80">{chapter.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

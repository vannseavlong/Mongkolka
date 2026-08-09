"use client";

import { motion } from "motion/react";
import type { Theme, TimelineContent } from "../../types";
import { useLanguage } from "../../i18n";

export interface TimelineVerticalLineProps {
  theme: Theme;
  content?: TimelineContent;
}

/** Chapters alternate left/right of a continuous center line, instead of a single left-aligned column. */
export function TimelineVerticalLine({ theme, content }: TimelineVerticalLineProps) {
  const { t } = useLanguage();
  const chapters = content?.chapters ?? [];
  if (chapters.length === 0) return null;

  return (
    <section
      className="px-6 py-20"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <h2 className="mb-12 text-center text-2xl font-medium" style={{ color: theme.accent_color }}>
        {t("section.timeline.heading")}
      </h2>
      <div className="relative mx-auto max-w-2xl">
        <div
          className="absolute inset-y-0 left-5 w-px sm:left-1/2 sm:-translate-x-1/2"
          style={{ backgroundColor: theme.accent_color, opacity: 0.4 }}
        />
        <div className="flex flex-col gap-10">
          {chapters.map((chapter, i) => {
            const onRight = i % 2 === 1;
            return (
              <div
                key={i}
                className={`relative flex items-start gap-6 pl-12 sm:pl-0 ${onRight ? "sm:flex-row" : "sm:flex-row-reverse"}`}
              >
                <div
                  className="absolute left-5 top-1.5 size-3 -translate-x-1/2 rounded-full sm:left-1/2"
                  style={{ backgroundColor: theme.accent_color }}
                />
                <div className="hidden sm:block sm:w-1/2" />
                <motion.div
                  initial={{ opacity: 0, x: onRight ? 24 : -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`sm:w-1/2 ${onRight ? "sm:pl-8 sm:text-left" : "sm:pr-8 sm:text-right"}`}
                >
                  <p
                    className="text-sm font-medium uppercase tracking-widest"
                    style={{ color: theme.accent_color }}
                  >
                    {chapter.year}
                  </p>
                  <h3 className="mt-1 font-medium">{chapter.title}</h3>
                  <p className="mt-1 opacity-80">{chapter.text}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

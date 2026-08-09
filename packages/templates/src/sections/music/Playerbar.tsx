"use client";

import { motion } from "motion/react";
import { Play } from "lucide-react";
import type { MusicContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";

export interface MusicPlayerbarProps {
  theme: Theme;
  content?: MusicContent;
}

/** A mock media-player bar (play button, track label, decorative bars) instead of a plain link. */
export function MusicPlayerbar({ theme, content }: MusicPlayerbarProps) {
  const { t } = useLanguage();
  if (!content?.playlistUrl) return null;

  return (
    <section
      className="px-6 py-20"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <h2 className="mb-6 text-center text-2xl font-medium" style={{ color: theme.accent_color }}>
        {t("section.music.heading")}
      </h2>
      <motion.a
        href={content.playlistUrl}
        target="_blank"
        rel="noreferrer"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto flex max-w-md items-center gap-4 rounded-full px-5 py-4 shadow-lg hover:opacity-90"
        style={{ backgroundColor: theme.accent_color, color: theme.bg_color }}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: theme.bg_color }}>
          <Play className="ml-0.5 size-4" style={{ color: theme.accent_color }} />
        </span>
        <span className="flex-1 truncate text-left font-medium">{t("section.music.listenAlong")}</span>
        <span className="flex items-end gap-0.5 pr-1" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="w-0.5 rounded-full"
              style={{ backgroundColor: theme.bg_color }}
              animate={{ height: ["30%", "100%", "30%"] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </span>
      </motion.a>
    </section>
  );
}

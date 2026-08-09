"use client";

import { motion } from "motion/react";
import { Music4 } from "lucide-react";
import type { MusicContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";

export interface MusicMinimalProps {
  theme: Theme;
  content?: MusicContent;
}

/** A single understated inline link, no card or icon badge. */
export function MusicMinimal({ theme, content }: MusicMinimalProps) {
  const { t } = useLanguage();
  if (!content?.playlistUrl) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className="px-6 py-16 text-center"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <a
        href={content.playlistUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest underline decoration-1 underline-offset-4 hover:opacity-70"
        style={{ color: theme.accent_color }}
      >
        <Music4 className="size-4" />
        {t("section.music.listenAlong")}
      </a>
    </motion.section>
  );
}

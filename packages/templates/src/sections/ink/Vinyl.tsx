"use client";

import { motion } from "motion/react";
import type { MusicContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { Eyebrow, InkSection, LABEL_FONT, mix } from "./shared";

export interface MusicVinylProps {
  theme: Theme;
  content?: MusicContent;
}

/** A slowly spinning record with gold label; the playlist link is the "play" button. */
export function MusicVinyl({ theme, content }: MusicVinylProps) {
  const { t } = useLanguage();
  if (!content?.playlistUrl) return null;
  const foil = theme.accent_color;

  return (
    <InkSection theme={theme} className="px-6 py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-12 sm:flex-row sm:justify-center sm:gap-16">
        <motion.div
          aria-hidden
          className="relative size-60 shrink-0 rounded-full shadow-2xl sm:size-72"
          style={{
            backgroundColor: theme.text_color,
            backgroundImage: `repeating-radial-gradient(circle at center, transparent 0 3px, ${mix(theme.bg_color, 10)} 3px 4px), conic-gradient(from 30deg, transparent, ${mix("#ffffff", 14)}, transparent 25%, transparent 50%, ${mix("#ffffff", 14)}, transparent 75%)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 7, ease: "linear", repeat: Infinity }}
        >
          <div
            className="absolute left-1/2 top-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center text-[9px] uppercase leading-tight tracking-[0.25em] sm:size-28"
            style={{ backgroundColor: foil, color: theme.text_color, fontFamily: LABEL_FONT }}
          >
            {t("section.music.heading")}
            <span
              className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: theme.bg_color }}
            />
          </div>
        </motion.div>

        <div className="text-center sm:text-left">
          <Eyebrow color={foil}>{t("ink.nowPlaying")}</Eyebrow>
          <h2 className="mt-4 text-[clamp(2.25rem,6vw,3.5rem)] font-light italic leading-tight">
            {t("section.music.heading")}
          </h2>
          <a
            href={content.playlistUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block px-7 py-4 text-xs uppercase tracking-[0.4em] transition hover:opacity-85"
            style={{ backgroundColor: theme.text_color, color: foil, fontFamily: LABEL_FONT }}
          >
            {t("section.music.listenAlong")}
          </a>
        </div>
      </div>
    </InkSection>
  );
}

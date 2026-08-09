"use client";

import { motion } from "motion/react";
import type { GalleryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";

export interface GalleryMasonryProps {
  theme: Theme;
  content?: GalleryContent;
}

/** A true CSS-columns masonry layout — photos keep their natural aspect ratio and
 * stack into whichever column is shortest, unlike Grid's uniform square tiles. */
export function GalleryMasonry({ theme, content }: GalleryMasonryProps) {
  const { t } = useLanguage();
  const photos = content?.photos ?? [];
  if (photos.length === 0) return null;

  return (
    <section
      className="px-6 py-20"
      style={{ backgroundColor: theme.bg_color, color: theme.text_color }}
    >
      <h2
        className="mb-8 text-center text-2xl font-medium"
        style={{
          color: theme.accent_color,
          fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
        }}
      >
        {t("section.gallery.heading")}
      </h2>
      <div className="mx-auto max-w-4xl columns-2 gap-3 sm:columns-3">
        {photos.map((url, i) => (
          <motion.img
            key={url}
            // Plain <img>, not next/image — see the note in sections/hero/Classic.tsx.
            src={url}
            alt=""
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
            className="mb-3 w-full break-inside-avoid rounded-md object-cover"
          />
        ))}
      </div>
    </section>
  );
}

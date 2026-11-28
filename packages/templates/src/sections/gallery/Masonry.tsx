"use client";

import { motion } from "motion/react";
import { themeFont } from "../../theme";
import type { GalleryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { zoomProps } from "../../photo-zoom";

export interface GalleryMasonryProps {
  theme: Theme;
  content?: GalleryContent;
  /** False for the 2nd and later layouts of a stacked gallery, so the heading shows once. */
  showHeading?: boolean;
}

/** A true CSS-columns masonry layout — photos keep their natural aspect ratio and
 * stack into whichever column is shortest, unlike Grid's uniform square tiles. */
export function GalleryMasonry({ theme, content, showHeading = true }: GalleryMasonryProps) {
  const { t } = useLanguage();
  const photos = content?.photos ?? [];
  if (photos.length === 0) return null;

  return (
    <section
      className={showHeading ? "px-6 py-20" : "px-6 pb-12"}
      style={{ backgroundColor: theme.bg_color, color: theme.text_color }}
    >
      {showHeading && (
        <h2
          className="mb-8 text-center text-2xl font-medium"
          style={{
            color: theme.accent_color,
            fontFamily: themeFont(theme),
          }}
        >
          {t("section.gallery.heading")}
        </h2>
      )}
      <div className="mx-auto max-w-4xl columns-2 gap-3 sm:columns-3">
        {photos.map((url, i) => (
          <motion.img
            {...zoomProps}
            key={url}
            // Plain <img>, not next/image — see the note in sections/hero/Classic.tsx.
            src={url}
            alt=""
            initial={{ opacity: 0, y: 28, scale: 0.88 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileTap={{ scale: 0.97 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 220, damping: 18, delay: (i % 6) * 0.07 }}
            className="mb-3 w-full break-inside-avoid rounded-md object-cover"
          />
        ))}
      </div>
    </section>
  );
}

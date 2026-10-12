"use client";

import { motion } from "motion/react";
import type { GalleryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { Eyebrow, InkSection, LABEL_FONT, mix, toRoman } from "./shared";

export interface GalleryPlatesProps {
  theme: Theme;
  content?: GalleryContent;
}

/** Numbered "plates" on an inverted ink page, staggered like a printed photo folio. */
export function GalleryPlates({ theme, content }: GalleryPlatesProps) {
  const { t } = useLanguage();
  const photos = content?.photos ?? [];
  if (photos.length === 0) return null;
  const foil = theme.accent_color;

  return (
    <InkSection theme={theme} inverted className="px-5 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-[clamp(2.5rem,7vw,4.5rem)] font-light italic">{t("section.gallery.heading")}</h2>
          <Eyebrow color={foil}>
            {photos.length} {t("ink.plate")}
          </Eyebrow>
        </header>

        <div className="grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-3">
          {photos.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.12, ease: "easeOut" }}
              className={i % 3 === 1 ? "md:translate-y-12" : i % 3 === 2 ? "md:translate-y-5" : ""}
            >
              <div className="group relative overflow-hidden p-2" style={{ border: `1px solid ${mix(foil, 70)}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${t("ink.plate")} ${toRoman(i + 1)}`}
                  className="aspect-[4/5] w-full object-cover grayscale-[35%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  loading="lazy"
                />
              </div>
              <figcaption
                className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.35em]"
                style={{ color: foil, fontFamily: LABEL_FONT }}
              >
                <span>
                  {t("ink.plate")} {toRoman(i + 1)}
                </span>
                <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </InkSection>
  );
}

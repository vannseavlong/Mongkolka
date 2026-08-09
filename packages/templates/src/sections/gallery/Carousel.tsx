"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";

export interface GalleryCarouselProps {
  theme: Theme;
  content?: GalleryContent;
}

/** A horizontal, scroll-snapped filmstrip of photos rather than a static grid. */
export function GalleryCarousel({ theme, content }: GalleryCarouselProps) {
  const { t } = useLanguage();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const photos = content?.photos ?? [];
  if (photos.length === 0) return null;

  const scrollByCard = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section
      className="py-20"
      style={{ backgroundColor: theme.bg_color, color: theme.text_color }}
    >
      <h2
        className="mb-8 px-6 text-center text-2xl font-medium"
        style={{
          color: theme.accent_color,
          fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
        }}
      >
        {t("section.gallery.heading")}
      </h2>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-4xl"
      >
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {photos.map((url) => (
            // Plain <img>, not next/image — see the note in sections/hero/Classic.tsx.
            <img
              key={url}
              src={url}
              alt=""
              className="aspect-[4/5] w-64 shrink-0 snap-center rounded-lg object-cover sm:w-80"
            />
          ))}
        </div>
        {photos.length > 1 && (
          <div className="mt-2 flex justify-center gap-3">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollByCard(-1)}
              className="rounded-full border p-2"
              style={{ borderColor: theme.accent_color, color: theme.accent_color }}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollByCard(1)}
              className="rounded-full border p-2"
              style={{ borderColor: theme.accent_color, color: theme.accent_color }}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
}

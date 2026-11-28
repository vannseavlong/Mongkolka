"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { themeFont } from "../../theme";
import type { GalleryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { zoomProps } from "../../photo-zoom";
import { DECK_DEPTH, DECK_SWIPE_PX, deckOffset, deckPose } from "./deck";

export interface GalleryCarouselProps {
  theme: Theme;
  content?: GalleryContent;
  /** False for the 2nd and later layouts of a stacked gallery, so the heading shows once. */
  showHeading?: boolean;
}

/**
 * A stacked deck: the front photo is large, its neighbours peek out from behind, and moving on makes the next one spring
 * forward. Swipe or use the arrows; tap the front photo for the full-screen viewer.
 */
export function GalleryCarousel({ theme, content, showHeading = true }: GalleryCarouselProps) {
  const { t } = useLanguage();
  const still = useReducedMotion();
  const [front, setFront] = useState(0);
  const start = useRef<number | null>(null);
  const swiped = useRef(false);
  const photos = content?.photos ?? [];
  if (photos.length === 0) return null;

  const current = Math.min(front, photos.length - 1);
  const step = (dir: 1 | -1) => setFront((current + dir + photos.length) % photos.length);

  return (
    <section
      className={showHeading ? "overflow-hidden py-20" : "overflow-hidden pb-12"}
      style={{ backgroundColor: theme.bg_color, color: theme.text_color }}
    >
      {showHeading && (
        <h2
          className="mb-8 px-6 text-center text-2xl font-medium"
          style={{
            color: theme.accent_color,
            fontFamily: themeFont(theme),
          }}
        >
          {t("section.gallery.heading")}
        </h2>
      )}
      <div className="relative mx-auto max-w-4xl">
        <div
          className="relative mx-auto aspect-[4/5] w-[68%] max-w-80 select-none"
          style={{ touchAction: "pan-y" }}
          onPointerDown={(e) => {
            start.current = e.clientX;
            swiped.current = false;
          }}
          onPointerUp={(e) => {
            const dx = start.current === null ? 0 : e.clientX - start.current;
            start.current = null;
            if (photos.length > 1 && Math.abs(dx) >= DECK_SWIPE_PX) {
              swiped.current = true;
              step(dx < 0 ? 1 : -1);
            }
          }}
          onPointerCancel={() => (start.current = null)}
        >
          {photos.map((url, i) => {
            const offset = deckOffset(i, current, photos.length);
            const { zIndex, ...pose } = deckPose(offset);
            return (
              <motion.div
                key={url}
                className="absolute inset-0 overflow-hidden rounded-2xl shadow-xl"
                initial={false}
                animate={pose}
                transition={still ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 19, mass: 0.8 }}
                style={{ zIndex, visibility: Math.abs(offset) > DECK_DEPTH ? "hidden" : "visible", border: `3px solid ${theme.bg_color}` }}
                // A swipe, or a tap on a card behind, moves the deck instead of opening the viewer.
                onClick={(e) => {
                  if (swiped.current || offset !== 0) e.preventDefault();
                  if (!swiped.current && offset !== 0) setFront(i);
                }}
              >
                {/* Plain <img>, not next/image — see the note in sections/hero/Classic.tsx. */}
                <img {...zoomProps} tabIndex={offset === 0 ? 0 : -1} src={url} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover" />
              </motion.div>
            );
          })}
        </div>
        {photos.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => step(-1)}
              className="grid size-11 place-items-center rounded-full border transition-transform active:scale-90"
              style={{ borderColor: theme.accent_color, color: theme.accent_color }}
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-14 text-center text-sm tabular-nums" aria-live="polite">
              {current + 1} / {photos.length}
            </span>
            <button
              type="button"
              aria-label="Next"
              onClick={() => step(1)}
              className="grid size-11 place-items-center rounded-full border transition-transform active:scale-90"
              style={{ borderColor: theme.accent_color, color: theme.accent_color }}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

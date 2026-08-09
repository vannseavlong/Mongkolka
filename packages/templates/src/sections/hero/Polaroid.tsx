"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { formatCoupleNames, formatWeddingDate } from "../../format";

export interface HeroPolaroidProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

/** A single tilted polaroid-style photo with a handwritten-feel caption beneath it. */
export function HeroPolaroid({ couple, theme, content }: HeroPolaroidProps) {
  const date = formatWeddingDate(couple.weddingDate);

  return (
    <section
      className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-6 py-24 text-center"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -4 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-64 rounded-sm p-3 pb-8 shadow-xl sm:w-72"
        style={{ backgroundColor: theme.bg_color, border: `1px solid ${theme.accent_color}` }}
      >
        {content?.coverPhotoUrl ? (
          // Plain <img>, not next/image: this package is framework-agnostic and the
          // consuming Next.js app's own eslint-config-next only lints its own code.
          <img
            src={content.coverPhotoUrl}
            alt={formatCoupleNames(couple)}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div
            className="flex aspect-square w-full items-center justify-center"
            style={{ backgroundColor: theme.accent_color, opacity: 0.25 }}
          >
            <Heart className="size-10" style={{ color: theme.text_color }} />
          </div>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col items-center gap-2"
      >
        <h1 className="text-3xl font-medium tracking-wide sm:text-4xl">{formatCoupleNames(couple)}</h1>
        {date && <p className="text-base opacity-80">{date}</p>}
      </motion.div>
    </section>
  );
}

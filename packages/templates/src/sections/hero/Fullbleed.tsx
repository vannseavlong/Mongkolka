"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { formatCoupleNames, formatWeddingDate } from "../../format";

export interface HeroFullbleedProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

/** Full-bleed cover photo with the names/date overlaid at the bottom behind a scrim. */
export function HeroFullbleed({ couple, theme, content }: HeroFullbleedProps) {
  const date = formatWeddingDate(couple.weddingDate);
  const fontFamily = theme.font_style === "serif" ? "serif" : "sans-serif";

  if (!content?.coverPhotoUrl) {
    // Graceful degrade: no photo yet, so render the same content centered on a
    // plain theme-colored field instead of an empty/broken full-bleed section.
    return (
      <section
        className="flex min-h-[90vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center"
        style={{ backgroundColor: theme.bg_color, color: theme.text_color, fontFamily }}
      >
        <Heart className="size-8" style={{ color: theme.accent_color }} />
        <h1 className="text-4xl font-medium tracking-wide sm:text-5xl">{formatCoupleNames(couple)}</h1>
        {date && <p className="text-lg opacity-80">{date}</p>}
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[90vh] items-end justify-center overflow-hidden" style={{ fontFamily }}>
      {/* Plain <img>, not next/image — see the note in sections/hero/Classic.tsx. */}
      <img
        src={content.coverPhotoUrl}
        alt={formatCoupleNames(couple)}
        className="absolute inset-0 size-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${theme.bg_color} 0%, transparent 55%)`,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-3 px-6 pb-16 text-center"
        style={{ color: theme.text_color }}
      >
        <h1 className="text-4xl font-medium tracking-wide drop-shadow-sm sm:text-5xl">
          {formatCoupleNames(couple)}
        </h1>
        {date && <p className="text-lg opacity-90 drop-shadow-sm">{date}</p>}
      </motion.div>
    </section>
  );
}

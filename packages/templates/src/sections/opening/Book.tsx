"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BookHeart } from "lucide-react";
import type { OpeningProps } from "../../types";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { useLanguage } from "../../i18n";

export function Book({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const [opening, setOpening] = useState(false);
  const date = formatWeddingDate(couple.weddingDate);
  const { t } = useLanguage();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: theme.text_color, perspective: 2000 }}
      role="button"
      tabIndex={0}
      onClick={() => !opening && setOpening(true)}
      onKeyDown={(e) => {
        if (!opening && (e.key === "Enter" || e.key === " ")) setOpening(true);
      }}
    >
      <motion.div
        className="absolute inset-0 border-r-4"
        style={{
          backgroundColor: theme.accent_color,
          borderColor: theme.bg_color,
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          boxShadow: "inset -12px 0 24px rgba(0,0,0,0.25)",
        }}
        animate={{ rotateY: opening ? -165 : 0 }}
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
        onAnimationComplete={() => opening && onOpen()}
      >
        <motion.div
          className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center"
          style={{
            color: theme.bg_color,
            fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
            backfaceVisibility: "hidden",
          }}
          animate={{ opacity: opening ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <BookHeart className="size-9" />
          {guestGreeting && (
            <p className="text-sm opacity-90">
              {t("opening.dear")} {guestGreeting},
            </p>
          )}
          <h1 className="text-3xl font-medium tracking-wide">{formatCoupleNames(couple)}</h1>
          {date && <p className="text-sm opacity-90">{date}</p>}
          <p className="mt-6 animate-pulse text-xs uppercase tracking-widest opacity-75">
            {t("opening.tapToOpenStory")}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

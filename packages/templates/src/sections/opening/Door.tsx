"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import type { OpeningProps } from "../../types";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { useLanguage } from "../../i18n";

export function Door({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const [opening, setOpening] = useState(false);
  const date = formatWeddingDate(couple.weddingDate);
  const { t } = useLanguage();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: theme.text_color, perspective: 1600 }}
      role="button"
      tabIndex={0}
      onClick={() => !opening && setOpening(true)}
      onKeyDown={(e) => {
        if (!opening && (e.key === "Enter" || e.key === " ")) setOpening(true);
      }}
    >
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 border-r"
        style={{
          backgroundColor: theme.bg_color,
          borderColor: theme.accent_color,
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: opening ? -100 : 0 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        onAnimationComplete={() => opening && onOpen()}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 border-l"
        style={{
          backgroundColor: theme.bg_color,
          borderColor: theme.accent_color,
          transformOrigin: "right center",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: opening ? 100 : 0 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4 px-6 text-center"
        style={{ color: theme.accent_color, fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif" }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <Heart className="size-8" />
        {guestGreeting && (
          <p className="text-sm opacity-90">
            {t("opening.dear")} {guestGreeting},
          </p>
        )}
        <h1 className="text-3xl font-medium tracking-wide">{formatCoupleNames(couple)}</h1>
        {date && <p className="text-sm opacity-90">{date}</p>}
        <p className="mt-6 animate-pulse text-xs uppercase tracking-widest opacity-75">
          {t("opening.tapToEnter")}
        </p>
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail } from "lucide-react";
import type { OpeningProps } from "../../types";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { useLanguage } from "../../i18n";

export function Envelope({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const [flapOpen, setFlapOpen] = useState(false);
  const [cardRising, setCardRising] = useState(false);
  const date = formatWeddingDate(couple.weddingDate);
  const { t } = useLanguage();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: theme.bg_color, perspective: 1400 }}
    >
      <div className="relative flex h-64 w-full max-w-sm items-end justify-center sm:h-72">
        {/* pocket */}
        <div
          className="absolute inset-x-0 bottom-0 h-full rounded-b-md"
          style={{ backgroundColor: theme.accent_color }}
        />

        {/* card */}
        <motion.div
          className="absolute inset-x-4 bottom-4 top-10 flex flex-col items-center justify-center gap-3 rounded-sm px-4 text-center shadow-lg"
          style={{
            backgroundColor: theme.bg_color,
            color: theme.text_color,
            fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
          }}
          initial={{ y: 24, opacity: 0 }}
          animate={
            cardRising
              ? { y: "-70vh", scale: 1.4, opacity: 1 }
              : flapOpen
                ? { y: 0, opacity: 1 }
                : { y: 24, opacity: 0 }
          }
          transition={{ duration: cardRising ? 0.9 : 0.5, ease: "easeInOut" }}
          onAnimationComplete={() => {
            if (cardRising) onOpen();
          }}
        >
          <Mail className="size-6" style={{ color: theme.accent_color }} />
          {guestGreeting && (
            <p className="text-xs opacity-80">
              {t("opening.dear")} {guestGreeting},
            </p>
          )}
          <p className="text-xl font-medium tracking-wide">{formatCoupleNames(couple)}</p>
          {date && <p className="text-xs opacity-80">{date}</p>}
        </motion.div>

        {/* flap */}
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2 origin-top"
          style={{
            backgroundColor: theme.accent_color,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }}
          animate={{ rotateX: flapOpen ? 160 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />

        {!flapOpen && (
          <button
            type="button"
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 animate-pulse text-xs uppercase tracking-widest"
            style={{ color: theme.text_color }}
            onClick={() => setFlapOpen(true)}
          >
            {t("opening.tapToOpen")}
          </button>
        )}
        {flapOpen && !cardRising && (
          <button
            type="button"
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 animate-pulse text-xs uppercase tracking-widest"
            style={{ color: theme.text_color }}
            onClick={() => setCardRising(true)}
          >
            {t("opening.tapTheCard")}
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { OpeningProps } from "../../types";
import { formatWeddingDate } from "../../format";
import { useLanguage } from "../../i18n";
import { DISPLAY_FONT, Eyebrow, Grain, LABEL_FONT, Ornament, mix } from "./shared";

/**
 * A wax-seal gate: the invitation is sealed shut; breaking the seal splits it in
 * two, the frame lines draw out, and the whole cover lifts away like a page.
 */
export function Seal({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const { t } = useLanguage();
  const [breaking, setBreaking] = useState(false);
  const [lifted, setLifted] = useState(false);
  const date = formatWeddingDate(couple.weddingDate);
  const initials = [couple.partner1Name, couple.partner2Name]
    .filter(Boolean)
    .map((n) => (n as string).trim().charAt(0).toUpperCase())
    .join("");

  useEffect(() => {
    if (!breaking) return;
    const timer = setTimeout(() => setLifted(true), 950);
    return () => clearTimeout(timer);
  }, [breaking]);

  const paper = theme.bg_color;
  const foil = theme.accent_color;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6"
      style={{ backgroundColor: theme.text_color, color: paper, fontFamily: DISPLAY_FONT }}
      animate={{ y: lifted ? "-100%" : 0 }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (lifted) onOpen();
      }}
    >
      <Grain opacity={0.18} />

      {/* double hairline frame that draws itself in */}
      <motion.div
        aria-hidden
        className="absolute inset-4 sm:inset-8"
        style={{ border: `1px solid ${foil}` }}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <div aria-hidden className="absolute inset-6 sm:inset-10" style={{ border: `1px solid ${mix(foil, 40)}` }} />

      <div className="relative flex max-w-xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col items-center gap-5"
        >
          <Eyebrow color={foil}>{t("ink.together")}</Eyebrow>
          {guestGreeting && (
            <p className="text-sm italic opacity-80">
              {t("opening.dear")} {guestGreeting},
            </p>
          )}
          <h1 className="text-[clamp(2.75rem,10vw,5.5rem)] font-light leading-[0.95] tracking-tight">
            {couple.partner1Name}
            {couple.partner2Name && (
              <>
                <span className="my-1 block text-[0.5em] italic" style={{ color: foil }}>
                  &amp;
                </span>
                {couple.partner2Name}
              </>
            )}
          </h1>
          <Ornament color={foil} />
          {date && (
            <p className="text-sm uppercase tracking-[0.35em] opacity-80" style={{ fontFamily: LABEL_FONT }}>
              {date}
            </p>
          )}
        </motion.div>

        {/* the seal */}
        <motion.button
          type="button"
          aria-label={t("ink.breakSeal")}
          onClick={() => setBreaking(true)}
          disabled={breaking}
          className="relative mt-12 size-28 cursor-pointer outline-none"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 140, damping: 14 }}
          whileHover={{ scale: breaking ? 1 : 1.06 }}
        >
          {(["left", "right"] as const).map((side) => (
            <motion.span
              key={side}
              className="absolute inset-0 flex items-center justify-center rounded-full text-3xl italic shadow-xl"
              style={{
                backgroundImage: `radial-gradient(circle at 32% 28%, ${mix("#ffffff", 55)}, transparent 40%), radial-gradient(circle, ${foil}, ${mix(foil, 70)})`,
                color: theme.text_color,
                clipPath: side === "left" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
              }}
              animate={
                breaking
                  ? { x: side === "left" ? -46 : 46, rotate: side === "left" ? -24 : 24, opacity: 0 }
                  : { x: 0, rotate: 0, opacity: 1 }
              }
              transition={{ duration: 0.8, ease: "easeIn" }}
            >
              {initials}
            </motion.span>
          ))}
          {!breaking && (
            <span
              aria-hidden
              className="absolute inset-2 rounded-full"
              style={{ border: `1px dashed ${mix(theme.text_color, 55)}` }}
            />
          )}
        </motion.button>
        <motion.p
          className="mt-5 animate-pulse text-[11px] uppercase tracking-[0.4em]"
          style={{ color: foil, fontFamily: LABEL_FONT }}
          initial={{ opacity: 0 }}
          animate={{ opacity: breaking ? 0 : 1 }}
          transition={{ delay: breaking ? 0 : 1.3 }}
        >
          {t("ink.breakSeal")}
        </motion.p>
      </div>
    </motion.div>
  );
}

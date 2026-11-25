"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { hasKhmer } from "../covenant/intro-logic";
import { KHMER_DISPLAY_FONT, SCRIPT_FONT, useHeroText } from "./hero-text";

export interface HeroCinematicProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

const rise = (delay: number, reduce: boolean) => ({
  initial: reduce ? false : { opacity: 0, y: 22, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/**
 * Cinematic: a full-screen banner that slowly drifts closer, a soft dark veil, and the names set large in
 * the middle. Names and date fade in one after the other; a thin line and a scroll cue finish it.
 */
export function HeroCinematic({ couple, theme, content }: HeroCinematicProps) {
  const { first, second, date, kh } = useHeroText(couple);
  const reduce = useReducedMotion() ?? false;
  const photo = content?.coverPhotoUrl;
  const face = (n: string) => (hasKhmer(n) ? KHMER_DISPLAY_FONT : SCRIPT_FONT);

  return (
    <section className="relative flex min-h-[100svh] items-end justify-center overflow-hidden text-center landscape:justify-start landscape:text-left" style={{ backgroundColor: theme.bg_color }}>
      {photo ? (
        <motion.img
          src={photo}
          alt=""
          className="absolute inset-0 size-full object-cover"
          initial={{ scale: 1 }}
          animate={reduce ? undefined : { scale: 1.12 }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: `radial-gradient(80% 70% at 50% 40%, ${theme.bg_color}, ${theme.accent_color}33)` }} />
      )}
      {photo && <div aria-hidden className="absolute inset-0 hidden landscape:block" style={{ background: "linear-gradient(90deg, rgba(0,0,0,.66), rgba(0,0,0,.28) 45%, rgba(0,0,0,0) 70%)" }} />}
      {photo && <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.16) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,.18) 55%, rgba(0,0,0,.78) 100%)" }} />}

      <div className="relative z-10 flex flex-col items-center gap-4 px-6 pb-[clamp(120px,24svh,220px)] landscape:items-start landscape:pb-[clamp(80px,20svh,170px)] landscape:pl-[6vw]" style={{ color: photo ? "#ffffff" : theme.text_color }}>
        <motion.span {...rise(0.2, reduce)} className="h-px w-16" style={{ backgroundColor: theme.accent_color }} />
        <motion.h1 {...rise(0.5, reduce)} className="m-0 flex flex-wrap items-baseline justify-center gap-x-3 leading-none landscape:justify-start" style={{ textShadow: photo ? "0 2px 22px rgba(0,0,0,.55)" : undefined }}>
          <span style={{ fontFamily: face(first), fontSize: hasKhmer(first) ? "clamp(1.8rem,7vw,3.5rem)" : "clamp(3.2rem,13vw,6.6rem)", lineHeight: hasKhmer(first) ? 1.8 : 1.05 }}>{first}</span>
          {second && (
            <>
              <span style={{ fontFamily: SCRIPT_FONT, fontSize: "clamp(1.8rem,6.4vw,3.2rem)", color: theme.accent_color }}>
                &amp;
              </span>
              <span style={{ fontFamily: face(second), fontSize: hasKhmer(second) ? "clamp(1.8rem,7vw,3.5rem)" : "clamp(3.2rem,13vw,6.6rem)", lineHeight: hasKhmer(second) ? 1.8 : 1.05 }}>{second}</span>
            </>
          )}
        </motion.h1>
        {date && (
          <motion.p {...rise(1.1, reduce)} className="m-0 uppercase" style={{ letterSpacing: kh ? "0.05em" : "0.32em", fontSize: "clamp(.9rem,3vw,1.25rem)" }}>
            {date}
          </motion.p>
        )}
      </div>

      <motion.span
        aria-hidden
        className="absolute bottom-7 left-1/2 z-10 h-10 w-px -translate-x-1/2 origin-top"
        style={{ backgroundColor: photo ? "#ffffff" : theme.text_color, opacity: 0.7 }}
        initial={reduce ? false : { scaleY: 0 }}
        animate={reduce ? undefined : { scaleY: [0, 1, 1], opacity: [0, 0.8, 0] }}
        transition={{ duration: 2.4, delay: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
}

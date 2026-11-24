"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { hasKhmer } from "../covenant/intro-logic";
import { KHMER_DISPLAY_FONT, SCRIPT_FONT, useHeroText } from "./hero-text";

export interface HeroFramedProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

/**
 * Framed: the photo inside a double gold frame on a soft ground, names in script across its lower edge, and the
 * date between two small diamonds. The frame fades in and settles, then the photo and names follow.
 */
export function HeroFramed({ couple, theme, content }: HeroFramedProps) {
  const { first, second, date, kh } = useHeroText(couple);
  const reduce = useReducedMotion() ?? false;
  const photo = content?.coverPhotoUrl;
  const face = (n: string) => (hasKhmer(n) ? KHMER_DISPLAY_FONT : SCRIPT_FONT);

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-10" style={{ backgroundColor: theme.bg_color, color: theme.text_color }}>
      <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(70% 60% at 50% 45%, #ffffff66, transparent 70%)` }} />

      <div className="relative w-full max-w-xl">
        {[0, 1].map((n) => (
          <motion.div
            key={n}
            aria-hidden
            className="pointer-events-none absolute z-20 border"
            style={{ inset: n ? "-1.4rem" : "-0.8rem", borderColor: theme.accent_color, opacity: n ? 0.55 : 1 }}
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: n ? 0.55 : 1, scale: 1 }}
            transition={{ duration: 1.8, delay: n * 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        <motion.div
          className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4]"
          style={{ backgroundColor: `${theme.accent_color}22` }}
          initial={reduce ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {photo && <img src={photo} alt="" className="size-full object-cover" />}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/5" style={{ background: "linear-gradient(180deg, transparent, rgba(0,0,0,.55))" }} />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 px-4 pb-6 text-center text-white">
            <motion.h1
              className="m-0 flex flex-wrap items-center justify-center gap-x-3 leading-none"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,.5)" }}
              initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.4, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span style={{ fontFamily: face(first), fontSize: hasKhmer(first) ? "clamp(1.4rem,6vw,2.2rem)" : "clamp(2.6rem,11vw,4.6rem)", lineHeight: hasKhmer(first) ? 1.8 : 1.1 }}>{first}</span>
              {second && (
                <>
                  <span style={{ fontFamily: SCRIPT_FONT, fontSize: "clamp(1.4rem,5vw,2.2rem)", color: theme.accent_color }}>&amp;</span>
                  <span style={{ fontFamily: face(second), fontSize: hasKhmer(second) ? "clamp(1.4rem,6vw,2.2rem)" : "clamp(2.6rem,11vw,4.6rem)", lineHeight: hasKhmer(second) ? 1.8 : 1.1 }}>{second}</span>
                </>
              )}
            </motion.h1>
            {date && (
              <motion.p
                className="m-0 flex items-center gap-3 uppercase"
                style={{ letterSpacing: kh ? "0.05em" : "0.26em", fontSize: "clamp(.75rem,2.4vw,.95rem)" }}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 0.95 }}
                transition={{ duration: 1.2, delay: 1.8 }}
              >
                <i aria-hidden className="size-1.5 rotate-45" style={{ backgroundColor: theme.accent_color }} />
                {date}
                <i aria-hidden className="size-1.5 rotate-45" style={{ backgroundColor: theme.accent_color }} />
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

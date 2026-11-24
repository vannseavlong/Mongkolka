"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { hasKhmer } from "../covenant/intro-logic";
import { KHMER_DISPLAY_FONT, SCRIPT_FONT, useHeroText } from "./hero-text";

export interface HeroEditorialProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

/**
 * Editorial: a magazine-style split. On a wide screen the names sit on the left and a tall arched photo on the
 * right; on a phone the arch comes first and the names below. The arch rises into place and the names write in.
 */
export function HeroEditorial({ couple, theme, content }: HeroEditorialProps) {
  const { first, second, date, kh } = useHeroText(couple);
  const reduce = useReducedMotion() ?? false;
  const photo = content?.coverPhotoUrl;
  const face = (n: string) => (hasKhmer(n) ? KHMER_DISPLAY_FONT : SCRIPT_FONT);
  const size = (n: string) => (hasKhmer(n) ? "clamp(1.6rem,6vw,3rem)" : "clamp(3rem,11vw,6.5rem)");

  return (
    <section
      className="relative grid min-h-[100svh] grid-cols-1 items-center gap-8 overflow-hidden px-6 py-14 md:grid-cols-2 md:gap-4 md:px-14"
      style={{ backgroundColor: theme.bg_color, color: theme.text_color }}
    >
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: theme.accent_color }} />

      <motion.div
        className="relative mx-auto w-full max-w-sm md:order-2 md:max-w-[min(28rem,58svh)]"
        initial={reduce ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div aria-hidden className="absolute -inset-3 rounded-t-full border" style={{ borderColor: theme.accent_color, opacity: 0.6, borderRadius: "999px 999px 16px 16px" }} />
        <div className="relative aspect-[3/4] w-full overflow-hidden shadow-2xl" style={{ borderRadius: "999px 999px 12px 12px", backgroundColor: `${theme.accent_color}22` }}>
          {photo && <img src={photo} alt="" className="size-full object-cover" />}
        </div>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center gap-4 text-center md:order-1 md:items-start md:text-left">
        <motion.p
          className="m-0 uppercase"
          style={{ color: theme.accent_color, letterSpacing: kh ? "0.05em" : "0.4em", fontSize: ".8rem" }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {kh ? "អាពាហ៍ពិពាហ៍" : "The wedding of"}
        </motion.p>
        <motion.h1
          className="m-0 flex flex-col items-center leading-none md:items-start"
          initial={reduce ? false : { opacity: 0, x: -30, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span style={{ fontFamily: face(first), fontSize: size(first), lineHeight: hasKhmer(first) ? 1.8 : 1.05 }}>{first}</span>
          {second && (
            <>
              <span style={{ fontFamily: SCRIPT_FONT, fontSize: "clamp(1.6rem,5vw,2.6rem)", color: theme.accent_color }}>&amp;</span>
              <span style={{ fontFamily: face(second), fontSize: size(second), lineHeight: hasKhmer(second) ? 1.8 : 1.05 }}>{second}</span>
            </>
          )}
        </motion.h1>
        {date && (
          <motion.div
            className="flex items-center gap-3"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.3 }}
          >
            <span className="h-px w-10" style={{ backgroundColor: theme.accent_color }} />
            <span className="uppercase" style={{ letterSpacing: kh ? "0.05em" : "0.28em", fontSize: "clamp(.8rem,2.4vw,1rem)" }}>
              {date}
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}

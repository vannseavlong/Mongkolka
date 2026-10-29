"use client";

import { motion, useReducedMotion } from "motion/react";
import { GraceSection, Cross, GoldDivider, FoilText, ArchFrame, Petals, gracePalette, nameFont, initialsOf } from "./shared";
import { useLanguage } from "../../i18n";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { formatCoupleNames, formatWeddingDate } from "../../format";

export interface GraceHeroProps {
  couple?: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

/** First screen after the gate: couple photo in the gold arch, names in script, date, scroll cue. */
export function GraceHero({ couple, theme, content }: GraceHeroProps) {
  const { t, language } = useLanguage();
  const reduce = useReducedMotion();
  const p = gracePalette(theme);
  const kh = language === "kh";
  const names = couple?.partner1Name ? formatCoupleNames(couple) : "";
  const date = formatWeddingDate(couple?.weddingDate, language);
  const monogram = couple?.partner1Name
    ? [couple.partner1Name, couple.partner2Name].map((n) => initialsOf(n, 1)).filter(Boolean).join(" & ")
    : "";
  const nameStyle = {
    fontFamily: nameFont(language),
    color: p.text,
    fontSize: kh ? "clamp(1.7rem, min(8vw, 5.5svh), 3rem)" : "clamp(2.4rem, min(11vw, 7.5svh), 4.75rem)",
    lineHeight: kh ? 1.5 : 1.1,
  };

  return (
    <GraceSection theme={theme} id="hero" className="flex min-h-[100svh] items-center !py-8 text-center sm:!py-10" maxWidth="max-w-2xl">
      <Petals theme={theme} className="-z-10" />
      <div className="flex flex-col items-center">
        <Cross stroke={p.accent} className="h-9 w-auto" strokeWidth={3} />
        <ArchFrame
          theme={theme}
          src={content?.coverPhotoUrl}
          alt={names}
          initials={monogram}
          position="center 30%"
          priority
          className="mt-3 !max-w-[min(16rem,calc(36svh*0.75))] sm:!max-w-[min(19rem,calc(36svh*0.75))]"
        />
        <p className="mt-6 text-sm" style={{ color: p.accent, letterSpacing: kh ? undefined : "0.18em", textTransform: kh ? undefined : "uppercase" }}>
          {t("grace.hero.together")}
        </p>
        {names ? (
          <h1 className="mt-2 flex w-full flex-wrap items-baseline justify-center gap-x-[0.3em] break-words" aria-label={names} style={nameStyle}>
            <span className="break-words">{couple?.partner1Name}</span>
            {couple?.partner2Name ? (
              <>
                <span aria-hidden style={{ fontSize: "0.7em" }}>
                  <FoilText theme={theme}>&amp;</FoilText>
                </span>
                <span className="break-words">{couple.partner2Name}</span>
              </>
            ) : null}
          </h1>
        ) : null}
        {date ? (
          <>
            <GoldDivider theme={theme} className="mt-4" />
            <p className="mt-3 text-lg sm:text-xl" style={{ color: p.text, letterSpacing: kh ? undefined : "0.12em" }}>
              {date}
            </p>
          </>
        ) : null}
        <div aria-hidden className="mt-6 flex flex-col items-center gap-1" style={{ color: p.accent }}>
          <span className="text-xs" style={{ letterSpacing: kh ? undefined : "0.2em", textTransform: kh ? undefined : "uppercase" }}>
            {t("grace.hero.scroll")}
          </span>
          <motion.svg
            viewBox="0 0 16 16"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={reduce ? undefined : { y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
            transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M3 6l5 5 5-5" />
          </motion.svg>
        </div>
      </div>
    </GraceSection>
  );
}

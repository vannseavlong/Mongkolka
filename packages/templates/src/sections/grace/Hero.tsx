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
    fontSize: kh ? "clamp(1.9rem, 8vw, 3rem)" : "clamp(2.6rem, 11vw, 4.75rem)",
    lineHeight: kh ? 1.5 : 1.1,
  };

  return (
    <GraceSection theme={theme} id="hero" className="flex min-h-[100svh] items-center !py-14 text-center sm:!py-20" maxWidth="max-w-2xl">
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
          className="mt-4 !max-w-[16rem] sm:!max-w-[19rem]"
        />
        <p className="mt-9 text-sm" style={{ color: p.accent, letterSpacing: kh ? undefined : "0.18em", textTransform: kh ? undefined : "uppercase" }}>
          {t("grace.hero.together")}
        </p>
        {names ? (
          <h1 className="mt-3 w-full break-words" aria-label={names} style={nameStyle}>
            <span className="block break-words">{couple?.partner1Name}</span>
            {couple?.partner2Name ? (
              <>
                <span aria-hidden className="block" style={{ fontSize: "0.6em", lineHeight: 1.2 }}>
                  <FoilText theme={theme}>&amp;</FoilText>
                </span>
                <span className="block break-words">{couple.partner2Name}</span>
              </>
            ) : null}
          </h1>
        ) : null}
        {date ? (
          <>
            <GoldDivider theme={theme} className="mt-7" />
            <p className="mt-5 text-lg sm:text-xl" style={{ color: p.text, letterSpacing: kh ? undefined : "0.12em" }}>
              {date}
            </p>
          </>
        ) : null}
        <div aria-hidden className="mt-10 flex flex-col items-center gap-1" style={{ color: p.accent }}>
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

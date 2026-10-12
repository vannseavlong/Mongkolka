"use client";

import { motion } from "motion/react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { DISPLAY_FONT, Eyebrow, InkSection, LABEL_FONT, mix, splitDate } from "./shared";

export interface HeroFolioProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

/**
 * Arched photo window with oversized overlapping names, a vertical date column
 * and a slowly rotating "save the date" roundel.
 */
export function HeroFolio({ couple, theme, content }: HeroFolioProps) {
  const { t } = useLanguage();
  const date = splitDate(couple.weddingDate);
  const foil = theme.accent_color;
  const ring = `${t("ink.saveTheDate")} • ${date ? `${date.day} ${date.monthShort} ${date.year}` : ""} • `.toUpperCase();

  return (
    <InkSection theme={theme} className="min-h-[100svh]">
      <div className="mx-auto grid min-h-[100svh] max-w-6xl grid-cols-[auto_1fr] items-center gap-4 px-5 py-20 sm:gap-10 sm:px-10">
        {/* vertical date */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="flex h-full flex-col items-center justify-between py-6"
        >
          <span className="h-24 w-px" style={{ backgroundColor: mix(theme.text_color, 40) }} />
          {date && (
            <p
              className="whitespace-nowrap text-xs uppercase tracking-[0.5em]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: LABEL_FONT }}
            >
              {date.weekday} · {date.day} {date.month} {date.year}
            </p>
          )}
          <span className="h-24 w-px" style={{ backgroundColor: mix(theme.text_color, 40) }} />
        </motion.div>

        <div className="relative flex flex-col items-center">
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
            className="relative w-[min(72vw,26rem)] overflow-hidden"
            style={{ aspectRatio: "3 / 4", borderRadius: "999px 999px 0 0", border: `1px solid ${foil}` }}
          >
            {content?.coverPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={content.coverPhotoUrl} alt="" className="size-full object-cover" />
            ) : (
              <div
                className="size-full"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, ${mix(foil, 22)} 0 1px, transparent 1px 14px), linear-gradient(180deg, ${mix(foil, 30)}, ${mix(theme.text_color, 18)})`,
                }}
              />
            )}
            <div
              aria-hidden
              className="absolute inset-3"
              style={{ border: `1px solid ${mix(theme.bg_color, 70)}`, borderRadius: "999px 999px 0 0" }}
            />
          </motion.div>

          {/* names overlap the arch */}
          <h1
            className="pointer-events-none -mt-[14%] text-center text-[clamp(3.25rem,13vw,9rem)] font-light leading-[0.86] tracking-tight"
            style={{
              fontFamily: DISPLAY_FONT,
              color: theme.text_color,
              // paper-colored halo keeps the names legible where they cross the photo
              textShadow: [0, 1, 2, 3].map((n) => `0 0 ${8 + n * 10}px ${theme.bg_color}`).join(", "),
            }}
          >
            {[couple.partner1Name, couple.partner2Name].filter(Boolean).map((name, i) => (
              <motion.span
                key={name}
                className="block"
                style={{ textAlign: i === 0 ? "left" : "right" }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.2, duration: 0.9, ease: "easeOut" }}
              >
                {name}
              </motion.span>
            ))}
          </h1>

          {/* rotating roundel */}
          <motion.svg
            aria-hidden
            viewBox="0 0 120 120"
            className="absolute -right-2 top-4 size-24 sm:-right-10 sm:size-32"
            animate={{ rotate: 360 }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            <defs>
              <path id="ink-ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1 -92 0" />
            </defs>
            <text fill={foil} fontSize="9.5" letterSpacing="3" style={{ fontFamily: LABEL_FONT }}>
              <textPath href="#ink-ring">{ring}</textPath>
            </text>
          </motion.svg>

          <Eyebrow color={foil} className="mt-12 animate-pulse">
            {t("ink.scroll")}
          </Eyebrow>
        </div>
      </div>
    </InkSection>
  );
}

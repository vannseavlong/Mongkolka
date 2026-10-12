"use client";

import { motion } from "motion/react";
import type { DetailsContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { Eyebrow, InkSection, LABEL_FONT, Ornament, mix, toRoman } from "./shared";

export interface DetailsProgrammeProps {
  theme: Theme;
  content?: DetailsContent;
}

/** An "order of the day": roman-numbered entries joined by dotted leaders. */
export function DetailsProgramme({ theme, content }: DetailsProgrammeProps) {
  const { t } = useLanguage();
  const foil = theme.accent_color;
  const entries = [
    {
      title: t("section.details.ceremony"),
      time: content?.ceremonyTime,
      venue: content?.ceremonyVenue,
      address: content?.ceremonyAddress,
    },
    {
      title: t("section.details.reception"),
      time: content?.receptionTime,
      venue: content?.receptionVenue,
      address: content?.receptionAddress,
    },
  ].filter((e) => e.time || e.venue || e.address);

  if (entries.length === 0 && !content?.dressCode) return null;

  return (
    <InkSection theme={theme} className="px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-16 text-center">
          <Eyebrow color={foil}>{t("ink.programme")}</Eyebrow>
          <h2 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)] font-light italic">{t("section.details.heading")}</h2>
          <Ornament color={foil} className="mt-6" />
        </header>

        <ol className="flex flex-col">
          {entries.map((entry, i) => (
            <motion.li
              key={entry.title}
              initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 py-10 sm:grid-cols-[7rem_1fr_auto] sm:gap-x-10"
              style={{ borderTop: i === 0 ? "none" : `1px solid ${mix(theme.text_color, 18)}` }}
            >
              <span className="row-span-2 text-6xl font-light italic leading-none sm:text-7xl" style={{ color: foil }}>
                {toRoman(i + 1)}
              </span>
              <div>
                <h3 className="text-3xl font-light sm:text-4xl">{entry.title}</h3>
                {entry.venue && <p className="mt-2 text-xl italic">{entry.venue}</p>}
                {entry.address && (
                  <p className="mt-1 text-sm opacity-70" style={{ fontFamily: LABEL_FONT }}>
                    {entry.address}
                  </p>
                )}
              </div>
              {entry.time && (
                <p
                  className="col-start-2 self-start text-sm uppercase tracking-[0.3em] sm:col-start-3 sm:pt-2"
                  style={{ color: foil, fontFamily: LABEL_FONT }}
                >
                  {entry.time}
                </p>
              )}
            </motion.li>
          ))}
        </ol>

        {content?.dressCode && (
          <div className="mt-6 px-6 py-5 text-center" style={{ border: `1px solid ${mix(foil, 70)}` }}>
            <Eyebrow color={foil}>{t("section.details.dressCode")}</Eyebrow>
            <p className="mt-2 text-xl italic">{content.dressCode}</p>
          </div>
        )}
      </div>
    </InkSection>
  );
}

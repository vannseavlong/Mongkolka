"use client";

import { motion } from "motion/react";
import type { DetailsContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { Eyebrow, InkSection, LABEL_FONT } from "../ink/shared";
import { KbachDivider, KbachStrip, Lotus } from "./shared";

export interface DetailsKbachProps {
  theme: Theme;
  content?: DetailsContent;
}

/** Event cards capped with a pointed arch; stacks on phones, pairs on wider screens. */
export function DetailsKbach({ theme, content }: DetailsKbachProps) {
  const { t } = useLanguage();
  const foil = theme.accent_color;
  // Opaque (not translucent) so the arch cap and the card body join without a seam.
  const tint = `color-mix(in srgb, ${foil} 7%, ${theme.bg_color})`;
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
    <InkSection theme={theme} className="px-5 py-24 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-14 flex flex-col items-center gap-4 text-center">
          <Eyebrow color={foil}>{t("ink.programme")}</Eyebrow>
          <h2 className="text-[clamp(2.4rem,7vw,4rem)] font-light italic">{t("section.details.heading")}</h2>
          <KbachDivider color={foil} />
        </header>

        <div className="grid gap-10 sm:grid-cols-2">
          {entries.map((entry, i) => (
            <motion.article
              key={entry.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
              className="flex flex-col"
            >
              <svg aria-hidden viewBox="0 0 300 80" className="-mb-px block w-full" fill="none" stroke={foil} strokeWidth="1.4">
                <path d="M1 80V56C1 36 104 30 150 4C196 30 299 36 299 56V80Z" style={{ fill: tint }} stroke="none" />
                <path d="M1 80V56C1 36 104 30 150 4C196 30 299 36 299 56V80" />
                <path d="M16 80V58C16 44 108 40 150 18C192 40 284 44 284 58V80" strokeOpacity="0.55" />
              </svg>
              <div
                className="flex flex-1 flex-col items-center gap-3 px-6 pb-9 pt-2 text-center"
                style={{ borderInline: `1.4px solid ${foil}`, backgroundColor: tint }}
              >
                <Lotus color={foil} className="h-8 w-12" />
                <h3 className="text-3xl font-light italic">{entry.title}</h3>
                {entry.time && (
                  <p className="text-sm uppercase tracking-[0.3em]" style={{ color: foil, fontFamily: LABEL_FONT }}>
                    {entry.time}
                  </p>
                )}
                {entry.venue && <p className="text-xl">{entry.venue}</p>}
                {entry.address && (
                  <p className="text-sm opacity-75" style={{ fontFamily: LABEL_FONT }}>
                    {entry.address}
                  </p>
                )}
              </div>
              <KbachStrip color={foil} flip className="-mt-px" />
            </motion.article>
          ))}
        </div>

        {content?.dressCode && (
          <p className="mt-12 text-center">
            <span className="text-xs uppercase tracking-[0.35em]" style={{ color: foil, fontFamily: LABEL_FONT }}>
              {t("section.details.dressCode")}
            </span>
            <span className="mt-2 block text-lg italic">{content.dressCode}</span>
          </p>
        )}
      </div>
    </InkSection>
  );
}

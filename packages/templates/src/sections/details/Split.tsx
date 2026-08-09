"use client";

import { motion } from "motion/react";
import type { DetailsContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";

export interface DetailsSplitProps {
  theme: Theme;
  content?: DetailsContent;
}

function Half({
  label,
  time,
  venue,
  address,
  theme,
  align,
}: {
  label: string;
  time?: string;
  venue?: string;
  address?: string;
  theme: Theme;
  align: "left" | "right";
}) {
  if (!time && !venue && !address) return null;
  return (
    <div className={align === "left" ? "text-right sm:pr-10" : "text-left sm:pl-10"}>
      <h3 className="mb-3 text-sm font-medium uppercase tracking-widest" style={{ color: theme.accent_color }}>
        {label}
      </h3>
      {venue && <p className="text-lg opacity-95">{venue}</p>}
      {time && <p className="opacity-80">{time}</p>}
      {address && <p className="text-sm opacity-60">{address}</p>}
    </div>
  );
}

/** Ceremony and reception divided by a single vertical rule, instead of two bordered cards. */
export function DetailsSplit({ theme, content }: DetailsSplitProps) {
  const { t } = useLanguage();

  return (
    <section
      className="px-6 py-20"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <h2 className="mb-10 text-center text-2xl font-medium" style={{ color: theme.accent_color }}>
        {t("section.details.heading")}
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto grid max-w-2xl gap-8 sm:grid-cols-2 sm:divide-x"
        style={{ borderColor: theme.accent_color }}
      >
        <Half
          label={t("section.details.ceremony")}
          time={content?.ceremonyTime}
          venue={content?.ceremonyVenue}
          address={content?.ceremonyAddress}
          theme={theme}
          align="left"
        />
        <Half
          label={t("section.details.reception")}
          time={content?.receptionTime}
          venue={content?.receptionVenue}
          address={content?.receptionAddress}
          theme={theme}
          align="right"
        />
      </motion.div>
      {content?.dressCode && (
        <p className="mt-10 text-center text-sm opacity-80">
          {t("section.details.dressCode")}: {content.dressCode}
        </p>
      )}
    </section>
  );
}

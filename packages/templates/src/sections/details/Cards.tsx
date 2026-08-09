"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Church, PartyPopper, Shirt } from "lucide-react";
import type { DetailsContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";

export interface DetailsCardsProps {
  theme: Theme;
  content?: DetailsContent;
}

function IconCard({
  icon,
  title,
  time,
  venue,
  address,
  theme,
  index,
}: {
  icon: ReactNode;
  title: string;
  time?: string;
  venue?: string;
  address?: string;
  theme: Theme;
  index: number;
}) {
  if (!time && !venue && !address) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
      className="flex flex-col items-center gap-3 rounded-2xl p-8 text-center shadow-lg"
      style={{ backgroundColor: theme.bg_color }}
    >
      <div
        className="flex size-14 items-center justify-center rounded-full"
        style={{ backgroundColor: theme.accent_color, opacity: 0.9 }}
      >
        <span style={{ color: theme.bg_color }}>{icon}</span>
      </div>
      <h3 className="text-lg font-medium" style={{ color: theme.accent_color }}>
        {title}
      </h3>
      {venue && <p className="opacity-90">{venue}</p>}
      {time && <p className="opacity-90">{time}</p>}
      {address && <p className="text-sm opacity-70">{address}</p>}
    </motion.div>
  );
}

/** Elevated, icon-led cards instead of Classic's plain bordered boxes. */
export function DetailsCards({ theme, content }: DetailsCardsProps) {
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
      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
        <IconCard
          icon={<Church className="size-6" />}
          title={t("section.details.ceremony")}
          time={content?.ceremonyTime}
          venue={content?.ceremonyVenue}
          address={content?.ceremonyAddress}
          theme={theme}
          index={0}
        />
        <IconCard
          icon={<PartyPopper className="size-6" />}
          title={t("section.details.reception")}
          time={content?.receptionTime}
          venue={content?.receptionVenue}
          address={content?.receptionAddress}
          theme={theme}
          index={1}
        />
      </div>
      {content?.dressCode && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
          className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-3 rounded-2xl p-6 text-center shadow-lg"
          style={{ backgroundColor: theme.bg_color }}
        >
          <Shirt className="size-5" style={{ color: theme.accent_color }} />
          <p className="text-sm opacity-90">
            {t("section.details.dressCode")}: {content.dressCode}
          </p>
        </motion.div>
      )}
    </section>
  );
}

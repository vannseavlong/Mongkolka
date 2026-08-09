"use client";

import { motion } from "motion/react";
import { Gift } from "lucide-react";
import type { RegistryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";

export interface RegistryCardsProps {
  theme: Theme;
  content?: RegistryContent;
}

/** A grid of elevated shop-style cards, one per registry link, instead of a stacked list. */
export function RegistryCards({ theme, content }: RegistryCardsProps) {
  const { t } = useLanguage();
  const links = content?.links ?? [];
  if (links.length === 0) return null;

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
        {t("section.registry.heading")}
      </h2>
      <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
        {links.map((link, i) => (
          <motion.a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            className="flex flex-col items-center gap-3 rounded-2xl p-8 text-center shadow-lg transition-transform hover:-translate-y-1"
            style={{ backgroundColor: theme.bg_color }}
          >
            <div
              className="flex size-12 items-center justify-center rounded-full"
              style={{ backgroundColor: theme.accent_color }}
            >
              <Gift className="size-5" style={{ color: theme.bg_color }} />
            </div>
            <p className="font-medium" style={{ color: theme.accent_color }}>
              {link.label}
            </p>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

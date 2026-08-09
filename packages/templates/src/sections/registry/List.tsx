"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { RegistryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";

export interface RegistryListProps {
  theme: Theme;
  content?: RegistryContent;
}

/** A slim divided list of rows, each with a trailing arrow — no boxes or borders. */
export function RegistryList({ theme, content }: RegistryListProps) {
  const { t } = useLanguage();
  const links = content?.links ?? [];
  if (links.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-md px-6 py-20"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <h2 className="mb-6 text-center text-2xl font-medium" style={{ color: theme.accent_color }}>
        {t("section.registry.heading")}
      </h2>
      <div className="flex flex-col" style={{ borderTop: `1px solid ${theme.accent_color}` }}>
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between py-4 font-medium hover:opacity-70"
            style={{ borderBottom: `1px solid ${theme.accent_color}` }}
          >
            <span>{link.label}</span>
            <ArrowUpRight className="size-4 shrink-0" style={{ color: theme.accent_color }} />
          </a>
        ))}
      </div>
    </motion.section>
  );
}

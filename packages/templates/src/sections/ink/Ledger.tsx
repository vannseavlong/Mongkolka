"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { RegistryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { Eyebrow, InkSection, LABEL_FONT, Ornament, mix } from "./shared";

export interface RegistryLedgerProps {
  theme: Theme;
  content?: RegistryContent;
}

/** Registry links as ledger lines: index, label, dotted leader, "visit". */
export function RegistryLedger({ theme, content }: RegistryLedgerProps) {
  const { t } = useLanguage();
  const links = content?.links ?? [];
  if (links.length === 0) return null;
  const foil = theme.accent_color;

  return (
    <InkSection theme={theme} className="px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <Eyebrow color={foil}>— {t("section.registry.heading")} —</Eyebrow>
          <Ornament color={foil} className="mt-6" />
        </header>
        <ul>
          {links.map((link, i) => (
            <motion.li
              key={`${link.url}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-baseline gap-4 py-5 transition-colors"
                style={{ borderBottom: `1px solid ${mix(theme.text_color, 15)}` }}
              >
                <span className="text-sm italic" style={{ color: foil }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-2xl font-light transition-transform group-hover:translate-x-1 sm:text-3xl">
                  {link.label}
                </span>
                <span
                  aria-hidden
                  className="mb-1 flex-1 self-end border-b border-dotted"
                  style={{ borderColor: mix(theme.text_color, 35) }}
                />
                <span
                  className="flex items-center gap-1 text-[10px] uppercase tracking-[0.35em]"
                  style={{ color: foil, fontFamily: LABEL_FONT }}
                >
                  {t("ink.visit")}
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </InkSection>
  );
}

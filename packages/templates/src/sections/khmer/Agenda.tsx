"use client";

import type { AgendaContent, CoupleInfo, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { CINZEL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { localizeDigits } from "../../format";
import { OrnateSection } from "./OrnateSection";
import { buildAgenda, iconTitleKey, type AgendaItemView } from "./agenda-logic";
import { useSkinOrnaments } from "./skin-context";

export interface AgendaKhmerProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: AgendaContent;
}

const NODE = 54;

function Node({ item, theme }: { item: AgendaItemView; theme: Theme }) {
  const sk = useSkinOrnaments();
  const Icon = item.icon ? sk.icons[item.icon] : null;
  return (
    <div
      aria-hidden
      className="relative z-10 grid shrink-0 place-items-center rounded-full"
      style={{
        width: NODE,
        height: NODE,
        background: `radial-gradient(circle at 32% 26%, ${withAlpha(theme.accent_color, 0.22)}, ${withAlpha(theme.accent_color, 0.06)} 70%), ${theme.bg_color}`,
        border: `1.5px solid ${withAlpha(theme.accent_color, 0.75)}`,
        boxShadow: `0 0 0 4px ${theme.bg_color}, 0 6px 14px -6px ${withAlpha(theme.accent_color, 0.55)}`,
      }}
    >
      {Icon ? (
        <Icon color={theme.accent_color} size={30} strokeWidth={sk.iconStroke} />
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path d="M7 1 13 7 7 13 1 7Z" fill={theme.accent_color} />
        </svg>
      )}
    </div>
  );
}

/**
 * Ritual agenda: a vertical gold timeline per day, a line icon for each ceremony, the couple's
 * title in the viewer's language (the other language smaller beneath) or the ritual's default name.
 */
export function AgendaKhmer({ theme, content }: AgendaKhmerProps) {
  const { t, language } = useLanguage();
  const sk = useSkinOrnaments();
  const days = buildAgenda(content, language, (icon) => t(iconTitleKey(icon)));
  if (days.length === 0) return null;

  return (
    <OrnateSection theme={theme} id="agenda" heading={t("khmer.agenda.heading")}>
      <div className="space-y-12 text-left">
        {days.map((day) => (
          <div key={day.date}>
            <div className="mb-7 text-center">
              {days.length > 1 && (
                <p className="m-0 text-sm" style={{ ...sk.heading(theme, language), fontSize: "0.95rem" }}>
                  {t("khmer.agenda.day")} {localizeDigits(day.number, language)}
                </p>
              )}
              <p className="m-0 mt-1 text-[13px] opacity-85" style={{ fontFamily: language === "en" ? CINZEL_FONT : undefined, letterSpacing: language === "en" ? "0.08em" : "normal" }}>
                {day.heading}
              </p>
            </div>
            <ol className="relative m-0 list-none space-y-7 p-0">
              <span
                aria-hidden
                className="absolute"
                style={{ left: NODE / 2 - 0.5, top: NODE / 2, bottom: NODE / 2, width: 1, backgroundImage: `linear-gradient(180deg, ${withAlpha(theme.accent_color, 0.15)}, ${withAlpha(theme.accent_color, 0.8)} 12%, ${withAlpha(theme.accent_color, 0.8)} 88%, ${withAlpha(theme.accent_color, 0.15)})` }}
              />
              {day.items.map((item, i) => (
                <li key={`${item.time}-${i}`} className="relative flex items-center gap-4">
                  <Node item={item} theme={theme} />
                  <div className="min-w-0">
                    {item.time && (
                      <p className="m-0 text-[13px] font-semibold" style={{ fontFamily: CINZEL_FONT, color: theme.accent_color, letterSpacing: "0.1em" }}>
                        {localizeDigits(item.time, language)}
                      </p>
                    )}
                    <p className="m-0 break-words text-[15px] font-semibold leading-snug">{item.title}</p>
                    {item.subtitle && <p className="m-0 mt-0.5 break-words text-xs leading-snug opacity-70">{item.subtitle}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </OrnateSection>
  );
}

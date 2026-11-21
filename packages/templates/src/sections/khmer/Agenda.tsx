"use client";

import type { AgendaContent, CoupleInfo, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { pickLang } from "./skin-logic";
import { StubSection } from "./stub-parts";

export interface AgendaKhmerProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: AgendaContent;
}

/** PLACEHOLDER (Web-khmer-core-sections builds the real timeline with ritual icons): days with time + title rows. */
export function AgendaKhmer({ theme, content }: AgendaKhmerProps) {
  const { t, language } = useLanguage();
  const days = (content?.days ?? []).filter((d) => d.items.length > 0);
  if (days.length === 0) return null;

  return (
    <StubSection theme={theme} id="agenda" heading={t("khmer.agenda.heading")}>
      <div className="space-y-8 text-left">
        {days.map((day) => (
          <div key={day.date}>
            <p className="m-0 mb-3 text-center text-sm" style={{ color: theme.accent_color }}>
              {day.date}
            </p>
            <ul className="m-0 list-none space-y-3 p-0">
              {day.items.map((item, i) => (
                <li key={`${item.time}-${i}`} className="flex gap-4 text-sm leading-relaxed">
                  <span className="w-16 shrink-0" style={{ color: theme.accent_color }}>
                    {item.time}
                  </span>
                  <span>{pickLang(language, item.titleKh, item.titleEn)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </StubSection>
  );
}

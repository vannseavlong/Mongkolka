"use client";

import type { AgendaContent, CoupleInfo, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { ROUNDED_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { localizeDigits } from "../../format";
import { OrnateSection } from "../khmer/OrnateSection";
import { buildAgenda } from "../khmer/agenda-logic";
import { useSkinOrnaments } from "../khmer/skin-context";
import { kidsPalette } from "./art/palette";
import { KIDS_CSS } from "./kids-styles";
import type { AgendaIcon } from "../../types";

export interface AgendaKidsProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: AgendaContent;
}

const BUBBLE = 58;

/**
 * The party plan: stepping-stone bubbles down a dotted path, each with a party icon in a pastel
 * colour, a time pill and the plan item. Titles come from the host; an item with only an icon gets a
 * friendly default ("Blow out the candles"). Days are labelled only when there is more than one.
 */
export function AgendaKids({ theme, content }: AgendaKidsProps) {
  const { t, language } = useLanguage();
  const sk = useSkinOrnaments();
  const pal = kidsPalette(theme);
  const days = buildAgenda(content, language, (icon: AgendaIcon) => t(`kids.icon.${icon}`));
  if (days.length === 0) return null;
  const tones = [pal.peach, pal.mint, pal.lavender, withAlpha(pal.rose, 0.4)];

  return (
    <OrnateSection theme={theme} id="agenda" heading={t("kids.agenda.heading")}>
      <style href="mk-kids-css" precedence="mk-kids">
        {KIDS_CSS}
      </style>
      <div className="space-y-10 text-left">
        {days.map((day) => (
          <div key={`${day.date}-${day.number}`}>
            <div className="mb-6 text-center">
              {days.length > 1 && (
                <p className="m-0 text-base font-bold" style={{ color: pal.berry, fontFamily: ROUNDED_FONT }}>
                  {t("kids.agenda.day")} {localizeDigits(day.number, language)}
                </p>
              )}
              <p className="m-0 mt-1 text-[13px] font-semibold opacity-80">{day.heading}</p>
            </div>
            <ol className="relative m-0 list-none space-y-6 p-0">
              <span aria-hidden className="absolute" style={{ left: BUBBLE / 2 - 1.5, top: BUBBLE / 2, bottom: BUBBLE / 2, width: 3, backgroundImage: `radial-gradient(${withAlpha(pal.berry, 0.5)} 1.6px, transparent 2px)`, backgroundSize: "3px 11px" }} />
              {day.items.map((item, i) => {
                const Icon = item.icon ? sk.icons[item.icon] : null;
                return (
                  <li key={`${item.time}-${i}`} className="relative flex items-center gap-4">
                    <div aria-hidden className="relative z-10 grid shrink-0 place-items-center rounded-full" style={{ width: BUBBLE, height: BUBBLE, background: tones[i % tones.length], border: "3.5px solid #fff", boxShadow: `0 5px 0 -1px ${withAlpha(pal.berry, 0.2)}` }}>
                      {Icon ? <Icon color={pal.berry} size={32} strokeWidth={sk.iconStroke} /> : <span className="size-3 rounded-full" style={{ background: pal.berry }} />}
                    </div>
                    <div className="min-w-0 rounded-3xl px-4 py-2.5" style={{ background: "rgba(255,255,255,.85)", border: `2px solid ${withAlpha(pal.berry, 0.14)}` }}>
                      {item.time && (
                        <p className="m-0 text-[13px] font-bold" style={{ color: pal.berry, fontFamily: ROUNDED_FONT }}>
                          {localizeDigits(item.time, language)}
                        </p>
                      )}
                      <p className="m-0 break-words text-[15px] font-bold leading-snug">{item.title}</p>
                      {item.subtitle && <p className="m-0 mt-0.5 break-words text-xs leading-snug opacity-70">{item.subtitle}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </OrnateSection>
  );
}

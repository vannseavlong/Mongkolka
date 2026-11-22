"use client";

import type { CoupleInfo, DetailsContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { ROUNDED_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { OrnateSection } from "../khmer/OrnateSection";
import { kidsPalette } from "./art/palette";
import { KidsButton } from "./art/KidsButton";
import { buildKidsDetails } from "./details-logic";
import { KIDS_CSS } from "./kids-styles";

export interface DetailsKidsProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: DetailsContent;
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

/** Where the party is: the venue photo in a soft blob frame, a card per place with time, venue and address, what to wear, and a pink "open location" button. */
export function DetailsKids({ theme, content }: DetailsKidsProps) {
  const { t } = useLanguage();
  const pal = kidsPalette(theme);
  const view = buildKidsDetails(content);
  if (view.isEmpty) return null;
  const tones = [pal.mint, pal.lavender];

  return (
    <OrnateSection theme={theme} id="details" heading={t("kids.details.heading")}>
      <style href="mk-kids-css" precedence="mk-kids">
        {KIDS_CSS}
      </style>
      {view.image && (
        <div
          className="mx-auto mb-7 w-full max-w-sm overflow-hidden"
          style={{ aspectRatio: "4 / 3", borderRadius: "46% 54% 42% 58% / 56% 44% 56% 44%", border: "6px solid #fff", boxShadow: `0 0 0 3px ${withAlpha(pal.rose, 0.5)}, 0 18px 26px -14px ${withAlpha(pal.berry, 0.5)}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={view.image} alt={view.places[0]?.venue ?? ""} loading="lazy" className="h-full w-full object-cover" />
        </div>
      )}
      {view.places.length > 0 && (
        <div className="grid gap-4">
          {view.places.map((p, i) => (
            <div key={p.key} className="rounded-[28px] px-5 py-5" style={{ background: tones[i % 2], border: "3px solid #fff", boxShadow: `0 6px 0 -1px ${withAlpha(pal.berry, 0.16)}` }}>
              <p className="m-0 text-xs font-bold uppercase tracking-[0.16em]" style={{ color: pal.berry, fontFamily: ROUNDED_FONT }}>
                {t(p.key === "party" ? "kids.details.party" : "kids.details.after")}
              </p>
              {p.time && (
                <p className="m-0 mt-2 text-xl font-bold" style={{ color: pal.berry, fontFamily: ROUNDED_FONT }}>
                  {p.time}
                </p>
              )}
              {p.venue && <p className="m-0 mt-1 break-words text-base font-bold leading-snug">{p.venue}</p>}
              {p.address && <p className="m-0 mt-1 break-words text-[13px] leading-snug opacity-80">{p.address}</p>}
            </div>
          ))}
        </div>
      )}
      {view.dress && (
        <p className="m-0 mt-6 text-sm">
          <span className="font-bold" style={{ color: pal.berry }}>{t("kids.details.dress")}: </span>
          {view.dress}
        </p>
      )}
      {view.map && (
        <div className="mt-8">
          <KidsButton theme={theme} href={view.map}>
            <PinIcon />
            {t("kids.details.view")}
          </KidsButton>
          <p className="m-0 mt-3 text-[11px] opacity-60">{t("kids.details.mapHint")}</p>
        </div>
      )}
    </OrnateSection>
  );
}

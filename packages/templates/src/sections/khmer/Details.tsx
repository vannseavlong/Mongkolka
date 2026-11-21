"use client";

import type { CoupleInfo, DetailsContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { CINZEL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { OrnateSection } from "./OrnateSection";
import { safeHttpsUrl } from "./skin-logic";
import { useSkinOrnaments } from "./skin-context";
import { GoldButton } from "./stub-parts";

export interface DetailsKhmerProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: DetailsContent;
}

function PinIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mr-2 shrink-0">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

/**
 * Location and venue: the venue photo in an arch, ceremony and reception cards with their ritual
 * icon, dress code, and a gold button to an https map link. A map embed and QR are not included
 * (an embed loads a third party; a QR needs an encoder dependency).
 */
export function DetailsKhmer({ theme, content }: DetailsKhmerProps) {
  const { t } = useLanguage();
  const sk = useSkinOrnaments();
  if (!content) return null;
  const rows = [
    { key: "ceremony", icon: "ring" as const, label: t("section.details.ceremony"), time: content.ceremonyTime, venue: content.ceremonyVenue, address: content.ceremonyAddress },
    { key: "reception", icon: "dinner" as const, label: t("section.details.reception"), time: content.receptionTime, venue: content.receptionVenue, address: content.receptionAddress },
  ].filter((r) => r.time || r.venue || r.address);
  const map = safeHttpsUrl(content.mapUrl);
  const image = safeHttpsUrl(content.venueImageUrl);
  const dress = content.dressCode?.trim();
  if (rows.length === 0 && !map && !image && !dress) return null;

  return (
    <OrnateSection theme={theme} id="details" heading={t("khmer.details.heading")}>
      {image && (
        <div
          className="mx-auto mb-8 w-full max-w-sm overflow-hidden"
          style={{
            aspectRatio: "5 / 4",
            borderRadius: "50% 50% 18px 18px / 36% 36% 18px 18px",
            border: `1.5px solid ${withAlpha(theme.accent_color, 0.75)}`,
            boxShadow: `0 0 0 5px ${withAlpha(theme.bg_color, 0.9)}, 0 0 0 6px ${withAlpha(theme.accent_color, 0.35)}, 0 16px 30px -16px rgba(0,0,0,0.5)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={content.ceremonyVenue ?? content.receptionVenue ?? ""} loading="lazy" className="h-full w-full object-cover" />
        </div>
      )}
      {rows.length > 0 && (
        <div className={`grid gap-4 text-center ${rows.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {rows.map((r) => {
            const Icon = sk.icons[r.icon];
            return (
              <div key={r.key} className="rounded-2xl px-4 py-6" style={{ border: `1px solid ${withAlpha(theme.accent_color, 0.4)}`, background: withAlpha(theme.accent_color, 0.06) }}>
                <div className="mx-auto mb-3 w-fit">
                  <Icon color={theme.accent_color} size={34} strokeWidth={sk.iconStroke} />
                </div>
                <p className="m-0 text-sm" style={{ ...sk.heading(theme, "en"), fontSize: "0.85rem", fontFamily: "inherit", textTransform: "none", letterSpacing: "normal" }}>
                  {r.label}
                </p>
                {r.time && (
                  <p className="m-0 mt-2 text-[15px] font-semibold" style={{ fontFamily: CINZEL_FONT, color: theme.accent_color }}>
                    {r.time}
                  </p>
                )}
                {r.venue && <p className="m-0 mt-1 break-words text-[15px] font-semibold leading-snug">{r.venue}</p>}
                {r.address && <p className="m-0 mt-1 break-words text-[13px] leading-snug opacity-75">{r.address}</p>}
              </div>
            );
          })}
        </div>
      )}
      {dress && (
        <p className="m-0 mt-6 text-sm">
          <span style={{ color: theme.accent_color }}>{t("khmer.details.dress")}: </span>
          {dress}
        </p>
      )}
      {map && (
        <div className="mt-8">
          <GoldButton theme={theme} href={map}>
            <PinIcon color={theme.bg_color} />
            {t("khmer.details.view")}
          </GoldButton>
          <p className="m-0 mt-2 text-[11px] opacity-60">{t("khmer.details.mapHint")}</p>
        </div>
      )}
    </OrnateSection>
  );
}

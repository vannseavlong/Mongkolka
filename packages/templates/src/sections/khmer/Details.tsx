"use client";

import type { CoupleInfo, DetailsContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { safeHttpsUrl } from "./skin-logic";
import { GoldButton, StubSection } from "./stub-parts";

export interface DetailsKhmerProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: DetailsContent;
}

/**
 * PLACEHOLDER for the details/location extension point (Web-khmer-core-sections builds the real one):
 * venue photo, ceremony and reception rows, and a "view location" button for an https `mapUrl`.
 */
export function DetailsKhmer({ theme, content }: DetailsKhmerProps) {
  const { t } = useLanguage();
  if (!content) return null;
  const rows = [
    { label: t("section.details.ceremony"), time: content.ceremonyTime, venue: content.ceremonyVenue, address: content.ceremonyAddress },
    { label: t("section.details.reception"), time: content.receptionTime, venue: content.receptionVenue, address: content.receptionAddress },
  ].filter((r) => r.time || r.venue || r.address);
  const map = safeHttpsUrl(content.mapUrl);
  const image = safeHttpsUrl(content.venueImageUrl);
  if (rows.length === 0 && !map && !image) return null;

  return (
    <StubSection theme={theme} id="details" heading={t("khmer.details.heading")}>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="mb-6 h-44 w-full rounded-2xl object-cover" />
      )}
      <div className="space-y-5 text-sm leading-relaxed">
        {rows.map((r) => (
          <div key={r.label}>
            <p className="m-0" style={{ color: theme.accent_color }}>
              {r.label}
            </p>
            {r.time && <p className="m-0">{r.time}</p>}
            {r.venue && <p className="m-0">{r.venue}</p>}
            {r.address && <p className="m-0 opacity-80">{r.address}</p>}
          </div>
        ))}
      </div>
      {map && (
        <div className="mt-8">
          <GoldButton theme={theme} href={map}>
            {t("khmer.details.view")}
          </GoldButton>
        </div>
      )}
    </StubSection>
  );
}

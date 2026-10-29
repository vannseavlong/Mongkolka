"use client";

import type { ReactNode } from "react";
import { GraceSection, Cross, Reveal, FoilText, gracePalette, nameFont, DISPLAY_FONT } from "./shared";
import { useLanguage } from "../../i18n";
import type { CoupleInfo, DetailsContent, Theme } from "../../types";

export interface GraceDetailsProps {
  couple?: CoupleInfo;
  theme: Theme;
  content?: DetailsContent;
}

/** Google Maps search link for a venue and address (pure; both parts are URL-encoded together). */
export function graceMapsUrl(venue?: string, address?: string): string {
  const q = [venue, address].map((s) => s?.trim()).filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function clean(s?: string): string | undefined {
  const v = s?.trim();
  return v ? v : undefined;
}

function GlassIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M13 9h22c0 9.5-4.5 16-11 16S13 18.5 13 9Z" />
      <path d="M15 14h18" />
      <path d="M24 25v13M17 40h14" />
      <path d="M39 5v4M37 7h4M9 4v3M7.5 5.5h3" />
    </svg>
  );
}

interface CardProps {
  theme: Theme;
  icon: ReactNode;
  title: string;
  time?: string;
  venue?: string;
  address?: string;
  linkLabel: string;
  newTab: string;
  titleFont: string;
}

function EventCard({ theme, icon, title, time, venue, address, linkLabel, newTab, titleFont }: CardProps) {
  const p = gracePalette(theme);
  const hasPlace = !!(venue || address);
  return (
    <div
      className="relative flex h-full flex-col items-center rounded-t-[2rem] rounded-b-xl px-6 pb-8 pt-9 text-center sm:px-8"
      style={{ backgroundColor: p.card, border: `1px solid ${p.foilLight}`, boxShadow: `0 10px 30px -18px ${p.accent}` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-1.5 rounded-t-[1.6rem] rounded-b-lg"
        style={{ border: `1px solid ${p.foilMid}`, opacity: 0.55 }}
      />
      <div className="relative flex w-full flex-col items-center">
        <div style={{ color: p.accent }}>{icon}</div>
        <h3 className="mt-4 text-2xl" style={{ color: p.accent, fontFamily: titleFont }}>
          {title}
        </h3>
        <span aria-hidden className="my-4 block h-px w-12" style={{ backgroundColor: p.foilLight }} />
        {time && (
          <p className="text-lg font-semibold [overflow-wrap:anywhere]" style={{ color: p.text }}>
            {time}
          </p>
        )}
        {venue && (
          <p className="mt-2 text-base font-medium [overflow-wrap:anywhere]" style={{ color: p.text }}>
            {venue}
          </p>
        )}
        {address && (
          <p className="mt-1 text-sm leading-relaxed [overflow-wrap:anywhere]" style={{ color: p.muted }}>
            {address}
          </p>
        )}
        {hasPlace && (
          <a
            href={graceMapsUrl(venue, address)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium underline underline-offset-4 outline-offset-2 focus-visible:outline-2"
            style={{ color: p.accent, outlineColor: p.accent }}
          >
            {linkLabel}
            <span className="sr-only"> {newTab}</span>
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 11l6-6M6 5h5v5" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export function GraceDetails({ theme, content }: GraceDetailsProps) {
  const { t, language } = useLanguage();
  const p = gracePalette(theme);
  const c = {
    ceremony: { time: clean(content?.ceremonyTime), venue: clean(content?.ceremonyVenue), address: clean(content?.ceremonyAddress) },
    reception: { time: clean(content?.receptionTime), venue: clean(content?.receptionVenue), address: clean(content?.receptionAddress) },
    dress: clean(content?.dressCode),
  };
  const showCeremony = !!(c.ceremony.time || c.ceremony.venue || c.ceremony.address);
  const showReception = !!(c.reception.time || c.reception.venue || c.reception.address);
  if (!showCeremony && !showReception && !c.dress) return null;

  const headingFont = nameFont(language);
  const cardFont = DISPLAY_FONT;
  const common = { theme, linkLabel: t("grace.details.directions"), newTab: t("grace.details.newTab"), titleFont: cardFont };
  const both = showCeremony && showReception;

  return (
    <GraceSection theme={theme} id="details" maxWidth="max-w-4xl" className="text-center">
      <Reveal>
        <Cross spray stroke={p.accent} className="mx-auto h-14 w-auto" strokeWidth={1.4} />
        <h2 className="mt-5 text-4xl sm:text-5xl" style={{ fontFamily: headingFont, lineHeight: 1.25 }}>
          <FoilText theme={theme}>{t("grace.details.heading")}</FoilText>
        </h2>
      </Reveal>

      {(showCeremony || showReception) && (
        <div className={`mx-auto mt-12 grid gap-6 ${both ? "md:grid-cols-2" : "max-w-md"}`}>
          {showCeremony && (
            <Reveal className="h-full">
              <EventCard
                {...common}
                icon={<Cross stroke={p.accent} className="h-10 w-auto" strokeWidth={2.5} />}
                title={t("grace.details.ceremony")}
                {...c.ceremony}
              />
            </Reveal>
          )}
          {showReception && (
            <Reveal className="h-full" delay={0.1}>
              <EventCard
                {...common}
                icon={<GlassIcon stroke={p.accent} />}
                title={t("grace.details.reception")}
                {...c.reception}
              />
            </Reveal>
          )}
        </div>
      )}

      {c.dress && (
        <Reveal delay={0.15} className="mx-auto mt-10 max-w-2xl">
          <div className="border-y px-4 py-5" style={{ borderColor: p.foilLight }}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: p.accent }}>
              {t("grace.details.dressCode")}
            </p>
            <p className="mt-2 text-base [overflow-wrap:anywhere]" style={{ color: p.text }}>
              {c.dress}
            </p>
          </div>
        </Reveal>
      )}
    </GraceSection>
  );
}

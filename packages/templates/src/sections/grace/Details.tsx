"use client";

// STUB: replaced by Web-grace-gallery-details
import { GraceSection, Cross, gracePalette } from "./shared";
import { useLanguage } from "../../i18n";
import type { DetailsContent, Theme } from "../../types";

export interface GraceDetailsProps {
  theme: Theme;
  content?: DetailsContent;
}

export function GraceDetails({ theme, content }: GraceDetailsProps) {
  const { t } = useLanguage();
  const p = gracePalette(theme);
  return (
    <GraceSection theme={theme} id="details" className="text-center">
      <Cross stroke={p.accent} className="mx-auto h-10 w-auto" />
      <h2 className="mt-4 text-2xl" style={{ color: p.accent }}>{t("grace.details.stub")}</h2>
      {content?.ceremonyVenue ? <p className="mt-3 break-words">{content.ceremonyVenue}</p> : null}
    </GraceSection>
  );
}

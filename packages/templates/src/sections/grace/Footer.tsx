"use client";

// STUB: replaced by Web-grace-rsvp-guestbook-footer
import { GraceSection, Cross, gracePalette } from "./shared";
import { useLanguage } from "../../i18n";
import type { CoupleInfo, FooterContent, Theme } from "../../types";
import { formatCoupleNames } from "../../format";

export interface GraceFooterProps {
  theme: Theme;
  couple?: CoupleInfo;
  content?: FooterContent;
}

export function GraceFooter({ theme, couple, content }: GraceFooterProps) {
  const { t } = useLanguage();
  const p = gracePalette(theme);
  return (
    <GraceSection theme={theme} id="footer" className="text-center">
      <Cross stroke={p.accent} className="mx-auto h-10 w-auto" />
      <h2 className="mt-4 text-2xl" style={{ color: p.accent }}>{t("grace.footer.stub")}</h2>
      {couple?.partner1Name ? <p className="mt-3 break-words">{formatCoupleNames(couple)}</p> : null}
      {content?.message ? <p className="mt-2 break-words">{content.message}</p> : null}
    </GraceSection>
  );
}

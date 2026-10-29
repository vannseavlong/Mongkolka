"use client";

// STUB: replaced by Web-grace-rsvp-guestbook-footer
import { GraceSection, Cross, gracePalette } from "./shared";
import { useLanguage } from "../../i18n";
import type { GuestbookWallProps } from "../ink/Guestbook";

export function GraceGuestbook({ theme, guestbook }: GuestbookWallProps) {
  const { t } = useLanguage();
  const p = gracePalette(theme);
  return (
    <GraceSection theme={theme} id="guestbook" className="text-center">
      <Cross stroke={p.accent} className="mx-auto h-10 w-auto" />
      <h2 className="mt-4 text-2xl" style={{ color: p.accent }}>{t("grace.guestbook.stub")}</h2>
      <p className="mt-3">{guestbook?.wishes?.length ?? 0}</p>
    </GraceSection>
  );
}

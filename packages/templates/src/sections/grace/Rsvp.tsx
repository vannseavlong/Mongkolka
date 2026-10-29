"use client";

// STUB: replaced by Web-grace-rsvp-guestbook-footer
import { GraceSection, Cross, gracePalette } from "./shared";
import { useLanguage } from "../../i18n";
import type { RsvpContent, Theme } from "../../types";
import type { RsvpSubmission } from "../rsvp/Classic";

export interface GraceRsvpProps {
  theme: Theme;
  content?: RsvpContent;
  /** Left to the consuming app: packages/templates never calls fetch() itself. */
  onSubmit: (submission: RsvpSubmission) => Promise<void>;
}

export function GraceRsvp({ theme, content }: GraceRsvpProps) {
  const { t } = useLanguage();
  const p = gracePalette(theme);
  return (
    <GraceSection theme={theme} id="rsvp" className="text-center">
      <Cross stroke={p.accent} className="mx-auto h-10 w-auto" />
      <h2 className="mt-4 text-2xl" style={{ color: p.accent }}>{t("grace.rsvp.stub")}</h2>
      {content?.customMessage ? <p className="mt-3 break-words">{content.customMessage}</p> : null}
    </GraceSection>
  );
}

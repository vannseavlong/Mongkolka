"use client";

// STUB: replaced by Web-grace-verse-story
import { GraceSection, Cross, gracePalette } from "./shared";
import { useLanguage } from "../../i18n";
import type { VerseContent, Theme } from "../../types";

export interface GraceVerseProps {
  theme: Theme;
  content?: VerseContent;
}

export function GraceVerse({ theme, content }: GraceVerseProps) {
  const { t } = useLanguage();
  const p = gracePalette(theme);
  return (
    <GraceSection theme={theme} id="verse" className="text-center">
      <Cross stroke={p.accent} className="mx-auto h-10 w-auto" />
      <h2 className="mt-4 text-2xl" style={{ color: p.accent }}>{t("grace.verse.stub")}</h2>
      {content?.text ? <p className="mt-3 whitespace-pre-line break-words">{content.text}</p> : null}
    </GraceSection>
  );
}

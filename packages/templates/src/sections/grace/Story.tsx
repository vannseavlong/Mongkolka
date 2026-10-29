"use client";

// STUB: replaced by Web-grace-verse-story
import { GraceSection, Cross, gracePalette } from "./shared";
import { useLanguage } from "../../i18n";
import type { StoryContent, Theme } from "../../types";

export interface GraceStoryProps {
  theme: Theme;
  content?: StoryContent;
}

export function GraceStory({ theme, content }: GraceStoryProps) {
  const { t } = useLanguage();
  const p = gracePalette(theme);
  return (
    <GraceSection theme={theme} id="story" className="text-center">
      <Cross stroke={p.accent} className="mx-auto h-10 w-auto" />
      <h2 className="mt-4 text-2xl" style={{ color: p.accent }}>{t("grace.story.stub")}</h2>
      {content?.loveStory ? <p className="mt-3 whitespace-pre-line break-words">{content.loveStory}</p> : null}
    </GraceSection>
  );
}

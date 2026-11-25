"use client";

import type { StoryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { OrnateSection } from "../khmer/OrnateSection";
import { paragraphsOf } from "./story-logic";

export interface StorySkinProps {
  theme: Theme;
  content?: StoryContent;
}

/** The love story on the active skin's card: its frame and divider (the section heading already carries the mark). Empty story renders nothing. */
export function StorySkin({ theme, content }: StorySkinProps) {
  const { t } = useLanguage();
  const paragraphs = paragraphsOf(content?.loveStory);
  if (paragraphs.length === 0) return null;
  return (
    <OrnateSection theme={theme} id="story" heading={t("section.story.heading")}>
      <div className="mx-auto max-w-md">
        {paragraphs.map((p, i) => (
          <p key={i} className="m-0 mb-4 whitespace-pre-line break-words text-[15px] leading-[1.95] last:mb-0">
            {p}
          </p>
        ))}
      </div>
    </OrnateSection>
  );
}

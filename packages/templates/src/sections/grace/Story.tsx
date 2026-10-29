"use client";

import { GraceSection, Cross, GoldDivider, FoilText, Reveal, gracePalette, nameFont } from "./shared";
import { useLanguage } from "../../i18n";
import type { StoryContent, Theme } from "../../types";

export interface GraceStoryProps {
  theme: Theme;
  content?: StoryContent;
}

const DROPCAP_CSS =
  '.grace-story-p[data-first="1"]::first-letter{float:left;font-size:2.9em;line-height:0.8;padding:0.06em 0.1em 0 0;color:var(--grace-story-accent)}';

/** "Our story" in a white card with a thin gold border. Empty story renders nothing. */
export function GraceStory({ theme, content }: GraceStoryProps) {
  const { t, language } = useLanguage();
  const text = content?.loveStory?.replace(/\r\n?/g, "\n").trim();
  if (!text) return null;
  const p = gracePalette(theme);
  const kh = language === "kh";
  const short = text.length < 260 && !text.includes("\n");
  // Plain React text nodes only (no HTML injection); single newlines kept by whitespace-pre-line.
  const paragraphs = text.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);

  return (
    <GraceSection theme={theme} id="story" maxWidth="max-w-3xl">
      <style>{DROPCAP_CSS}</style>
      <Reveal>
        <div
          className="relative rounded-2xl px-6 py-12 text-center sm:px-14 sm:py-16"
          style={{
            backgroundColor: p.card,
            border: `1px solid ${p.accent}`,
            boxShadow: `0 0 0 5px ${p.card}, 0 0 0 6px ${p.foilLight}, 0 18px 40px -24px ${p.blush}`,
          }}
        >
          <Cross stroke={p.accent} className="mx-auto h-8 w-auto" strokeWidth={3} />
          <h2 className="mt-4 text-4xl leading-tight sm:text-5xl" style={{ fontFamily: nameFont(language), color: p.accent }}>
            <FoilText theme={theme}>{t("grace.story.title")}</FoilText>
          </h2>
          <GoldDivider theme={theme} mark="diamond" className="mt-5 max-w-[12rem]" />
          <div
            className={`mx-auto mt-8 max-w-[60ch] space-y-5 ${short ? "text-center" : "text-left"} text-base sm:text-lg`}
            style={{ color: p.text, lineHeight: kh ? 2 : 1.85, ["--grace-story-accent" as string]: p.accent }}
          >
            {paragraphs.map((para, i) => (
              <p
                key={i}
                data-first={i === 0 && !kh && !short && /^\p{L}/u.test(para) ? "1" : undefined}
                className="grace-story-p whitespace-pre-line break-words"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </GraceSection>
  );
}

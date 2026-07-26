import type { StoryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";

export interface StoryClassicProps {
  theme: Theme;
  content?: StoryContent;
}

export function StoryClassic({ theme, content }: StoryClassicProps) {
  const { t } = useLanguage();
  if (!content?.loveStory) return null;

  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20 text-center"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <h2 className="mb-6 text-2xl font-medium" style={{ color: theme.accent_color }}>
        {t("section.story.heading")}
      </h2>
      <p className="whitespace-pre-line leading-relaxed opacity-90">{content.loveStory}</p>
    </section>
  );
}

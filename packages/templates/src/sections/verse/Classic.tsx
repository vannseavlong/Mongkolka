import type { Theme, VerseContent } from "../../types";
import { useLanguage } from "../../i18n";
import { verseView } from "../../verse-view";

export interface VerseClassicProps {
  theme: Theme;
  content?: VerseContent;
}

export function VerseClassic({ theme, content }: VerseClassicProps) {
  const { language } = useLanguage();
  const { text, reference } = verseView(content, language);
  if (!text) return null;

  return (
    <section
      className="mx-auto max-w-2xl px-6 py-16 text-center"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <figure className="m-0">
        <blockquote className="m-0 whitespace-pre-line break-words text-lg italic leading-relaxed [overflow-wrap:anywhere]">
          {text}
        </blockquote>
        {reference ? (
          <figcaption className="mt-4 break-words text-sm font-medium tracking-wide [overflow-wrap:anywhere]">
            <span
              aria-hidden="true"
              className="mx-auto mb-3 block h-px w-10"
              style={{ backgroundColor: theme.accent_color }}
            />
            <cite className="not-italic">{reference}</cite>
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}

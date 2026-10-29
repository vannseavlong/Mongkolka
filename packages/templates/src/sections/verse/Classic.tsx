import type { Theme, VerseContent } from "../../types";
import { useLanguage } from "../../i18n";

export interface VerseClassicProps {
  theme: Theme;
  content?: VerseContent;
}

export function VerseClassic({ theme, content }: VerseClassicProps) {
  const { language } = useLanguage();
  const text = language === "kh" && content?.textKh ? content.textKh : content?.text;
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
      <blockquote className="whitespace-pre-line text-lg italic leading-relaxed opacity-90">{text}</blockquote>
      {content?.reference ? (
        <p className="mt-4 text-sm font-medium tracking-wide" style={{ color: theme.accent_color }}>
          {content.reference}
        </p>
      ) : null}
    </section>
  );
}

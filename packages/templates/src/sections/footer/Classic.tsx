import type { CoupleInfo, FooterContent, Theme } from "../../types";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { useLanguage } from "../../i18n";

export interface FooterClassicProps {
  theme: Theme;
  couple?: CoupleInfo;
  content?: FooterContent;
}

export function FooterClassic({ theme, couple, content }: FooterClassicProps) {
  const { t, language } = useLanguage();
  const names = couple?.partner1Name ? formatCoupleNames(couple) : "";
  const date = formatWeddingDate(couple?.weddingDate, language);
  if (!names && !date && !content?.message && !content?.hashtag) return null;

  return (
    <footer
      className="px-6 py-14 text-center"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <div className="mx-auto max-w-xl [overflow-wrap:anywhere]">
        <span
          aria-hidden="true"
          className="mx-auto mb-4 block h-px w-10"
          style={{ backgroundColor: theme.accent_color }}
        />
        <p className="mb-3 text-xs uppercase tracking-[0.25em]">{t("section.footer.together")}</p>
        {names ? <p className="break-words text-2xl font-medium">{names}</p> : null}
        {date ? <p className="mt-2 text-sm">{date}</p> : null}
        {content?.message ? (
          <p className="mt-5 whitespace-pre-line break-words leading-relaxed">{content.message}</p>
        ) : null}
        {content?.hashtag ? <p className="mt-4 break-words text-sm font-medium">{content.hashtag}</p> : null}
      </div>
    </footer>
  );
}

import type { CoupleInfo, FooterContent, Theme } from "../../types";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { useLanguage } from "../../i18n";

export interface FooterClassicProps {
  theme: Theme;
  couple?: CoupleInfo;
  content?: FooterContent;
}

export function FooterClassic({ theme, couple, content }: FooterClassicProps) {
  const { t } = useLanguage();
  const names = couple?.partner1Name ? formatCoupleNames(couple) : "";
  const date = formatWeddingDate(couple?.weddingDate);
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
      <div className="mx-auto max-w-xl">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] opacity-70" style={{ color: theme.accent_color }}>
          {t("section.footer.together")}
        </p>
        {names ? <p className="text-2xl font-medium">{names}</p> : null}
        {date ? <p className="mt-2 text-sm opacity-80">{date}</p> : null}
        {content?.message ? (
          <p className="mt-5 whitespace-pre-line leading-relaxed opacity-90">{content.message}</p>
        ) : null}
        {content?.hashtag ? (
          <p className="mt-4 text-sm font-medium" style={{ color: theme.accent_color }}>
            {content.hashtag}
          </p>
        ) : null}
      </div>
    </footer>
  );
}

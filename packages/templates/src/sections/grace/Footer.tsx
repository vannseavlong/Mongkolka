"use client";

import { GraceSection, Cross, Reveal, gracePalette, nameFont } from "./shared";
import { useLanguage } from "../../i18n";
import type { CoupleInfo, FooterContent, Theme } from "../../types";
import { formatWeddingDate } from "../../format";

export interface GraceFooterProps {
  theme: Theme;
  couple?: CoupleInfo;
  content?: FooterContent;
  /**
   * Optional main-site URL. When set, the "Made with Mongkolka" credit links to it; when unset it is plain text.
   * The consuming app (apps/web) supplies it from its own env; this package stays env-free.
   */
  brandUrl?: string;
}

export function GraceFooter({
  theme,
  couple,
  content,
  brandUrl,
}: GraceFooterProps) {
  const { t, language } = useLanguage();
  const p = gracePalette(theme);
  const kh = language === "kh";
  const n1 = couple?.partner1Name?.trim() ?? "";
  const n2 = couple?.partner2Name?.trim() ?? "";
  const date = formatWeddingDate(couple?.weddingDate, language);
  const font = nameFont(language);
  const hasBody = !!(n1 || date || content?.message || content?.hashtag);
  if (!hasBody && !brandUrl) return null;
  const credit = brandUrl ? (
    <a href={brandUrl} rel="noopener" className="underline underline-offset-2">
      {t("grace.footer.credit")}
    </a>
  ) : (
    t("grace.footer.credit")
  );

  return (
    <GraceSection
      theme={theme}
      id="footer"
      maxWidth="max-w-xl"
      className="text-center"
    >
      <Reveal>
        <div className="[overflow-wrap:anywhere]">
          {hasBody ? (
            <>
              <Cross
                spray
                stroke={p.accent}
                className="mx-auto h-16 w-auto"
                strokeWidth={2}
              />
              <p
                className="mt-6 text-xs font-medium"
                style={{
                  color: p.accent,
                  letterSpacing: kh ? undefined : "0.25em",
                  textTransform: kh ? undefined : "uppercase",
                }}
              >
                {t("grace.footer.together")}
              </p>
              {n1 ? (
                <p
                  className="mt-4 break-words text-5xl leading-tight sm:text-6xl"
                  style={{ fontFamily: font, color: p.text }}
                >
                  {n1}
                  {n2 ? (
                    <>
                      <span className="mx-2" style={{ color: p.accent }}>
                        &amp;
                      </span>
                      {n2}
                    </>
                  ) : null}
                </p>
              ) : null}
              {date ? (
                <p className="mt-4 text-base" style={{ color: p.text }}>
                  {date}
                </p>
              ) : null}
              {content?.message ? (
                <p
                  className="mx-auto mt-8 max-w-md whitespace-pre-line break-words leading-relaxed"
                  style={{ color: p.text, textWrap: "balance" }}
                >
                  {content.message}
                </p>
              ) : null}
              {content?.hashtag ? (
                <p
                  className="mt-6 break-words text-base font-medium"
                  style={{ color: p.accent }}
                >
                  {content.hashtag}
                </p>
              ) : null}
            </>
          ) : null}
          <div
            aria-hidden
            className={`mx-auto h-px w-16 ${hasBody ? "mt-10" : ""}`}
            style={{
              backgroundColor: p.accent,
              backgroundImage: `linear-gradient(90deg, transparent, ${p.foilLight}, transparent)`,
            }}
          />
          <p className="mt-5 text-xs" style={{ color: p.muted }}>
            {credit}
          </p>
        </div>
      </Reveal>
    </GraceSection>
  );
}

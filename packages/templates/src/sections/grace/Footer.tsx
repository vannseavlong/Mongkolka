"use client";

import { GraceSection, Cross, Reveal, gracePalette, nameFont } from "./shared";
import { useLanguage } from "../../i18n";
import type { CoupleInfo, FooterContent, Theme } from "../../types";
import { formatWeddingDate } from "../../format";

export interface GraceFooterProps {
  theme: Theme;
  couple?: CoupleInfo;
  content?: FooterContent;
}

const BRAND_URL = "https://mongkolka.com";

export function GraceFooter({ theme, couple, content }: GraceFooterProps) {
  const { t, language } = useLanguage();
  const p = gracePalette(theme);
  const kh = language === "kh";
  const n1 = couple?.partner1Name?.trim() ?? "";
  const n2 = couple?.partner2Name?.trim() ?? "";
  const date = formatWeddingDate(couple?.weddingDate, language);
  const font = nameFont(language);

  return (
    <GraceSection theme={theme} id="footer" maxWidth="max-w-xl" className="text-center">
      <Reveal>
        <footer className="[overflow-wrap:anywhere]">
          <Cross spray stroke={p.accent} className="mx-auto h-16 w-auto" strokeWidth={2} />
          <p
            className="mt-6 text-xs font-medium"
            style={{ color: p.accent, letterSpacing: kh ? undefined : "0.25em", textTransform: kh ? undefined : "uppercase" }}
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
                  <span className="mx-2" style={{ color: p.accent }}>&amp;</span>
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
            <p className="mx-auto mt-8 max-w-md whitespace-pre-line break-words leading-relaxed" style={{ color: p.text, textWrap: "balance" }}>
              {content.message}
            </p>
          ) : null}
          {content?.hashtag ? (
            <p className="mt-6 break-words text-base font-medium" style={{ color: p.accent }}>
              {content.hashtag}
            </p>
          ) : null}
          <div
            aria-hidden
            className="mx-auto mt-10 h-px w-16"
            style={{ backgroundColor: p.accent, backgroundImage: `linear-gradient(90deg, transparent, ${p.foilLight}, transparent)` }}
          />
          <p className="mt-5 text-xs" style={{ color: p.muted }}>
            <a href={BRAND_URL} rel="noopener" className="underline underline-offset-2">
              {t("grace.footer.credit")}
            </a>
          </p>
        </footer>
      </Reveal>
    </GraceSection>
  );
}

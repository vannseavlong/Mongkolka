"use client";

import type { CoupleInfo, FooterContent, Theme } from "../../types";
import { formatWeddingDate } from "../../format";
import { useLanguage } from "../../i18n";
import { withAlpha } from "../../chrome/gold";
import { OrnateSection } from "../khmer/OrnateSection";
import { useSkinOrnaments } from "../khmer/skin-context";
import { monogramOf } from "../khmer/skin-logic";
import { footerHasBody, namesLine } from "./footer-logic";
import { useSkinUi } from "./skin-ui-context";

export interface FooterSkinProps {
  theme: Theme;
  couple?: CoupleInfo;
  content?: FooterContent;
  /** Optional main-site URL for the credit link; supplied by the consuming app (this package stays env-free). */
  brandUrl?: string;
}

/**
 * The closing note on the active skin's own ground: its scene backdrop, crest with the couple's
 * monogram, names in the skin's heading style, its divider, then the date, message and hashtag.
 */
export function FooterSkin({ theme, couple, content, brandUrl }: FooterSkinProps) {
  const { t, language } = useLanguage();
  const sk = useSkinOrnaments();
  const ui = useSkinUi();
  const date = formatWeddingDate(couple?.weddingDate, language);
  const names = namesLine(couple);
  const hasBody = footerHasBody(couple, content, date);
  if (!hasBody && !brandUrl) return null;
  const message = content?.message?.trim();
  const hashtag = content?.hashtag?.trim();
  const credit = brandUrl ? (
    <a href={brandUrl} rel="noopener" className="underline underline-offset-2">
      {t("grace.footer.credit")}
    </a>
  ) : (
    t("grace.footer.credit")
  );

  return (
    <OrnateSection theme={theme} id="footer">
      <footer className="[overflow-wrap:anywhere]">
        {hasBody && (
          <>
            {couple?.partner1Name ? (
              <div className="mx-auto w-fit" aria-hidden>
                <sk.Crest color={theme.accent_color} ground={theme.bg_color} label={monogramOf(couple)} size={96} />
              </div>
            ) : (
              <div className="mx-auto w-fit" aria-hidden>
                <ui.Mark color={theme.accent_color} size={52} />
              </div>
            )}
            <p className="m-0 mt-5 text-xs font-semibold" style={{ color: theme.accent_color, letterSpacing: language === "kh" ? undefined : "0.24em", textTransform: language === "kh" ? undefined : "uppercase" }}>
              {t("section.footer.together")}
            </p>
            {names && (
              <p className="m-0 mt-3 break-words text-2xl sm:text-3xl" style={sk.heading(theme, language)}>
                {names}
              </p>
            )}
            <div className="mt-4">
              <sk.Divider color={theme.accent_color} />
            </div>
            {date && <p className="m-0 mt-4 text-[15px]">{date}</p>}
            {message && (
              <p className="mx-auto m-0 mt-5 max-w-md whitespace-pre-line break-words text-[15px] leading-relaxed" style={{ textWrap: "balance" }}>
                {message}
              </p>
            )}
            {hashtag && (
              <p className="m-0 mt-4 break-words text-sm font-semibold" style={{ color: theme.accent_color }}>
                {hashtag}
              </p>
            )}
          </>
        )}
        <p className={`m-0 text-xs ${hasBody ? "mt-8" : ""}`} style={{ color: withAlpha(theme.text_color, 0.6) }}>
          {credit}
        </p>
      </footer>
    </OrnateSection>
  );
}

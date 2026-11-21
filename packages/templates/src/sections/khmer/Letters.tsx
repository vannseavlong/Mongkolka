"use client";

import type { CoupleInfo, LettersContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { pickLang } from "./skin-logic";
import { GoldRule, StubSection } from "./stub-parts";

export interface LettersKhmerProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: LettersContent;
}

/** PLACEHOLDER (Web-khmer-core-sections builds the real letters): gratitude then apology, each only if written. */
export function LettersKhmer({ theme, content }: LettersKhmerProps) {
  const { t, language } = useLanguage();
  const gratitude = pickLang(language, content?.gratitudeKh, content?.gratitudeEn);
  const apology = pickLang(language, content?.apologyKh, content?.apologyEn);
  if (!gratitude && !apology) return null;

  return (
    <StubSection theme={theme} id="letters">
      {gratitude && (
        <>
          <h2 className="m-0 text-lg" style={{ color: theme.accent_color }}>
            {t("khmer.letters.gratitude")}
          </h2>
          <p className="mb-0 mt-4 whitespace-pre-line text-sm leading-loose">{gratitude}</p>
        </>
      )}
      {gratitude && apology && <GoldRule accent={theme.accent_color} />}
      {apology && (
        <>
          <h2 className="m-0 text-lg" style={{ color: theme.accent_color }}>
            {t("khmer.letters.apology")}
          </h2>
          <p className="mb-0 mt-4 whitespace-pre-line text-sm leading-loose">{apology}</p>
        </>
      )}
    </StubSection>
  );
}

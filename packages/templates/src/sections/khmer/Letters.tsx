"use client";

import type { CoupleInfo, LettersContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { OrnateSection } from "./OrnateSection";
import { orderedLanguages } from "./lineage";
import { textFor, type KhmerStringKey } from "./strings";

export interface LettersKhmerProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: LettersContent;
}

const paragraphs = (text: string) => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

function Letter({
  id,
  headingKey,
  kh,
  en,
  theme,
}: {
  id: string;
  headingKey: KhmerStringKey;
  kh?: string;
  en?: string;
  theme: Theme;
}) {
  const { t, language } = useLanguage();
  const text = { kh: kh?.trim() ?? "", en: en?.trim() ?? "" };
  const langs = orderedLanguages(language, { kh: Boolean(text.kh), en: Boolean(text.en) });
  if (langs.length === 0) return null;
  return (
    <OrnateSection theme={theme} id={id} heading={t(headingKey)}>
      <div className="space-y-8 text-[15px] leading-loose">
        {langs.map((lang, i) => (
          <div key={lang} lang={lang === "kh" ? "km" : "en"} className={i > 0 ? "text-[14px] opacity-85" : ""}>
            {i > 0 && <p className="m-0 mb-3 text-xs font-semibold opacity-80">{textFor(lang, headingKey)}</p>}
            {paragraphs(text[lang]).map((p, j) => (
              <p key={j} className="m-0 mb-4 whitespace-pre-line last:mb-0">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </OrnateSection>
  );
}

/** Gratitude then apology, each its own ornate card, each shown only if the couple wrote it. */
export function LettersKhmer({ theme, content, couple }: LettersKhmerProps) {
  const gratitude = Boolean(content?.gratitudeKh?.trim() || content?.gratitudeEn?.trim());
  const apology = Boolean(content?.apologyKh?.trim() || content?.apologyEn?.trim());
  if (!gratitude && !apology) return null;
  void couple;
  return (
    <>
      <Letter id="letters" headingKey="khmer.letters.gratitude" kh={content?.gratitudeKh} en={content?.gratitudeEn} theme={theme} />
      <Letter id="letters-apology" headingKey="khmer.letters.apology" kh={content?.apologyKh} en={content?.apologyEn} theme={theme} />
    </>
  );
}

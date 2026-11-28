"use client";

import type { ReactNode } from "react";
import type { CoupleInfo, LettersContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { goldStops, withAlpha } from "../../chrome/gold";
import { LetterFrame, LetterLotus } from "./letter-frame";
import { Blossom, Cross } from "./cross";
import { COVENANT_CSS } from "./covenant-styles";
import { hasKhmer } from "./intro-logic";
import { coupleNamesFor, joinNames } from "./names";
import { PINK } from "./palette";
import { letterView } from "./text-logic";

const SCRIPT = 'var(--font-script), "Great Vibes", cursive';

export interface CovenantLettersProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: LettersContent;
}

function Shell({ theme, children }: { theme: Theme; children: ReactNode }) {
  const { language } = useLanguage();
  return (
    <section id="letters" data-mk-lang={language} className="px-4 py-14 sm:px-6" style={{ backgroundColor: theme.bg_color, color: theme.text_color, fontFamily: KHMER_BODY_FONT }}>
      <style href="mk-covenant-css" precedence="mk-covenant">
        {COVENANT_CSS}
      </style>
      {children}
    </section>
  );
}

function Paras({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <>
      {items.map((p, i) => (
        <p key={i} className={`m-0 mb-4 whitespace-pre-line break-words last:mb-0 ${className}`} style={{ overflowWrap: "anywhere" }}>
          {p}
        </p>
      ))}
    </>
  );
}

/** The couple's names in script (or Moul for Khmer names), used as the signature. */
function Signature({ couple, theme }: { couple: CoupleInfo; theme: Theme }) {
  const { language } = useLanguage();
  const names = joinNames(coupleNamesFor(couple, language));
  if (!names) return null;
  const kh = hasKhmer(names);
  return (
    <p className="m-0 mt-5 break-words" style={{ color: theme.accent_color, fontFamily: kh ? MOUL_FONT : SCRIPT, fontSize: kh ? "1rem" : "2rem", lineHeight: kh ? 1.9 : 1.2 }}>
      {names}
    </p>
  );
}

function useLetters(content?: LettersContent) {
  const { t, language } = useLanguage();
  const view = letterView(content, language, t("covenant.letters.defaultThanks"), t("covenant.letters.defaultApology"));
  return { t, view, heading: t("covenant.letters.heading"), apologyHeading: t("covenant.letters.apologyHeading") };
}

/** One letter: a Moul (or script) heading, the lotus, then the words, centred. */
function Letter({ heading, items, theme }: { heading: string; items: string[]; theme: Theme }) {
  const kh = hasKhmer(heading);
  return (
    <div className="text-center">
      <h2 className="m-0 break-words" style={{ color: theme.accent_color, fontFamily: kh ? MOUL_FONT : SCRIPT, fontSize: kh ? "1.15rem" : "2.2rem", lineHeight: kh ? 2 : 1.2 }}>
        {heading}
      </h2>
      <LetterLotus color={theme.accent_color} />
      <div className="text-[15px] leading-loose">
        <Paras items={items} />
      </div>
    </div>
  );
}

/** Paper: both letters on one card, like a printed invitation: the thank-you above the apology inside a notched double frame. */
export function CovenantLettersPaper({ theme, content }: CovenantLettersProps) {
  const { view, heading, apologyHeading } = useLetters(content);
  const g = goldStops(theme.accent_color);
  return (
    <Shell theme={theme}>
      <article className="mx-auto max-w-md p-3" style={{ backgroundColor: "#fffaf7", color: "#4a3238", borderRadius: 8, boxShadow: "0 24px 38px -22px rgba(70,40,40,.45)" }}>
        <LetterFrame color={g.mid}>
          <Letter theme={theme} heading={heading} items={view.thanks} />
          {view.apology.length > 0 && (
            <div className="mt-9">
              <Letter theme={theme} heading={apologyHeading} items={view.apology} />
            </div>
          )}
        </LetterFrame>
      </article>
    </Shell>
  );
}

/** Arch: an arched gold frame with a small cross at the top, the letter centred, blossoms at the foot. */
export function CovenantLettersArch({ couple, theme, content }: CovenantLettersProps) {
  const { view, heading, apologyHeading } = useLetters(content);
  const g = goldStops(theme.accent_color);
  return (
    <Shell theme={theme}>
      <div className="mx-auto max-w-md p-[4px]" style={{ borderRadius: "999px 999px 24px 24px", background: `linear-gradient(160deg, ${g.hi}, ${g.mid} 50%, ${g.lo})`, boxShadow: "0 26px 40px -24px rgba(90,40,60,.55)" }}>
        <div className="px-6 pb-9 pt-12 text-center" style={{ borderRadius: "999px 999px 20px 20px", backgroundColor: "#ffffff", boxShadow: `inset 0 0 0 6px #fff, inset 0 0 0 7px ${withAlpha(g.mid, 0.6)}` }}>
          <div className="mx-auto w-fit">
            <Cross color={theme.accent_color} size={44} />
          </div>
          <h2 className="m-0 mt-4 text-xl font-semibold" style={{ color: theme.accent_color, fontFamily: hasKhmer(heading) ? MOUL_FONT : undefined, lineHeight: 1.8 }}>
            {heading}
          </h2>
          <div className="mt-3 text-[15px] leading-loose" style={{ color: "#3d2a31" }}>
            <Paras items={view.thanks} />
          </div>
          <Signature couple={couple} theme={theme} />
          {view.apology.length > 0 && (
            <div className="mt-6 border-t pt-5 text-[14px] leading-relaxed" style={{ borderColor: withAlpha(theme.accent_color, 0.3), color: "#3d2a31" }}>
              <p className="m-0 mb-2 text-sm font-semibold" style={{ color: theme.accent_color }}>
                {apologyHeading}
              </p>
              <Paras items={view.apology} />
            </div>
          )}
          <svg aria-hidden className="mx-auto mt-6" width="96" height="24" viewBox="-48 -12 96 24">
            <Blossom x={-26} y={0} r={8} petal={PINK.petal} centre={theme.accent_color} />
            <Blossom x={0} y={0} r={10} petal={PINK.rose} centre={theme.accent_color} />
            <Blossom x={26} y={0} r={8} petal={PINK.petal} centre={theme.accent_color} />
          </svg>
        </div>
      </div>
    </Shell>
  );
}

/** Script: no card. A large script "Thank you" between two gold rules, the words in soft type, the signature below. */
export function CovenantLettersScript({ couple, theme, content }: CovenantLettersProps) {
  const { view, heading, apologyHeading } = useLetters(content);
  const g = goldStops(theme.accent_color);
  const rule = (flip: boolean) => <i className="h-px flex-1" style={{ background: `linear-gradient(${flip ? 270 : 90}deg, transparent, ${g.mid})` }} />;
  const kh = hasKhmer(heading);
  return (
    <Shell theme={theme}>
      <div className="mx-auto max-w-xl text-center">
        <div className="flex items-center gap-4" aria-hidden>
          {rule(false)}
          <Cross color={theme.accent_color} size={34} />
          {rule(true)}
        </div>
        <h2 className="m-0 my-5" style={{ color: theme.accent_color, fontFamily: kh ? MOUL_FONT : SCRIPT, fontSize: kh ? "1.6rem" : "3.2rem", lineHeight: kh ? 1.9 : 1.15 }}>
          {heading}
        </h2>
        <div className="text-[16px] leading-loose">
          <Paras items={view.thanks} />
        </div>
        <Signature couple={couple} theme={theme} />
        {view.apology.length > 0 && (
          <div className="mt-8 text-[14px] leading-relaxed opacity-90">
            <p className="m-0 mb-2 text-sm font-semibold" style={{ color: theme.accent_color }}>
              {apologyHeading}
            </p>
            <Paras items={view.apology} />
          </div>
        )}
      </div>
    </Shell>
  );
}

"use client";

import type { CSSProperties, ReactNode } from "react";
import type { CoupleInfo, LettersContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { goldStops, withAlpha } from "../../chrome/gold";
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
  const view = letterView(content, language, t("covenant.letters.defaultThanks"));
  return { t, view, heading: t("covenant.letters.heading"), apologyHeading: t("covenant.letters.apologyHeading") };
}

const hairline = (theme: Theme): CSSProperties => ({ border: `1px solid ${withAlpha(theme.accent_color, 0.4)}` });

/** Paper: stationery with faint ruled lines, a strip of tape, the letter, and the couple's signature. A second note sits below as a small card. */
export function CovenantLettersPaper({ couple, theme, content }: CovenantLettersProps) {
  const { view, heading, apologyHeading } = useLetters(content);
  const g = goldStops(theme.accent_color);
  const ruled = `repeating-linear-gradient(180deg, transparent 0 31px, ${withAlpha(theme.accent_color, 0.12)} 31px 32px)`;
  return (
    <Shell theme={theme}>
      <div className="relative mx-auto max-w-xl" style={{ transform: "rotate(-.6deg)" }}>
        <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-1" style={{ background: withAlpha(g.mid, 0.3) }} />
        <article className="px-6 pb-8 pt-10 text-left sm:px-10" style={{ backgroundColor: "#fffdf8", backgroundImage: ruled, boxShadow: "0 24px 38px -22px rgba(70,40,40,.55)", ...hairline(theme), lineHeight: "32px", fontSize: 16 }}>
          <h2 className="m-0 mb-4 text-center" style={{ color: theme.accent_color, fontFamily: SCRIPT, fontSize: "2.4rem", lineHeight: 1.2 }}>
            {heading}
          </h2>
          <Paras items={view.thanks} />
          <div className="text-right">
            <Signature couple={couple} theme={theme} />
          </div>
        </article>
      </div>
      {view.apology.length > 0 && (
        <div className="mx-auto mt-8 max-w-md rounded-2xl p-5 text-left text-[15px] leading-relaxed" style={{ backgroundColor: "#fff", ...hairline(theme) }}>
          <p className="m-0 mb-2 text-sm font-semibold" style={{ color: theme.accent_color }}>
            {apologyHeading}
          </p>
          <Paras items={view.apology} />
        </div>
      )}
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

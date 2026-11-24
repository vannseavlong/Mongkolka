"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { CINZEL_FONT, KHMER_BODY_FONT } from "../../chrome/fonts";
import { goldStops, mixHex } from "../../chrome/gold";
import { hasKhmer } from "../covenant/intro-logic";
import { ENVELOPE_CSS, typeDelay } from "./envelope-styles";
import { KHMER_DISPLAY_FONT, SCRIPT_FONT, useHeroText } from "./hero-text";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export interface HeroEnvelopeProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

const TEXT = {
  en: { label: "The wedding of", support: "Request the honour of your presence", cue: "Scroll", open: "Wedding invitation" },
  kh: { label: "អាពាហ៍ពិពាហ៍", support: "សូមគោរពអញ្ជើញចូលរួមពិធីមង្គលការ", cue: "អូសចុះក្រោម", open: "សំបុត្រអញ្ជើញ" },
} as const;

/**
 * Envelope: a calm cinematic sequence in one art-directed composition. The scene settles, an ivory envelope
 * arrives, its flap opens, and the invitation card (your hero banner on top, then the names and date) rises out
 * and comes forward. It plays once when the hero is on screen and ends in a stable layout; reduced motion shows
 * that final layout at once. The stages and timings live in envelope-logic.ts.
 */
export function HeroEnvelope({ couple, theme, content }: HeroEnvelopeProps) {
  const { first, second, date, kh } = useHeroText(couple);
  const text = TEXT[kh ? "kh" : "en"];
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (inView || reduce) setGo(true);
  }, [inView, reduce]);

  const g = goldStops(theme.accent_color);
  const a = theme.accent_color;
  const photo = content?.coverPhotoUrl;
  const face = (n: string) => (hasKhmer(n) ? KHMER_DISPLAY_FONT : SCRIPT_FONT);
  const small = kh ? KHMER_BODY_FONT : CINZEL_FONT;
  const track = (em: string) => (kh ? "normal" : em);

  const vars: Vars = {
    "--ew": "min(78vw, 46svh, 520px)",
    "--cw": "calc(var(--ew) * .72)",
    "--bg1": mixHex(theme.bg_color, "#fffaf2", 45),
    "--bg2": mixHex(theme.bg_color, "#e6d8c8", 55),
    "--pp1": mixHex("#f8f1e7", a, 95),
    "--pp2": mixHex("#f1e6d8", a, 94),
    "--pp3": mixHex("#ebdfd0", a, 94),
    "--pp4": mixHex("#e3d5c3", a, 93),
    "--fp1": mixHex("#faf4eb", a, 95),
    "--fp2": mixHex("#eee1d1", a, 94),
    "--in1": mixHex("#e0d0bb", a, 90),
    "--in2": mixHex("#d3c1a9", a, 88),
    "--cd1": "#fffdf9",
    "--cd2": "#f6efe5",
    "--foil": g.mid,
    "--foil-hi": g.hi,
    "--foil-lo": g.lo,
    "--foil-ink": mixHex(g.lo, "#000000", 55),
    "--ink": theme.text_color,
    "--seal-font": CINZEL_FONT,
  };

  const t = (i: number): Vars => ({ "--d": typeDelay(i) });

  return (
    <section ref={ref} className="he2" data-go={go ? "" : undefined} style={vars} aria-label={text.open}>
      <style href="mk-hero-envelope-css" precedence="mk-hero">
        {ENVELOPE_CSS}
      </style>
      <div aria-hidden className="he2-bg" />
      <div aria-hidden className="he2-light" />
      <div aria-hidden className="he2-grain" />
      <div aria-hidden className="he2-vig" />

      <div className="he2-stage">
        <div aria-hidden className="he2-shadow" />
        <div aria-hidden className="he2-back" />

        <div className="he2-card">
          <div className="he2-card-in">
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="he2-photo" src={photo} alt="" />
            )}
            <div className="he2-text">
              <p className="he2-t m-0 uppercase" style={{ ...t(0), fontFamily: small, color: g.mid, fontSize: "calc(var(--cw) * .034)", letterSpacing: track("0.32em"), lineHeight: 1.7 }}>
                {text.label}
              </p>
              <h1 className="he2-t m-0 flex flex-col items-center leading-none" style={t(1)}>
                <span style={{ fontFamily: face(first), fontSize: hasKhmer(first) ? "calc(var(--cw) * .062)" : "calc(var(--cw) * .135)", lineHeight: hasKhmer(first) ? 1.6 : 1.08 }}>{first}</span>
                {second && (
                  <>
                    <span style={{ fontFamily: SCRIPT_FONT, fontSize: "calc(var(--cw) * .07)", color: g.mid, lineHeight: 1.1 }}>&amp;</span>
                    <span style={{ fontFamily: face(second), fontSize: hasKhmer(second) ? "calc(var(--cw) * .062)" : "calc(var(--cw) * .135)", lineHeight: hasKhmer(second) ? 1.6 : 1.08 }}>{second}</span>
                  </>
                )}
              </h1>
              <span className="he2-t he2-rule flex w-[46%] items-center gap-2" style={t(2)} aria-hidden>
                <i className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${g.mid})` }} />
                <b className="size-[5px] rotate-45" style={{ backgroundColor: g.mid }} />
                <i className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${g.mid})` }} />
              </span>
              {date && (
                <p className="he2-t m-0 uppercase" style={{ ...t(3), fontFamily: small, fontSize: "calc(var(--cw) * .04)", letterSpacing: track("0.24em"), lineHeight: 1.7 }}>
                  {date}
                </p>
              )}
              <p className="he2-t m-0 uppercase" style={{ ...t(4), fontFamily: small, fontSize: "calc(var(--cw) * .026)", letterSpacing: track("0.16em"), lineHeight: 1.8, opacity: 0.7 }}>
                {text.support}
              </p>
            </div>
          </div>
        </div>

        <div aria-hidden className="he2-pocket">
          <i className="he2-l" />
          <i className="he2-r" />
          <i className="he2-b" />
        </div>
        <div aria-hidden className="he2-flap-shadow" />
        <div aria-hidden className="he2-flap">
          <i className="out" />
          <i className="in" />
        </div>
        <div aria-hidden className="he2-seal">
          {Array.from(first)[0]?.toLocaleUpperCase()}
        </div>
      </div>

      <button
        type="button"
        className="he2-cue"
        onClick={() => {
          const next = ref.current?.nextElementSibling;
          const behavior = reduce ? "auto" : "smooth";
          if (next) next.scrollIntoView({ behavior });
          else window.scrollBy({ top: window.innerHeight, behavior });
        }}
      >
        {text.cue}
        <i aria-hidden />
      </button>
    </section>
  );
}

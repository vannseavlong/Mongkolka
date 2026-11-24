"use client";

import type { CSSProperties } from "react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { goldStops, mixHex } from "../../chrome/gold";
import { hasKhmer } from "../covenant/intro-logic";
import { KHMER_DISPLAY_FONT, SCRIPT_FONT, useHeroText } from "./hero-text";
import { RevealScene } from "./reveal-scene";
import { useReveal } from "./reveal-hooks";
import { BOOK_TIMING } from "./reveal-logic";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export interface HeroBookProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

/**
 * Book: a closed hardcover with the couple's names in gold. The cover swings open on its spine, pages turn, and the
 * spread shows the names on the left and the hero photo on the right before the camera moves into the page.
 */
export function HeroBook({ couple, theme, content }: HeroBookProps) {
  const { ref, phase, open } = useReveal(BOOK_TIMING);
  const { first, second, date, kh } = useHeroText(couple);
  const g = goldStops(theme.accent_color);
  const photo = content?.coverPhotoUrl;
  const face = (n: string) => (hasKhmer(n) ? KHMER_DISPLAY_FONT : SCRIPT_FONT);
  const nameSize = (n: string) => (hasKhmer(n) ? "calc(var(--pw) * .1)" : "calc(var(--pw) * .21)");
  const foil: CSSProperties = { color: g.hi, textShadow: `0 1px 0 ${g.lo}` };

  const vars: Vars = {
    "--hr-a": mixHex(theme.bg_color, "#ffffff", 65),
    "--hr-b": theme.bg_color,
    "--hr-ink": theme.text_color,
    "--pw": "clamp(120px, min(40vw, 38svh), 330px)",
    "--b1": mixHex(theme.text_color, "#000000", 78),
    "--b2": mixHex(theme.text_color, "#ffffff", 80),
    "--b3": mixHex(theme.bg_color, "#ffffff", 60),
    "--b4": mixHex(theme.bg_color, "#000000", 90),
    "--b5": g.hi,
    "--b6": theme.text_color,
  };

  const names = (color: string, small = false) => (
    <div className="flex flex-col items-center leading-none" style={{ color }}>
      <span style={{ fontFamily: face(first), fontSize: nameSize(first), lineHeight: hasKhmer(first) ? 1.8 : 1.05 }}>{first}</span>
      {second && (
        <>
          <span style={{ fontFamily: SCRIPT_FONT, fontSize: small ? "calc(var(--pw) * .09)" : "calc(var(--pw) * .1)" }}>&amp;</span>
          <span style={{ fontFamily: face(second), fontSize: nameSize(second), lineHeight: hasKhmer(second) ? 1.8 : 1.05 }}>{second}</span>
        </>
      )}
    </div>
  );

  return (
    <section ref={ref} className="hr" data-phase={phase} style={vars}>
      <RevealScene couple={couple} theme={theme} content={content} sceneDelayMs={3600} />
      <div className="hr-prop">
        <div
          className="hb-stage"
          role="button"
          tabIndex={phase === "idle" ? 0 : -1}
          aria-label={kh ? "បើកសៀវភៅ" : "Open the book"}
          onClick={open}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open();
            }
          }}
        >
          <div className="hb-book">
            <div className="hb-page hb-left" />
            <div className="hb-page hb-right">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" />
              ) : (
                <div className="hb-fill" style={{ background: `linear-gradient(160deg, ${theme.bg_color}, ${theme.accent_color}66)` }} />
              )}
            </div>
            {[0.55, 0.8].map((ld) => (
              <i key={ld} aria-hidden className="hb-leaf" style={{ "--ld": `${ld}s` } as Vars} />
            ))}
            <div className="hb-cover">
              <div className="hb-face hb-front">
                <span style={{ ...foil, fontSize: "calc(var(--pw) * .06)", letterSpacing: "0.3em", textTransform: "uppercase" }}>{kh ? "អាពាហ៍ពិពាហ៍" : "Our wedding"}</span>
                {names(g.hi, true)}
                <span className="hb-orn" />
              </div>
              <div className="hb-face hb-back">
                <span className="hb-orn" style={{ opacity: 0.8 }} />
                {names(theme.text_color, true)}
                {date && <span style={{ color: g.mid, fontSize: "calc(var(--pw) * .055)", letterSpacing: kh ? "0.04em" : "0.22em", textTransform: "uppercase" }}>{date}</span>}
                <span className="hb-orn" style={{ opacity: 0.8 }} />
              </div>
            </div>
          </div>
        </div>
        <p className="hr-hint">{kh ? "ចុចដើម្បីបើក" : "Tap to open"}</p>
      </div>
    </section>
  );
}

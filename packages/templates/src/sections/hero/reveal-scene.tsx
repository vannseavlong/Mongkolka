"use client";

import type { CSSProperties } from "react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { hasKhmer } from "../covenant/intro-logic";
import { KHMER_DISPLAY_FONT, SCRIPT_FONT, useHeroText } from "./hero-text";
import { REVEAL_CSS } from "./reveal-styles";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** The hero the three reveal designs open onto: the banner drifting closer under a soft veil, with the names and date. */
export function RevealScene({ couple, theme, content, sceneDelayMs }: { couple: CoupleInfo; theme: Theme; content?: HeroContent; sceneDelayMs: number }) {
  const { first, second, date, kh } = useHeroText(couple);
  const photo = content?.coverPhotoUrl;
  const face = (n: string) => (hasKhmer(n) ? KHMER_DISPLAY_FONT : SCRIPT_FONT);
  const size = (n: string) => (hasKhmer(n) ? "clamp(1.8rem,8vw,3.6rem)" : "clamp(3.4rem,14vw,7rem)");

  return (
    <div className="hr-scene" style={{ "--sd": `${sceneDelayMs}ms` } as Vars}>
      <style href="mk-hero-reveal-css" precedence="mk-hero">
        {REVEAL_CSS}
      </style>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="hr-photo" src={photo} alt="" />
      ) : (
        <div className="hr-photo" style={{ background: `radial-gradient(80% 70% at 50% 40%, ${theme.bg_color}, ${theme.accent_color}66)` }} />
      )}
      <div className="hr-veil" style={{ opacity: photo ? 1 : 0 }} />
      <div className="hr-names" style={{ color: photo ? "#ffffff" : theme.text_color }}>
        <span className="hr-line" style={{ backgroundColor: theme.accent_color }} />
        <h1 className="m-0 flex flex-col items-center leading-none" style={{ textShadow: photo ? "0 2px 24px rgba(0,0,0,.45)" : undefined }}>
          <span style={{ fontFamily: face(first), fontSize: size(first), lineHeight: hasKhmer(first) ? 1.8 : 1.05 }}>{first}</span>
          {second && (
            <>
              <span style={{ fontFamily: SCRIPT_FONT, fontSize: "clamp(1.6rem,6vw,3rem)", color: theme.accent_color }}>&amp;</span>
              <span style={{ fontFamily: face(second), fontSize: size(second), lineHeight: hasKhmer(second) ? 1.8 : 1.05 }}>{second}</span>
            </>
          )}
        </h1>
        {date && (
          <p className="m-0 uppercase" style={{ letterSpacing: kh ? "0.05em" : "0.32em", fontSize: "clamp(.8rem,2.6vw,1.1rem)" }}>
            {date}
          </p>
        )}
      </div>
    </div>
  );
}

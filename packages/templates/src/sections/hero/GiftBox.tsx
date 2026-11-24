"use client";

import { useId, type CSSProperties } from "react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { goldStops, mixHex } from "../../chrome/gold";
import { unit } from "../covenant/intro-logic";
import { useHeroText } from "./hero-text";
import { RevealScene } from "./reveal-scene";
import { useReveal } from "./reveal-hooks";
import { confetti, GIFT_TIMING } from "./reveal-logic";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export interface HeroGiftBoxProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

const PIECES = confetti(26, unit);

/**
 * Gift box: a wrapped present sits on the soft ground. It shakes, the bow unties, the lid flies off in a burst of
 * light and confetti, and the hero rises out of it like a surprise. Tap to open, or it opens by itself.
 */
export function HeroGiftBox({ couple, theme, content }: HeroGiftBoxProps) {
  const { ref, phase, open } = useReveal(GIFT_TIMING);
  const { kh } = useHeroText(couple);
  const id = useId();
  const g = goldStops(theme.accent_color);
  const body = mixHex(theme.accent_color, "#1c0d12", 62);
  const lid = mixHex(theme.accent_color, "#1c0d12", 82);
  const ribbon = g.hi;
  const confettiTones = [g.hi, g.mid, "#ffffff", "#f4bccb"];

  const vars: Vars = {
    "--hr-a": mixHex(theme.bg_color, "#ffffff", 65),
    "--hr-b": theme.bg_color,
    "--hr-ink": theme.text_color,
    "--bw": "clamp(190px, min(60vw, 46svh), 360px)",
  };

  return (
    <section ref={ref} className="hr" data-phase={phase} style={vars}>
      <RevealScene couple={couple} theme={theme} content={content} sceneDelayMs={2100} />
      <div className="hr-prop">
        <div
          className="hg-stage"
          role="button"
          tabIndex={phase === "idle" ? 0 : -1}
          aria-label={kh ? "បើកអំណោយ" : "Open the gift"}
          onClick={open}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open();
            }
          }}
        >
          <span aria-hidden className="hg-glow" />
          {PIECES.map((c, i) => (
            <span key={i} aria-hidden className="hg-conf" style={{ "--dx": `${c.dx}px`, "--dy": `${c.dy}px`, "--r": `${c.rot}deg`, "--s": `${c.size}px`, "--d": `${c.delay}ms`, "--c": confettiTones[c.tone] } as Vars} />
          ))}
          <div className="hg-box">
            <svg viewBox="0 0 300 300" aria-hidden>
              <defs>
                <linearGradient id={`${id}-sh`} x1="0" x2="1">
                  <stop offset="0" stopColor="#000" stopOpacity={0.28} />
                  <stop offset="0.35" stopColor="#fff" stopOpacity={0.08} />
                  <stop offset="1" stopColor="#000" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id={`${id}-rb`} x1="0" x2="1">
                  <stop offset="0" stopColor={g.mid} />
                  <stop offset="0.5" stopColor={ribbon} />
                  <stop offset="1" stopColor={g.mid} />
                </linearGradient>
              </defs>
              <ellipse cx="150" cy="276" rx="108" ry="10" fill="#000" opacity={0.16} />
              <g className="hg-body">
                <rect x="42" y="124" width="216" height="148" rx="5" fill={body} />
                <rect x="42" y="124" width="216" height="148" rx="5" fill={`url(#${id}-sh)`} />
                <rect x="132" y="124" width="36" height="148" fill={`url(#${id}-rb)`} />
              </g>
              <g className="hg-lid">
                <rect x="30" y="92" width="240" height="44" rx="5" fill={lid} />
                <rect x="30" y="92" width="240" height="44" rx="5" fill={`url(#${id}-sh)`} />
                <rect x="132" y="92" width="36" height="44" fill={`url(#${id}-rb)`} />
                <g className="hg-bow">
                  <ellipse cx="124" cy="76" rx="30" ry="17" transform="rotate(-24 124 76)" fill={`url(#${id}-rb)`} stroke={g.lo} strokeWidth="1.2" />
                  <ellipse cx="176" cy="76" rx="30" ry="17" transform="rotate(24 176 76)" fill={`url(#${id}-rb)`} stroke={g.lo} strokeWidth="1.2" />
                  <path d="M150 90 L128 120 M150 90 L172 120" stroke={g.lo} strokeWidth="9" strokeLinecap="round" fill="none" />
                  <path d="M150 90 L128 120 M150 90 L172 120" stroke={ribbon} strokeWidth="6" strokeLinecap="round" fill="none" />
                  <circle cx="150" cy="86" r="11" fill={`url(#${id}-rb)`} stroke={g.lo} strokeWidth="1.2" />
                </g>
              </g>
            </svg>
          </div>
        </div>
        <p className="hr-hint">{kh ? "ចុចដើម្បីបើក" : "Tap to open"}</p>
      </div>
    </section>
  );
}

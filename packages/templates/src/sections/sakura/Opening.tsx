"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import type { OpeningProps } from "../../types";
import { useLanguage } from "../../i18n";
import { formatWeddingDate } from "../../format";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { monogramOf } from "../khmer/skin-logic";
import { SakuraCrest } from "./ornaments/Crest";
import { SakuraArtStyle } from "./SakuraArtStyle";
import { doveUrl, hallwayUrl } from "./art/art-css";
import { sakuraPalette, SAKURA_GOLD } from "./palette";
import { bedVar, branchesVar, foilText, hasKhmer, SCRIPT_FONT } from "./sakura-style";
import { OPENING_DONE_MS, OPENING_STEPS, TWINKLES, type OpeningPhase } from "./opening-logic";

/**
 * Sakura cover gate. Hanging blossom branches sway over a blush-to-lavender mist, a gold monogram
 * medallion pulses; one tap releases a burst of light, a white flash, and a misty blossom hallway
 * that the guest "walks into" before the invitation appears. Reduced motion skips straight in.
 */
export function SakuraOpening({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const { t, language } = useLanguage();
  const reduce = useReducedMotion();
  const p = sakuraPalette(theme);
  const [phase, setPhase] = useState<OpeningPhase>("idle");
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const started = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const start = () => {
    if (started.current) return;
    started.current = true;
    if (reduce) {
      onOpenRef.current();
      return;
    }
    for (const step of OPENING_STEPS) timers.current.push(setTimeout(() => setPhase(step.phase), step.at));
    timers.current.push(setTimeout(() => onOpenRef.current(), OPENING_DONE_MS));
  };

  const kh = language === "kh";
  const date = formatWeddingDate(couple.weddingDate, language);
  const guest = guestGreeting?.trim() || undefined;
  const nameFont = (text: string) => (hasKhmer(text) ? MOUL_FONT : SCRIPT_FONT);
  const nameSize = (text: string): string => (hasKhmer(text) ? "clamp(1.25rem, 6vw, 1.9rem)" : "clamp(2.6rem, 12.5vw, 3.8rem)");
  const names = [couple.partner1Name, couple.partner2Name].filter((n): n is string => Boolean(n?.trim()));
  const foil = foilText(p);
  const pad = "calc(min(100vw, 720px) * 0.2)";

  const gate: CSSProperties = {
    backgroundColor: p.petalPale,
    backgroundImage: `radial-gradient(90% 55% at 50% 38%, #ffffff 0%, rgba(255,255,255,0) 70%), linear-gradient(180deg, #ffffff 0%, ${p.petalPale} 42%, ${p.lavender} 135%)`,
    color: theme.text_color,
    fontFamily: KHMER_BODY_FONT,
  };

  return (
    <div className="sk-gate" data-phase={phase} style={gate}>
      <SakuraArtStyle accent={theme.accent_color} />
      <div className="sk-hall" aria-hidden style={{ backgroundImage: hallwayUrl(theme.accent_color) }} />
      <div aria-hidden className="sk-layer sk-top sk-sway" style={{ backgroundImage: `var(${branchesVar(theme.accent_color)})`, zIndex: 1 }} />
      <div aria-hidden className="sk-layer sk-bottom" style={{ backgroundImage: `var(${bedVar(theme.accent_color)})`, zIndex: 1 }} />
      <div aria-hidden className="sk-dove" style={{ top: "22%", backgroundImage: doveUrl(theme.accent_color), zIndex: 1, animationDelay: "1s" }} />
      <div aria-hidden className="sk-dove" style={{ top: "58%", width: 60, backgroundImage: doveUrl(theme.accent_color), zIndex: 1, animationDelay: "8s" }} />
      {TWINKLES.map((s, i) => (
        <span key={i} aria-hidden className="sk-twinkle" style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s`, transform: `scale(${s.scale})`, zIndex: 1 }} />
      ))}

      <div className="sk-content flex min-h-[100svh] flex-col items-center justify-center gap-4 px-6 text-center" style={{ paddingTop: pad, paddingBottom: pad }}>
        <p className="sk-rise m-0 max-w-xs text-[13px] leading-relaxed" style={{ ...foil, fontFamily: kh ? MOUL_FONT : CINZEL_FONT, letterSpacing: kh ? "normal" : "0.16em", textTransform: kh ? "none" : "uppercase", fontWeight: kh ? 400 : 600, lineHeight: kh ? 2 : 1.7 }}>
          {t("sakura.greeting")}
        </p>

        <div className="sk-pulse sk-rise" style={{ animationDelay: "0.15s" }}>
          <SakuraCrest color={theme.accent_color} ground={p.petalPale} label={monogramOf(couple)} size={124} />
        </div>

        {guest && (
          <p className="sk-rise m-0" style={{ animationDelay: "0.3s" }}>
            <span className="block text-[11px] uppercase opacity-70" style={{ letterSpacing: kh ? "normal" : "0.22em", fontFamily: kh ? KHMER_BODY_FONT : CINZEL_FONT }}>
              {t("khmer.dear")}
            </span>
            <span className="block text-[1.7rem] leading-tight" style={{ ...foil, fontFamily: nameFont(guest) }}>
              {guest}
            </span>
          </p>
        )}

        <h1 className="sk-rise m-0 flex flex-col items-center leading-[1.05]" style={{ animationDelay: "0.4s" }}>
          {names.map((n, i) => (
            <span key={i} className="flex flex-col items-center">
              {i > 0 && (
                <span aria-hidden className="my-1 text-xl" style={{ ...foil, fontFamily: SCRIPT_FONT }}>
                  &amp;
                </span>
              )}
              <span style={{ ...foil, fontFamily: nameFont(n), fontSize: nameSize(n), overflowWrap: "anywhere" }}>{n}</span>
            </span>
          ))}
        </h1>

        {date && (
          <p className="sk-rise m-0 text-sm uppercase" style={{ animationDelay: "0.5s", letterSpacing: kh ? "normal" : "0.2em", fontFamily: kh ? KHMER_BODY_FONT : CINZEL_FONT, color: theme.text_color }}>
            {date}
          </p>
        )}

        <button
          type="button"
          data-mk-open
          onClick={start}
          className="sk-btn sk-rise mt-2 inline-flex min-h-12 items-center justify-center rounded-full px-9 py-3 text-base font-semibold"
          style={{
            animationDelay: "0.6s",
            fontFamily: KHMER_BODY_FONT,
            color: "#3d0f27",
            border: `1px solid ${SAKURA_GOLD.lo}`,
            backgroundImage: `linear-gradient(135deg, ${SAKURA_GOLD.hi} 0%, ${SAKURA_GOLD.mid} 50%, ${SAKURA_GOLD.lo} 100%)`,
            boxShadow: "0 10px 24px -10px rgba(120,70,10,0.65), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        >
          {t("sakura.open")}
        </button>
      </div>

      <div aria-hidden className="sk-glow" />
      <div aria-hidden className="sk-burst" />
      <div aria-hidden className="sk-flash" />
    </div>
  );
}

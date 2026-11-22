"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { OpeningProps } from "../../types";
import { useLanguage } from "../../i18n";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { KHMER_BODY_FONT, ROUNDED_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import { BunnyPrincess, CubWithCake, OwletPartyHat } from "./art/Mascots";
import { Castle } from "./art/Castle";
import { KidsButton } from "./art/KidsButton";
import { PixieBanner } from "./art/Pixies";
import { kidsPalette } from "./art/palette";
import { Cloud, Sparkle, Star } from "./art/Scenery";
import { burstPieces, exitDelay, scatterSparkles } from "./kids-logic";
import { KIDS_CSS } from "./kids-styles";

/**
 * The kids cover: a pastel storybook sky, a castle, pixies carrying the "You are invited" ribbon, the
 * child's name in bubble letters and three mascots bobbing on a cloud bank. Tapping the pill sets off a
 * sparkle burst and a white flash, the scene zooms away, then `onOpen` hands over to the page (the shared
 * chrome starts the music from this same tap). Reduced motion skips the show and opens straight away.
 */
export function KidsOpening({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const { t, language } = useLanguage();
  const pal = kidsPalette(theme);
  const [opening, setOpening] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const pieces = useMemo(() => burstPieces(26, 200), []);
  const stars = useMemo(() => scatterSparkles("kids-opening", 16), []);
  const date = formatWeddingDate(couple.weddingDate, language);
  const shade = mixHex(pal.berry, "#3a0618", 70);
  const tones = [pal.rose, pal.gold, pal.mint, pal.lavender];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const open = () => {
    if (opening) return;
    setOpening(true);
    const reduced = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(onOpen, exitDelay(reduced));
  };

  const outline = ["3px 0", "-3px 0", "0 3px", "0 -3px", "2px 2px", "-2px -2px", "2px -2px", "-2px 2px"].map((o) => `${o} 0 #fff`).join(", ");

  return (
    <div
      className="relative min-h-[100svh] overflow-hidden"
      style={{
        color: theme.text_color,
        fontFamily: KHMER_BODY_FONT,
        backgroundColor: theme.bg_color,
        backgroundImage: `linear-gradient(180deg, ${mixHex(pal.rose, "#ffffff", 30)} 0%, ${pal.peach} 24%, ${pal.lavender} 52%, ${pal.sky} 76%, ${pal.mint} 100%)`,
      }}
    >
      <style href="mk-kids-css" precedence="mk-kids">
        {KIDS_CSS}
      </style>
      <div className={`relative flex min-h-[100svh] flex-col items-center ${opening ? "kd-scene-exit" : ""}`}>
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {stars.map((s, i) => {
            const Shape = i % 3 === 0 ? Star : Sparkle;
            return <Shape key={i} color={i % 2 ? "#fff" : tones[s.tone % 4]!} size={s.size} className="kd-twinkle absolute" style={{ left: `${s.x}%`, top: `${s.y * 0.62}%`, animationDelay: `${s.delay}s` }} />;
          })}
          <Cloud fill="#fff" shade={withAlpha(pal.rose, 0.25)} width={170} className="kd-drift absolute left-[-30px] top-[20%] opacity-95" />
          <Cloud fill="#fff" shade={withAlpha(pal.lavender, 0.9)} width={130} className="kd-drift absolute right-[-26px] top-[34%] opacity-90" style={{ animationDelay: "-14s" }} />
        </div>

        <div className="relative z-10 w-full px-5 pt-7">
          <PixieBanner ribbon={pal.rose} ribbonShade={shade}>
            {t("kids.banner")}
          </PixieBanner>
        </div>

        <div className="relative z-10 mt-3 flex flex-col items-center px-4 text-center">
          <p
            className="m-0 mb-1 rounded-full px-4 py-1 text-[12px] font-bold uppercase tracking-[0.18em]"
            style={{ background: "rgba(255,255,255,.75)", color: pal.berry, fontFamily: ROUNDED_FONT }}
          >
            {t("kids.tagline")}
          </p>
          <Castle width={Math.min(300, 280)} className="kd-hover" roof={pal.rose} door={pal.berry} />
          <h1
            className="relative z-10 m-0 -mt-7 break-words px-2 text-center font-bold leading-[1.05]"
            style={{ fontFamily: ROUNDED_FONT, fontSize: "clamp(2.5rem, 13.5vw, 3.7rem)", color: pal.berry, textShadow: `${outline}, 0 7px 0 ${shade}, 0 14px 18px ${withAlpha(pal.berry, 0.3)}` }}
          >
            {formatCoupleNames(couple)}
          </h1>
          {date && (
            <p className="m-0 mt-3 rounded-full px-4 py-1.5 text-sm font-bold" style={{ background: "rgba(255,255,255,.8)", color: pal.berry, fontFamily: ROUNDED_FONT }}>
              {date}
            </p>
          )}
          {guestGreeting && (
            <p className="m-0 mt-2 rounded-full px-4 py-1 text-[13px] font-semibold" style={{ background: withAlpha(pal.berry, 0.1), color: theme.text_color }}>
              {t("kids.dear")} {guestGreeting}
            </p>
          )}
          <div className="relative mt-6">
            <KidsButton theme={theme} onClick={open} pulse={!opening} primaryOpen disabled={opening}>
              <Star color="#fff" size={20} />
              {t("kids.open")}
            </KidsButton>
            {opening &&
              pieces.map((p, i) => {
                const Shape = i % 2 ? Sparkle : Star;
                return (
                  <span
                    key={i}
                    aria-hidden
                    className="kd-burst"
                    style={{ ["--dx" as string]: `${p.dx}px`, ["--dy" as string]: `${p.dy}px`, ["--rot" as string]: `${p.rot}deg`, animationDelay: `${p.delay}ms` }}
                  >
                    <Shape color={i % 5 === 0 ? "#fff" : tones[p.tone]!} size={p.size} />
                  </span>
                );
              })}
          </div>
        </div>

        <div className="relative z-10 mt-auto w-full">
          <div className="relative mx-auto flex max-w-sm items-end justify-center gap-0.5 px-2 pt-6">
            <div className="kd-bob -mr-3 mb-2" style={{ animationDelay: "-0.8s" }}>
              <OwletPartyHat width={104} ink={theme.text_color} blush={pal.rose} />
            </div>
            <div className="kd-bob relative z-10" style={{ animationDelay: "0s" }}>
              <BunnyPrincess width={144} ink={theme.text_color} blush={pal.rose} />
            </div>
            <div className="kd-bob -ml-3 mb-2" style={{ animationDelay: "-1.7s" }}>
              <CubWithCake width={104} ink={theme.text_color} blush={pal.rose} />
            </div>
          </div>
          <div aria-hidden className="pointer-events-none relative -mt-3 h-14 overflow-hidden">
            <Cloud fill="#fff" shade={withAlpha(pal.mint, 1)} width={200} className="absolute -left-10 bottom-[-18px]" />
            <Cloud fill="#fff" shade={withAlpha(pal.lavender, 1)} width={240} className="absolute left-[24%] bottom-[-26px]" />
            <Cloud fill="#fff" shade={withAlpha(pal.peach, 1)} width={200} className="absolute -right-12 bottom-[-18px]" />
          </div>
        </div>
      </div>
      {opening && <span aria-hidden className="kd-flash" />}
    </div>
  );
}

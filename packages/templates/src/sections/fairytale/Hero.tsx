"use client";

import type { HeroContent, Theme, CoupleInfo } from "../../types";
import { useLanguage } from "../../i18n";
import { formatWeddingDate } from "../../format";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import { monogramOf } from "../khmer/skin-logic";
import { Castle, Cloud, Hydrangea, Morpho, Sparkle, Sprig, SunRays } from "./art";
import { FairytaleStyles } from "./FairytaleStyles";
import { fairytalePalette } from "./fairytale-logic";
import { SCRIPT_FONT } from "./ornaments";

export interface FairytaleHeroProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

const ARCH = "M6 340V130C6 56 70 4 130 4C190 4 254 56 254 130V340Z";

/**
 * Hero: an arched portrait inside a white mat and royal-blue rim, wreathed with hydrangeas and baby's
 * breath, a blue morpho perched on the frame, the palace softly in the distance. Without a photo the
 * arch shows the palace itself instead of an empty box.
 */
export function FairytaleHero({ couple, theme, content }: FairytaleHeroProps) {
  const { t, language } = useLanguage();
  const p = fairytalePalette(theme);
  const date = formatWeddingDate(couple.weddingDate, language);
  const photo = content?.coverPhotoUrl;
  const kh = language === "kh";

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-5 pb-24 pt-16 text-center"
      style={{ color: p.ink, fontFamily: KHMER_BODY_FONT, backgroundImage: `linear-gradient(180deg, #eef6fc 0%, ${p.sky} 60%, ${mixHex(p.sky, "#ffffff", 70)} 100%)` }}
    >
      <FairytaleStyles />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-3/5 opacity-80"><SunRays opacity={0.5} /></div>
        <div className="ft-drift absolute left-[-3%] top-[6%]"><Cloud width={130} opacity={0.9} /></div>
        <div className="ft-drift absolute right-[-5%] top-[18%]" style={{ animationDirection: "alternate-reverse" }}><Cloud width={100} opacity={0.75} /></div>
        <div className="absolute inset-x-0 bottom-0 mx-auto w-[130%] max-w-[760px] -translate-x-[12%] opacity-[0.22] sm:translate-x-0" style={{ height: "40%", left: 0, right: 0 }}>
          <Castle royal={p.royal} sky={p.sky} blooms={p.blooms} />
        </div>
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
          <Sparkle x={52} y={60} size={7} delay={0.2} />
          <Sparkle x={350} y={110} size={8} delay={1.2} />
          <Sparkle x={330} y={230} size={6} delay={0.8} />
          <Sparkle x={70} y={190} size={5} delay={1.9} />
        </svg>
      </div>

      <p className="relative m-0 uppercase" style={{ fontFamily: kh ? MOUL_FONT : CINZEL_FONT, fontSize: kh ? "0.9rem" : "0.78rem", letterSpacing: kh ? "normal" : "0.34em", lineHeight: kh ? 1.9 : 1.5, color: p.royal }}>
        {t("fairytale.greeting")}
      </p>

      <div className="relative mx-auto mt-7 w-[min(78vw,300px)]">
        <svg viewBox="-34 -22 328 400" className="relative block w-full overflow-visible" aria-hidden focusable="false">
          <defs>
            <clipPath id="ft-hero-arch"><path d={ARCH} /></clipPath>
            <linearGradient id="ft-hero-rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={mixHex(p.royal, "#ffffff", 45)} />
              <stop offset="0.5" stopColor={p.royal} />
              <stop offset="1" stopColor={mixHex(p.royal, p.ink, 55)} />
            </linearGradient>
            <linearGradient id="ft-hero-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#dcecf9" />
              <stop offset="1" stopColor="#fdf3f6" />
            </linearGradient>
          </defs>
          <path d={ARCH} transform="translate(-16 -14) scale(1.123 1.04)" fill="#ffffff" stroke="url(#ft-hero-rim)" strokeWidth="3" style={{ filter: `drop-shadow(0 16px 20px ${withAlpha(p.royal, 0.35)})` }} />
          <path d={ARCH} transform="translate(-9 -7) scale(1.07 1.02)" fill="none" stroke={withAlpha(p.royal, 0.35)} strokeWidth="1" />
          <g clipPath="url(#ft-hero-arch)">
            <rect x="0" y="0" width="260" height="344" fill="url(#ft-hero-sky)" />
            {!photo && (
              <>
                <g transform="translate(20 60) scale(0.74)"><Castle royal={p.royal} sky={p.sky} blooms={p.blooms} glow /></g>
                <text x="130" y="48" textAnchor="middle" fontSize="38" fill={p.royal} fillOpacity=".85" style={{ fontFamily: SCRIPT_FONT }}>{monogramOf(couple)}</text>
              </>
            )}
          </g>
        </svg>
        {photo && (
          <>
            <svg width="0" height="0" aria-hidden focusable="false" className="absolute">
              <clipPath id="ft-hero-clip" clipPathUnits="objectBoundingBox" transform="scale(0.003846 0.002907)">
                <path d={ARCH} />
              </clipPath>
            </svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt=""
              decoding="async"
              className="absolute object-cover"
              style={{ left: "10.37%", top: "5.5%", width: "79.27%", height: "86%", clipPath: "url(#ft-hero-clip)" }}
            />
          </>
        )}
        {/* garland: drawn over the photo's foot and crown */}
        <svg viewBox="-34 -22 328 400" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden focusable="false">
          <Hydrangea x={-6} y={316} r={34} blooms={p.blooms} seed={51} count={15} />
          <Hydrangea x={62} y={338} r={26} blooms={p.blooms} seed={53} count={12} />
          <Hydrangea x={266} y={316} r={34} blooms={p.blooms} seed={55} count={15} />
          <Hydrangea x={198} y={338} r={26} blooms={p.blooms} seed={57} count={12} />
          <Hydrangea x={130} y={-2} r={22} blooms={p.blooms} seed={59} count={11} leaves={false} />
          <Hydrangea x={14} y={84} r={18} blooms={p.blooms} seed={61} count={9} leaves={false} />
          <Hydrangea x={246} y={84} r={18} blooms={p.blooms} seed={63} count={9} leaves={false} />
          <Sprig x={-30} y={170} scale={0.9} rotate={-18} />
          <Sprig x={258} y={168} scale={0.9} rotate={18} />
          <Sprig x={88} y={-26} scale={0.6} rotate={-30} />
          <Sprig x={172} y={-26} scale={0.6} rotate={30} />
        </svg>
        <div className="ft-flutter absolute -right-3 top-[14%]"><Morpho size={46} tilt={16} /></div>
        <div className="ft-flutter absolute -left-4 top-[48%]" style={{ animationDelay: "-4s" }}><Morpho size={34} tilt={-18} /></div>
      </div>

      <h2 className="relative m-0 mt-8 font-normal leading-[1.1]" style={{ fontFamily: SCRIPT_FONT, fontSize: "clamp(2.6rem, 14vw, 3.8rem)", color: p.royal, textShadow: "0 1px 0 rgba(255,255,255,.9), 0 3px 8px rgba(23,45,100,.2)" }}>
        {couple.partner1Name}
        {couple.partner2Name && (
          <>
            <span className="block" style={{ fontSize: "0.5em", color: p.royal, opacity: 0.85 }}>&amp;</span>
            {couple.partner2Name}
          </>
        )}
      </h2>
      {date && (
        <p className="relative m-0 mt-4 uppercase" style={{ fontFamily: CINZEL_FONT, fontSize: "0.85rem", letterSpacing: "0.3em", color: p.ink }}>
          {date}
        </p>
      )}
      <p className="relative m-0 mt-3 italic" style={{ fontSize: "0.9rem", color: p.ink, opacity: 0.8 }}>
        {t("fairytale.tagline")}
      </p>
    </section>
  );
}

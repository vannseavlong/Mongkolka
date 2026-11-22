"use client";

import { useId, type CSSProperties } from "react";
import type { SkinHeroProps } from "../khmer/SkinHero";
import { useLanguage } from "../../i18n";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { GoldGradientDef } from "../khmer/ornaments/Corner";
import { foilTextGradient } from "../khmer/foil";
import { monogramOf } from "../khmer/skin-logic";
import { EmeraldBackdrop, Skyline } from "./art/Backdrop";
import { Medallion } from "./art/Medallion";
import { EmeraldDivider } from "./ornaments";
import { EMERALD_CSS } from "./emerald-styles";
import { hasKhmer } from "./opening-logic";
import { emeraldPalette } from "./palette";

/** Outer and inner pointed-arch frame lines in a 100x130 box. */
const ARCH_OUTER = "M1 129V50C1 28 30 16 50 1C70 16 99 28 99 50V129Z";
const ARCH_INNER = "M6 129V52C6 32 33 21 50 8C67 21 94 32 94 52V129Z";
const ARCH_CLIP = "M0 1V0.4C0 0.22 0.28 0.12 0.5 0C0.72 0.12 1 0.22 1 0.4V1Z";

const rise = (i: number): CSSProperties => ({ animationDelay: `${0.1 + i * 0.14}s` });

/**
 * Emerald hero: a gold medallion crowns a pointed-arch photo frame (double pin-stripe) over a lattice
 * ground with gold corners; names in foil script, the date, a divider and a row of lotus-bud spires
 * along the bottom. With no photo the arch holds a turning medallion. The lunar date lives in the
 * invitation section, which has the typed lunar line; the hero only knows the solar date.
 */
export function EmeraldHero({ couple, theme, content }: SkinHeroProps) {
  const { t, language } = useLanguage();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = emeraldPalette(theme);
  const nameKhmer = hasKhmer(formatCoupleNames(couple));
  const date = formatWeddingDate(couple.weddingDate, language);
  const photo = content?.coverPhotoUrl;
  const label = monogramOf(couple);
  const foil: CSSProperties = {
    backgroundImage: foilTextGradient(theme.accent_color, p.ground),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))",
  };

  return (
    <section
      id="mk-hero"
      className="relative flex min-h-[92svh] flex-col items-center overflow-hidden text-center"
      style={{ backgroundColor: p.deep, color: theme.text_color, fontFamily: KHMER_BODY_FONT }}
      data-mk-lang={language}
    >
      <style href="mk-emerald-css" precedence="mk-emerald">
        {EMERALD_CSS}
      </style>
      <EmeraldBackdrop accent={theme.accent_color} ground={p.ground} deep={p.deep} bottomCorners={false} />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-5 pb-6 pt-14">
        <p className="em-hero-in m-0 max-w-[80vw] text-[0.8rem] leading-relaxed" style={{ fontFamily: MOUL_FONT, ...foil, ...rise(0) }}>
          {t("emerald.greeting")}
        </p>

        <div className="em-hero-in relative mt-16 w-[min(72vw,290px)]" style={{ aspectRatio: "100 / 130", ...rise(1) }}>
          <div className="em-fit absolute left-1/2 z-20 -translate-x-1/2" style={{ top: "-17%", "--w": "36%" } as CSSProperties}>
            <Medallion color={theme.accent_color} ground={p.ground} label={label} size={120} spin />
          </div>
          <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
            <defs>
              <clipPath id={`${uid}c`} clipPathUnits="objectBoundingBox">
                <path d={ARCH_CLIP} />
              </clipPath>
            </defs>
          </svg>
          <div className="absolute" style={{ left: "6%", right: "6%", top: "6%", bottom: 0, clipPath: `url(#${uid}c)`, background: `radial-gradient(circle at 50% 40%, ${p.lift}, ${p.deep})` }}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center">
                <div className="em-fit" style={{ "--w": "74%" } as CSSProperties}>
                  <Medallion color={theme.accent_color} ground={p.ground} label={label} size={220} spin />
                </div>
              </div>
            )}
            <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 62%, ${withAlpha(p.deep, 0.65)})` }} />
          </div>
          <svg viewBox="0 0 100 130" width="100%" height="100%" aria-hidden focusable="false" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-10">
            <defs>
              <GoldGradientDef id={`${uid}g`} color={theme.accent_color} />
            </defs>
            <path d={ARCH_OUTER} fill="none" stroke={`url(#${uid}g)`} strokeWidth="2.6" vectorEffect="non-scaling-stroke" />
            <path d={ARCH_INNER} fill="none" stroke={`url(#${uid}g)`} strokeWidth="1" opacity="0.75" vectorEffect="non-scaling-stroke" />
            <path d="M50 -2 54 3 50 8 46 3Z" fill={`url(#${uid}g)`} />
          </svg>
        </div>

        <h2
          className="em-hero-in m-0 mt-7 leading-tight"
          style={{ fontFamily: nameKhmer ? MOUL_FONT : 'var(--font-script), "Great Vibes", cursive', fontSize: nameKhmer ? "clamp(1.2rem,6vw,1.8rem)" : "clamp(2.4rem,11vw,3.6rem)", fontWeight: 400, ...foil, ...rise(2) }}
        >
          {formatCoupleNames(couple)}
        </h2>
        {date && (
          <p className="em-hero-in m-0 mt-3 text-sm tracking-[0.2em]" style={{ color: p.gold.hi, ...rise(3) }}>
            {date}
          </p>
        )}
        <div className="em-hero-in mt-5 w-full" style={rise(4)}>
          <EmeraldDivider color={theme.accent_color} />
        </div>
        <p className="em-hero-in m-0 mt-3 text-xs tracking-[0.3em]" style={{ color: withAlpha(p.gold.hi, 0.85), ...rise(5) }}>
          {t("emerald.tagline")}
        </p>
      </div>
      <div className="relative z-10 w-full">
        <Skyline color={theme.accent_color} deep={p.deep} />
      </div>
    </section>
  );
}

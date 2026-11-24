"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { formatWeddingDate } from "../../format";
import { KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { foilTextGradient } from "../khmer/foil";
import { COVENANT_CSS } from "./covenant-styles";
import { Cross } from "./cross";
import { nextHeroPhase, PHOTO_WAIT_MS, usablePhoto, type HeroPhase } from "./hero-logic";
import { joinNames, coupleNamesFor } from "./names";
import { hasKhmer } from "./intro-logic";
import { covenantPalette, PINK } from "./palette";

type Vars = CSSProperties & Record<`--${string}`, string | number>;
const SCRIPT = 'var(--font-script), "Great Vibes", cursive';

export interface CovenantHeroProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

/**
 * Full-screen couple photo (it crops to the screen, so a landscape photo fills a laptop and a portrait one a phone).
 * While the photo loads a gold cross breathes on the pink page; then the photo appears inside a growing cross, the
 * cross outline fades and the whole photo opens up behind the names. No photo: the pink page keeps a gold cross.
 */
export function CovenantHero({ couple, theme, content }: CovenantHeroProps) {
  const { t, language } = useLanguage();
  const reduce = useReducedMotion() ?? false;
  const p = covenantPalette(theme);
  const photo = usablePhoto(content?.coverPhotoUrl);
  const [phase, setPhase] = useState<HeroPhase>(() => nextHeroPhase(photo, "mount"));

  useEffect(() => {
    if (!photo) {
      setPhase("reveal");
      return;
    }
    setPhase("loading");
    let done = false;
    const finish = (event: "loaded" | "failed" | "timeout") => {
      if (done) return;
      done = true;
      setPhase(nextHeroPhase(photo, event));
    };
    const img = new Image();
    img.onload = () => finish("loaded");
    img.onerror = () => finish("failed");
    img.src = photo;
    if (img.complete) finish("loaded");
    const timer = setTimeout(() => finish("timeout"), PHOTO_WAIT_MS);
    return () => {
      done = true;
      clearTimeout(timer);
    };
  }, [photo]);

  const names = joinNames(coupleNamesFor(couple, language));
  const date = formatWeddingDate(couple.weddingDate, language);
  const kh = language === "kh";
  const khmerNames = hasKhmer(names);
  const foil: CSSProperties = {
    backgroundImage: foilTextGradient(theme.accent_color, "#3a1a28"),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 2px 8px rgba(40,10,24,.55))",
  };
  const vars: Vars = {
    "--cv-ground": p.ground,
    "--cv-petal": PINK.petal,
    "--cv-hi": p.gold.hi,
    "--cv-mid": p.gold.mid,
    "--cv-lo": p.gold.lo,
    "--ch": "min(74svh, 120vw)",
    fontFamily: KHMER_BODY_FONT,
  };
  const revealed = phase === "reveal";
  const idx = (i: number): Vars => ({ "--i": i });

  return (
    <section
      id="mk-hero"
      className={`cv-hero${revealed ? " is-reveal" : ""}`}
      style={vars}
      data-mk-lang={language}
      aria-busy={!revealed}
    >
      <style href="mk-covenant-css" precedence="mk-covenant">
        {COVENANT_CSS}
      </style>

      {photo && revealed && (
        <>
          <div aria-hidden className="cv-window">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" className="cv-photo" decoding="async" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt={names} className="cv-photo cv-photo-full" decoding="async" />
        </>
      )}
      <div aria-hidden className="cv-scrim" />

      <div aria-hidden className={`cv-crossbox cv-fluid cv-loadcross`} style={revealed && !photo ? { opacity: 0.9, animation: "none" } : undefined}>
        <Cross color={theme.accent_color} size={200} draw={!revealed} glow />
      </div>
      {!revealed && (
        <p role="status" className="absolute inset-x-0 m-0 text-center text-sm" style={{ bottom: "12svh", color: withAlpha(p.ink, 0.7) }}>
          {t("covenant.loading")}
        </p>
      )}

      <div className="cv-hero-text">
        <p className="m-0 text-xs" style={{ ...idx(0), color: "#fff", letterSpacing: kh ? "normal" : "0.3em", textTransform: kh ? "none" : "uppercase", textShadow: "0 1px 8px rgba(40,10,24,.6)", fontFamily: kh ? MOUL_FONT : undefined, lineHeight: 2 }}>
          {t("covenant.tagline")}
        </p>
        <h2
          className="m-0"
          style={{
            ...idx(1),
            ...foil,
            fontFamily: khmerNames ? MOUL_FONT : SCRIPT,
            fontWeight: 400,
            fontSize: khmerNames ? "clamp(1.5rem,7vw,2.6rem)" : "clamp(3rem,13vw,5.4rem)",
            lineHeight: khmerNames ? 1.9 : 1.1,
            overflowWrap: "anywhere",
          }}
        >
          {names}
        </h2>
        {date && (
          <p className="m-0 text-base" style={{ ...idx(2), color: "#fff", letterSpacing: "0.22em", textShadow: "0 1px 8px rgba(40,10,24,.6)" }}>
            {date}
          </p>
        )}
      </div>
      <span aria-hidden className="cv-scroll" />
    </section>
  );
}

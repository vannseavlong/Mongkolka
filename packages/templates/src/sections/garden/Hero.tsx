"use client";

import type { CSSProperties } from "react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { useLanguage } from "../../i18n";
import { CINZEL_FONT, KHMER_BODY_FONT } from "../../chrome/fonts";
import { goldGradient, withAlpha } from "../../chrome/gold";
import { monogramOf } from "../khmer/skin-logic";
import { Art, Dove, Lily, RoseVine } from "./art/Botanicals";
import { BUD, LEAF, ROSE } from "./art/botanical-data";
import { GardenCourt } from "./art/Court";
import { GARDEN_CSS } from "./garden-css";
import { archGarland } from "./garland";
import { gardenPalette, type GardenPalette } from "./palette";

const SCRIPT_FONT = 'var(--font-script), "Great Vibes", cursive';
const DEFS = { rose: ROSE, leaf: LEAF, bud: BUD } as const;

/** The flower garland over the arch, in a 120 x 64 box (arch crown at y = 14, x offset 10). */
function Garland({ palette }: { palette: GardenPalette }) {
  return (
    <svg viewBox="-10 -14 120 78" aria-hidden focusable="false" style={{ position: "absolute", left: "-10%", width: "120%", top: "calc(var(--gdw) * -0.1167)", overflow: "visible", pointerEvents: "none" }}>
      {archGarland().map((it, i) => (
        <g key={i} transform={`translate(${it.x} ${it.y}) rotate(${it.rot}) translate(${-it.size / 2} ${-(it.size * DEFS[it.kind].h) / DEFS[it.kind].w / 2})`}>
          <Art def={DEFS[it.kind]} palette={palette} width={it.size} />
        </g>
      ))}
    </svg>
  );
}

export interface GardenHeroProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

/**
 * The garden hero: the couple in a gold-edged arch under a garland of roses, lily-of-the-valley at the
 * feet of the frame, a soft palace-garden court behind, climbing roses down both sides, doves drifting
 * above. Names in script, the date in Cinzel, a scroll cue. No photo: a monogram on a blush-and-sage
 * ground. Static art plus a few slow transform animations (all off with reduced motion).
 */
export function GardenHero({ couple, theme, content }: GardenHeroProps) {
  const { t, language } = useLanguage();
  const p = gardenPalette(theme);
  const kh = language === "kh";
  const gold = goldGradient(theme.accent_color);
  const date = formatWeddingDate(couple.weddingDate, language);
  const photo = content?.coverPhotoUrl;
  const foil = (extra?: CSSProperties): CSSProperties => ({
    backgroundImage: gold,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: theme.accent_color,
    ...extra,
  });

  return (
    <section
      data-mk-lang={language}
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-28 pt-20 text-center"
      style={{ ["--gdw" as string]: "min(66vw, 280px)", backgroundColor: p.ground, color: p.text, fontFamily: KHMER_BODY_FONT }}
    >
      <style href="mk-garden-css" precedence="mk-garden">
        {GARDEN_CSS}
      </style>

      <GardenCourt palette={p} veil={0.62} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: -2 }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: -1, background: `radial-gradient(70% 50% at 50% 38%, ${withAlpha(p.ground, 0.78)}, transparent 75%)` }} />

      <div aria-hidden className="gd-breeze" style={{ position: "absolute", left: -18, top: 0, transform: "scaleY(-1)", zIndex: 0 }}>
        <RoseVine palette={p} width={170} />
      </div>
      <div aria-hidden className="gd-breeze" style={{ position: "absolute", right: -18, top: 0, transform: "scale(-1,-1)", zIndex: 0 }}>
        <RoseVine palette={p} width={170} />
      </div>
      <div aria-hidden className="gd-breeze" style={{ position: "absolute", left: -18, bottom: 0, zIndex: 0 }}>
        <RoseVine palette={p} width={190} />
      </div>
      <div aria-hidden className="gd-breeze" style={{ position: "absolute", right: -18, bottom: 0, transform: "scaleX(-1)", zIndex: 0 }}>
        <RoseVine palette={p} width={190} />
      </div>

      <div aria-hidden className="gd-drift" style={{ position: "absolute", left: "12%", top: "13%" }}>
        <Dove palette={p} width={40} />
      </div>
      <div aria-hidden className="gd-drift" style={{ position: "absolute", right: "10%", top: "19%", animationDelay: "-3s", transform: "scaleX(-1)" }}>
        <Dove palette={p} width={30} />
      </div>

      <div className="gd-rise relative" style={{ width: "var(--gdw)", marginTop: "calc(var(--gdw) * 0.1)" }}>
        <Garland palette={p} />
        <div style={{ borderTopLeftRadius: 999, borderTopRightRadius: 999, borderBottomLeftRadius: 18, borderBottomRightRadius: 18, padding: 3, backgroundImage: gold, boxShadow: `0 22px 40px -18px ${withAlpha("#4a3020", 0.55)}` }}>
          <div style={{ borderTopLeftRadius: 999, borderTopRightRadius: 999, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 6, backgroundColor: p.ground }}>
            <div
              className="flex items-center justify-center overflow-hidden"
              style={{
                aspectRatio: "3 / 4",
                borderTopLeftRadius: 999,
                borderTopRightRadius: 999,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                background: `linear-gradient(160deg, ${p.roseLight}, ${p.sage})`,
                border: `1px solid ${withAlpha(theme.accent_color, 0.7)}`,
              }}
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={t("garden.heroAlt")} className="size-full object-cover" />
              ) : (
                <span aria-hidden style={foil({ fontFamily: SCRIPT_FONT, fontSize: "calc(var(--gdw) * 0.3)", lineHeight: 1 })}>
                  {monogramOf(couple)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div aria-hidden style={{ position: "absolute", left: "-15%", bottom: "-4%", width: "30%" }}>
          <Lily palette={p} width={80} style={{ width: "100%", height: "auto" }} />
        </div>
        <div aria-hidden style={{ position: "absolute", right: "-15%", bottom: "-4%", width: "30%", transform: "scaleX(-1)" }}>
          <Lily palette={p} width={80} style={{ width: "100%", height: "auto" }} />
        </div>
      </div>

      <div className="gd-rise relative mt-7 flex max-w-sm flex-col items-center gap-2" style={{ animationDelay: "0.25s" }}>
        <p className="m-0" style={{ fontFamily: CINZEL_FONT, fontSize: kh ? 13 : 11, letterSpacing: kh ? "normal" : "0.22em", textTransform: kh ? "none" : "uppercase", color: p.text, opacity: 0.85 }}>
          {t("garden.together")}
        </p>
        <h2 className="m-0" style={foil({ fontFamily: SCRIPT_FONT, fontWeight: 400, fontSize: "clamp(2.4rem, 13vw, 3.6rem)", lineHeight: 1.1, overflowWrap: "anywhere", filter: "drop-shadow(0 1px 0 rgba(255,255,255,.7))" })}>
          {formatCoupleNames(couple)}
        </h2>
        {date && (
          <p className="m-0" style={{ fontFamily: CINZEL_FONT, fontSize: 13, letterSpacing: "0.2em", color: p.text }}>
            {date}
          </p>
        )}
        <div className="gd-cue mt-6 flex flex-col items-center gap-1" aria-hidden style={{ color: theme.accent_color, fontFamily: CINZEL_FONT, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase" }}>
          <span>{t("garden.scroll")}</span>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 2l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}

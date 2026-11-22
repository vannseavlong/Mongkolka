"use client";

import type { CSSProperties } from "react";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { formatCoupleNames } from "../../format";
import { useLanguage } from "../../i18n";
import { foilTextGradient } from "../khmer/foil";
import { monogramOf } from "../khmer/skin-logic";
import type { SkinHeroProps } from "../khmer/SkinHero";
import { Butterfly } from "./art/Butterfly";
import { HangingFlorals, OvalWreath, PHOTO_OVAL, WREATH_BOX } from "./art/Compositions";
import { Shield } from "./art/Shield";
import { CREAM_CSS } from "./cream-styles";
import { isKhmerText, nameFamily } from "./cream-type";
import { dotDate } from "./date-line";
import { creamPalette } from "./palette";

const pct = (n: number, of: number) => `${((n / of) * 100).toFixed(3)}%`;

/** The photo window inside the wreath, as percentages of the wreath box so it scales with it. */
const WINDOW: CSSProperties = {
  position: "absolute",
  left: pct(WREATH_BOX.cx - PHOTO_OVAL.rx, WREATH_BOX.w),
  top: pct(WREATH_BOX.cy - PHOTO_OVAL.ry, WREATH_BOX.h),
  width: pct(PHOTO_OVAL.rx * 2, WREATH_BOX.w),
  height: pct(PHOTO_OVAL.ry * 2, WREATH_BOX.h),
  borderRadius: "50%",
  overflow: "hidden",
};

/**
 * Royal Cream hero: the couple's photo in a floral oval arch (peonies, roses, buds and leaves in
 * watercolour, two gold rings, a lotus finial), butterflies drifting round it, blossom hanging from
 * both top corners, names in gold calligraphy and a dotted date line. No photo: the gold shield
 * monogram sits in the oval instead.
 */
export function CreamHero({ couple, theme, content }: SkinHeroProps) {
  const { t, language } = useLanguage();
  const p = creamPalette(theme);
  const kh = language === "kh";
  const names = formatCoupleNames(couple);
  const date = dotDate(couple.weddingDate, language);
  const photo = content?.coverPhotoUrl;
  const foil = foilTextGradient(theme.accent_color, theme.bg_color);
  const foilText: CSSProperties = { backgroundImage: foil, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" };
  const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

  return (
    <section
      data-mk-lang={language}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-14 pt-24 text-center"
      style={
        {
          "--cr-gold": p.gold,
          "--cr-gold-hi": p.goldHi,
          "--cr-gold-lo": p.goldLo,
          backgroundColor: p.ground,
          backgroundImage:
            `radial-gradient(75% 38% at 50% 38%, ${p.paper}, transparent 72%),` +
            `radial-gradient(70% 40% at 92% 4%, ${p.blush}80, transparent 70%),` +
            `radial-gradient(70% 40% at 4% 96%, ${p.champagne}b3, transparent 70%),` +
            `radial-gradient(50% 30% at 6% 40%, ${p.sage}2e, transparent 70%)`,
          color: p.ink,
          fontFamily: KHMER_BODY_FONT,
        } as CSSProperties
      }
    >
      <style href="mk-cream-css" precedence="mk-cream">
        {CREAM_CSS}
      </style>

      <div aria-hidden style={{ position: "absolute", top: -6, left: -10, width: "min(34vw, 150px)" }}>
        <div className="cr-sway"><HangingFlorals theme={theme} /></div>
      </div>
      <div aria-hidden style={{ position: "absolute", top: -6, right: -10, width: "min(34vw, 150px)", transform: "scaleX(-1)" }}>
        <div className="cr-sway"><HangingFlorals theme={theme} /></div>
      </div>
      {[[18, 72, 5, 0], [82, 66, 4, 1800], [10, 30, 3, 3200], [90, 36, 4, 900], [70, 90, 3, 2600]].map(([x, y, s, d], i) => (
        <span key={i} aria-hidden className="cr-dust" style={{ left: `${x}%`, top: `${y}%`, width: s! * 2.4, height: s! * 2.4, animationDelay: `${d}ms` }} />
      ))}

      <p className="cr-in m-0" style={{ ...delay(100), fontFamily: kh ? MOUL_FONT : CINZEL_FONT, fontSize: kh ? 15 : 12, letterSpacing: kh ? "normal" : "0.34em", textTransform: kh ? "none" : "uppercase", lineHeight: 2, color: p.gold, position: "relative", zIndex: 2 }}>
        {t("cream.kicker")}
      </p>

      <div className="cr-bloom relative mt-3" style={{ ...delay(250), width: "min(78vw, 340px)", aspectRatio: `${WREATH_BOX.w} / ${WREATH_BOX.h}` }}>
        <div style={WINDOW}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="size-full object-cover" style={{ filter: "saturate(0.95) contrast(1.02)" }} />
          ) : (
            <div className="flex size-full items-center justify-center" style={{ backgroundImage: `linear-gradient(160deg, ${p.paper}, ${p.champagne})` }}>
              <Shield color={theme.accent_color} ground={p.paper} label={monogramOf(couple)} size={92} />
            </div>
          )}
          <div aria-hidden className="absolute inset-0" style={{ boxShadow: `inset 0 0 0 1px ${withAlpha("#ffffff", 0.5)}, inset 0 0 28px 4px ${withAlpha(p.paper, 0.35)}`, borderRadius: "50%" }} />
        </div>
        <div className="absolute inset-0">
          <OvalWreath theme={theme} />
        </div>
        <div aria-hidden className="cr-bf" style={{ left: "-2%", top: "22%" }}><Butterfly p={p} size={36} /></div>
        <div aria-hidden className="cr-bf cr-bf-b" style={{ right: "-3%", left: "auto", top: "46%" }}><Butterfly p={p} size={30} /></div>
        <div aria-hidden className="cr-bf cr-bf-c" style={{ left: "70%", top: "4%" }}><Butterfly p={p} size={26} /></div>
      </div>

      <h2
        className="cr-in m-0 mt-2"
        style={{ ...delay(700), ...foilText, position: "relative", zIndex: 2, fontFamily: nameFamily(names), fontSize: isKhmerText(names) ? "clamp(1.4rem, 6.4vw, 2rem)" : "clamp(2.6rem, 12.5vw, 3.8rem)", lineHeight: isKhmerText(names) ? 1.9 : 1.12, overflowWrap: "anywhere", filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.6)) drop-shadow(0 2px 2px rgba(110,70,20,0.22))" }}
      >
        {names}
      </h2>
      {date && (
        <p className="cr-in m-0 mt-1" style={{ ...delay(950), fontFamily: kh ? KHMER_BODY_FONT : CINZEL_FONT, fontSize: kh ? 17 : 15, letterSpacing: kh ? "0.1em" : "0.3em", color: p.gold, fontWeight: 600, position: "relative", zIndex: 2 }}>
          {date}
        </p>
      )}
      <div aria-hidden className="cr-cue" style={{ marginTop: 26, color: p.gold, position: "relative", zIndex: 2 }}>
        <svg width="22" height="30" viewBox="0 0 22 30" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 2v18M4 14l7 8 7-8" />
        </svg>
      </div>
      <span className="sr-only">{t("cream.scroll")}</span>
    </section>
  );
}

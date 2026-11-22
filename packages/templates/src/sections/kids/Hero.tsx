"use client";

import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { formatWeddingDate } from "../../format";
import { KHMER_BODY_FONT, ROUNDED_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import { KidsBackdrop } from "./art/Backdrop";
import { BunnyPrincess } from "./art/Mascots";
import { kidsPalette } from "./art/palette";
import { Balloon, Bunting, Heart, Sparkle, Star } from "./art/Scenery";
import { buildHeroView, ringPoints } from "./hero-logic";
import { KIDS_CSS } from "./kids-styles";

export interface KidsHeroProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

const SIZE = 288;
const RING = ringPoints(20, 124, SIZE / 2);

/**
 * The kids portrait: bunting across the top, the child's photo in a scalloped cookie frame with balloons
 * and stars, the name in bubble letters and the date on a pill. With no photo the bunny princess sits in
 * the frame so the page never shows an empty circle.
 */
export function KidsHero({ couple, theme, content }: KidsHeroProps) {
  const { t, language } = useLanguage();
  const pal = kidsPalette(theme);
  const view = buildHeroView(couple, content?.coverPhotoUrl);
  const date = formatWeddingDate(couple.weddingDate, language);
  const shade = mixHex(pal.berry, "#3a0618", 70);

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-5 pb-16 pt-14 text-center"
      style={{
        color: theme.text_color,
        fontFamily: KHMER_BODY_FONT,
        backgroundColor: theme.bg_color,
        backgroundImage: `linear-gradient(180deg, ${mixHex(pal.peach, "#ffffff", 60)} 0%, ${theme.bg_color} 55%)`,
      }}
    >
      <style href="mk-kids-css" precedence="mk-kids">
        {KIDS_CSS}
      </style>
      <KidsBackdrop theme={theme} id="hero" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10">
        <Bunting colors={[pal.rose, pal.mint, pal.lavender, pal.peach, pal.gold]} />
      </div>

      <div className="relative z-10 mx-auto" style={{ width: SIZE, maxWidth: "100%" }}>
        <p className="m-0 mb-5 inline-block rounded-full px-4 py-1 text-[12px] font-bold uppercase tracking-[0.18em]" style={{ background: "rgba(255,255,255,.85)", color: pal.berry, fontFamily: ROUNDED_FONT }}>
          {t("kids.tagline")}
        </p>
        <div className="relative mx-auto" style={{ width: SIZE, height: SIZE, maxWidth: "100%" }}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height="100%" aria-hidden focusable="false" className="absolute inset-0 kd-pulse" style={{ filter: `drop-shadow(0 12px 14px ${withAlpha(pal.berry, 0.3)})` }}>
            {RING.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="19" fill={i % 2 ? "#fff" : pal.rose} stroke={withAlpha(pal.berry, 0.25)} strokeWidth="2" />
            ))}
            <circle cx={SIZE / 2} cy={SIZE / 2} r="124" fill={pal.rose} />
            <circle cx={SIZE / 2} cy={SIZE / 2} r="112" fill="#fff" />
            <circle cx={SIZE / 2} cy={SIZE / 2} r="104" fill="none" stroke={withAlpha(pal.berry, 0.35)} strokeWidth="2.4" strokeDasharray="1 8" strokeLinecap="round" />
          </svg>
          <div
            className="absolute overflow-hidden rounded-full"
            style={{
              inset: 38,
              border: "5px solid #fff",
              boxShadow: `inset 0 0 0 2px ${withAlpha(pal.berry, 0.25)}`,
              background: `radial-gradient(circle at 50% 38%, ${pal.peach}, ${pal.lavender})`,
            }}
          >
            {view.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={view.photo} alt={view.name} className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-end justify-center pb-2">
                <BunnyPrincess width={150} ink={theme.text_color} blush={pal.rose} className="kd-bob" />
              </div>
            )}
          </div>
          <Balloon color={pal.rose} size={44} className="kd-hover absolute -left-3 -top-2" />
          <Balloon color={pal.mint} size={38} className="kd-hover absolute -left-7 top-9" style={{ animationDelay: "-1.4s" }} />
          <Balloon color={pal.lavender} size={44} className="kd-hover absolute -right-3 -top-3" style={{ animationDelay: "-2.2s" }} />
          <Balloon color={pal.peach} size={36} className="kd-hover absolute -right-7 top-10" style={{ animationDelay: "-0.6s" }} />
          <Star color={pal.gold} size={28} className="kd-twinkle absolute -bottom-1 left-2" />
          <Sparkle color="#fff" size={22} className="kd-twinkle absolute bottom-6 -right-2" style={{ animationDelay: "-1s" }} />
          <Heart color={pal.berry} size={22} className="kd-twinkle absolute -bottom-2 right-8" style={{ animationDelay: "-2s" }} />
        </div>

        {view.name && (
          <h2
            className="m-0 mt-7 break-words font-bold leading-[1.1]"
            style={{
              fontFamily: ROUNDED_FONT,
              fontSize: "clamp(2.2rem, 11vw, 3.1rem)",
              color: pal.berry,
              textShadow: `0 3px 0 #fff, 0 -2px 0 #fff, 3px 0 0 #fff, -3px 0 0 #fff, 0 6px 0 ${shade}, 0 12px 16px ${withAlpha(pal.berry, 0.26)}`,
            }}
          >
            {view.name}
          </h2>
        )}
        <p className="m-0 mt-4 text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: pal.berry, fontFamily: ROUNDED_FONT }}>
          {t("kids.hero.saveDate")}
        </p>
        {date && (
          <p className="m-0 mt-2 inline-block rounded-full px-5 py-2 text-base font-bold" style={{ background: "#fff", color: pal.berry, fontFamily: ROUNDED_FONT, boxShadow: `0 5px 0 -1px ${withAlpha(pal.berry, 0.2)}` }}>
            {date}
          </p>
        )}
      </div>
    </section>
  );
}

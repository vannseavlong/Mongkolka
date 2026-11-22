"use client";

import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { monogramOf } from "../khmer/skin-logic";
import { SakuraCrest } from "./ornaments/Crest";
import { SakuraDivider } from "./ornaments/Divider";
import { SakuraArtStyle } from "./SakuraArtStyle";
import { SAKURA_HERO_CSS, doveUrl, garlandUrl } from "./art/art-css";
import { heroNames, heroPhoto } from "./hero-logic";
import { TWINKLES } from "./opening-logic";
import { SAKURA_GOLD, sakuraPalette } from "./palette";
import { bedVar, branchesVar, foilText, hasKhmer, SCRIPT_FONT } from "./sakura-style";

export interface SakuraHeroProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

/**
 * Sakura hero: blossom branches hang from the top, a flower bed fills the bottom, doves cross the
 * mist, and the couple's portrait sits in a gold-edged arch wreathed in blossoms. Names in gold
 * script (Moul for Khmer), the date in tracked caps. No photo yet: the monogram medallion stands in.
 */
export function SakuraHero({ couple, theme, content }: SakuraHeroProps) {
  const { t, language } = useLanguage();
  const p = sakuraPalette(theme);
  const kh = language === "kh";
  const names = heroNames(couple);
  const photo = heroPhoto(content?.coverPhotoUrl);
  const date = formatWeddingDate(couple.weddingDate, language);
  const foil = foilText(p);
  const pad = "calc(min(100vw, 720px) * 0.2)";
  const goldEdge = `linear-gradient(160deg, ${SAKURA_GOLD.hi}, ${SAKURA_GOLD.mid} 45%, ${SAKURA_GOLD.lo})`;

  return (
    <section
      className="relative isolate overflow-hidden text-center"
      style={{
        color: theme.text_color,
        fontFamily: KHMER_BODY_FONT,
        backgroundColor: p.petalPale,
        backgroundImage: `radial-gradient(80% 50% at 50% 30%, #ffffff 0%, rgba(255,255,255,0) 70%), linear-gradient(180deg, #ffffff 0%, ${p.petalPale} 38%, ${theme.bg_color} 100%)`,
      }}
    >
      <SakuraArtStyle accent={theme.accent_color} />
      <style href="mk-sakura-hero" precedence="mk-sakura">
        {SAKURA_HERO_CSS}
      </style>
      <div aria-hidden className="sk-layer sk-top sk-sway" style={{ backgroundImage: `var(${branchesVar(theme.accent_color)})`, zIndex: 1 }} />
      <div aria-hidden className="sk-layer sk-bottom" style={{ backgroundImage: `var(${bedVar(theme.accent_color)})`, zIndex: 1 }} />
      <div aria-hidden className="sk-dove" style={{ top: "18%", backgroundImage: doveUrl(theme.accent_color), zIndex: 1, animationDelay: "2s" }} />
      {TWINKLES.map((s, i) => (
        <span key={i} aria-hidden className="sk-twinkle" style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s`, transform: `scale(${s.scale})`, zIndex: 1 }} />
      ))}

      <div className="relative z-[3] mx-auto flex max-w-md flex-col items-center gap-4 px-6" style={{ paddingTop: pad, paddingBottom: pad }}>
        <p className="m-0 text-[2.1rem] leading-none" style={{ ...foil, fontFamily: kh ? MOUL_FONT : SCRIPT_FONT, fontSize: kh ? "1.15rem" : undefined, lineHeight: kh ? 2 : 1 }}>
          {t("sakura.tagline")}
        </p>

        <div className="sk-hero-frame">
          <div className="sk-photo" style={{ backgroundImage: goldEdge, boxShadow: `0 22px 40px -22px ${p.accent}` }}>
            <div className="sk-photo-in">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="sk-photo-img" src={photo} alt={formatCoupleNames(couple)} />
              ) : (
                <div className="sk-photo-img flex items-center justify-center">
                  <SakuraCrest color={theme.accent_color} ground={p.petalPale} label={monogramOf(couple)} size={120} />
                </div>
              )}
            </div>
          </div>
          <div aria-hidden className="sk-garland" style={{ backgroundImage: garlandUrl(theme.accent_color) }} />
        </div>

        <h2 className="m-0 flex flex-col items-center leading-[1.05]">
          {names.map((n, i) => (
            <span key={i} className="flex flex-col items-center">
              {i > 0 && (
                <span aria-hidden className="my-1 text-xl" style={{ ...foil, fontFamily: SCRIPT_FONT }}>
                  &amp;
                </span>
              )}
              <span
                style={{
                  ...foil,
                  fontFamily: hasKhmer(n) ? MOUL_FONT : SCRIPT_FONT,
                  fontSize: hasKhmer(n) ? "clamp(1.25rem, 6vw, 1.9rem)" : "clamp(2.7rem, 13vw, 4rem)",
                  lineHeight: hasKhmer(n) ? 1.9 : 1.05,
                  overflowWrap: "anywhere",
                }}
              >
                {n}
              </span>
            </span>
          ))}
        </h2>

        <SakuraDivider color={theme.accent_color} width={200} />

        {date && (
          <p className="m-0 text-sm uppercase" style={{ letterSpacing: kh ? "normal" : "0.2em", fontFamily: kh ? KHMER_BODY_FONT : CINZEL_FONT }}>
            {date}
          </p>
        )}
      </div>
    </section>
  );
}

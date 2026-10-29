"use client";

// STUB: replaced by Web-grace-hero
import { GraceSection, Cross, gracePalette } from "./shared";
import { useLanguage } from "../../i18n";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { formatCoupleNames } from "../../format";

export interface GraceHeroProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

export function GraceHero({ couple, theme }: GraceHeroProps) {
  const { t } = useLanguage();
  const p = gracePalette(theme);
  return (
    <GraceSection theme={theme} id="hero" className="text-center">
      <Cross stroke={p.accent} className="mx-auto h-10 w-auto" />
      <h2 className="mt-4 text-2xl" style={{ color: p.accent }}>{t("grace.hero.stub")}</h2>
      <p className="mt-3 break-words">{formatCoupleNames(couple)}</p>
    </GraceSection>
  );
}

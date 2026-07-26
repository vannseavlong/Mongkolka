"use client";

import { Heart } from "lucide-react";
import type { CoupleInfo, HeroContent, Theme } from "../../types";
import { formatCoupleNames, formatWeddingDate } from "../../format";

export interface HeroClassicProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: HeroContent;
}

export function HeroClassic({ couple, theme, content }: HeroClassicProps) {
  const date = formatWeddingDate(couple.weddingDate);

  return (
    <section
      className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      {content?.coverPhotoUrl && (
        // Plain <img>, not next/image: this package is framework-agnostic and the
        // consuming Next.js app's own eslint-config-next only lints its own code.
        <img
          src={content.coverPhotoUrl}
          alt={formatCoupleNames(couple)}
          className="size-40 rounded-full border-4 object-cover sm:size-48"
          style={{ borderColor: theme.accent_color }}
        />
      )}
      <Heart className="size-8" style={{ color: theme.accent_color }} />
      <h1 className="text-4xl font-medium tracking-wide sm:text-5xl">{formatCoupleNames(couple)}</h1>
      {date && <p className="text-lg opacity-80">{date}</p>}
    </section>
  );
}

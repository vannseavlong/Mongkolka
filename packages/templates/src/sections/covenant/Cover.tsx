"use client";

import type { CSSProperties, ReactNode } from "react";
import type { CoverProps } from "../../types";
import { useLanguage } from "../../i18n";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { useCoverPhase } from "../../cover/use-cover-phase";
import { foilTextGradient, isDarkColor } from "../khmer/foil";
import { BUTTERFLIES, butterflyEntry, FLOWERS } from "./cover-logic";
import { CoverButterflyArt, CoverFlowerArt } from "./cover-art";
import { COVENANT_COVER_CSS } from "./cover-styles";
import { hasKhmer } from "./intro-logic";
import { formatWeddingDate } from "../../format";
import { coupleNamesFor } from "./names";
import { covenantPalette, PINK } from "./palette";

type Vars = CSSProperties & Record<`--${string}`, string | number>;
const SCRIPT = 'var(--font-script), "Great Vibes", cursive';

/**
 * Shared frame of both Covenant covers: ground, gold frame, the couple's names, and the play -> reveal
 * timing. The scene (butterflies or flowers) is passed in. Tap or Enter skips to the reveal.
 */
function CovenantCoverShell({ couple, theme, onReveal, onDone, preview, scene }: CoverProps & { scene: (p: ReturnType<typeof covenantPalette>) => ReactNode }) {
  const { t, language } = useLanguage();
  const { phase, timing, reduce, skip } = useCoverPhase({ onReveal, onDone, preview });
  const p = covenantPalette(theme);
  const { first, second } = coupleNamesFor(couple, language);
  const kh = language === "kh";
  const date = formatWeddingDate(couple.weddingDate, language);
  const foil: CSSProperties = {
    backgroundImage: foilTextGradient(theme.accent_color, isDarkColor(theme.bg_color) ? theme.bg_color : "#ffffff"),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
  const nameFace = (n: string): CSSProperties =>
    hasKhmer(n)
      ? { fontFamily: MOUL_FONT, fontSize: "clamp(1.5rem,8vw,2.2rem)", lineHeight: 1.9 }
      : { fontFamily: SCRIPT, fontSize: "clamp(2.8rem,14vw,4.2rem)", lineHeight: 1.15 };
  const vars: Vars = {
    "--cv-ground": p.ground,
    "--cv-wash": p.wash,
    "--cv-mid": p.gold.mid,
    "--rv": `${timing.revealMs}ms`,
    "--rvd": reduce ? "0ms" : "250ms",
    color: theme.text_color,
    fontFamily: KHMER_BODY_FONT,
  };
  const className = ["cvc", phase === "reveal" ? "is-reveal" : "", reduce ? "is-still" : ""].filter(Boolean).join(" ");

  return (
    <div
      className={className}
      style={vars}
      data-mk-cover
      data-mk-lang={language}
      role="button"
      tabIndex={0}
      aria-label={t("covenant.skip")}
      onClick={skip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          skip();
        }
      }}
    >
      <style href="mk-covenant-cover-css" precedence="mk-covenant">
        {COVENANT_COVER_CSS}
      </style>
      <span aria-hidden className="cvc-frame" />
      <span aria-hidden className="cvc-frame in" />
      {scene(p)}
      <div className="cvc-names">
        <h1 className="m-0 flex flex-wrap items-center justify-center gap-x-3 cvc-rise" style={{ filter: `drop-shadow(0 2px 3px ${withAlpha(PINK.deepRose, 0.25)})`, "--at": "600ms" } as Vars}>
          <span style={{ ...foil, ...nameFace(first) }}>{first}</span>
          {second && (
            <>
              <span style={{ ...foil, fontFamily: SCRIPT, fontSize: "clamp(1.8rem,9vw,2.6rem)" }}>&amp;</span>
              <span style={{ ...foil, ...nameFace(second) }}>{second}</span>
            </>
          )}
        </h1>
        {date && (
          <p className="cvc-rise m-0" style={{ "--at": "1400ms", color: p.gold.mid, fontFamily: kh ? MOUL_FONT : CINZEL_FONT, letterSpacing: "0.2em", fontSize: "0.8rem" } as Vars}>
            {date}
          </p>
        )}
      </div>
      <p className="cvc-hint">{t("covenant.skip")}</p>
    </div>
  );
}

function ButterflyScene(p: ReturnType<typeof covenantPalette>): ReactNode {
  return (
    <div aria-hidden className="absolute inset-0">
      {BUTTERFLIES.map((b, i) => {
        const { dx, dy } = butterflyEntry(b);
        return (
          <span
            key={i}
            className="cvc-bf"
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size * 0.8, "--rot": `${b.rot}deg`, "--t": `${b.delay}ms`, "--dx": `${dx}vw`, "--dy": `${dy}vh`, "--away": `${(i % 4) * 90}ms` } as Vars}
          >
            <span className="cvc-bf-in block">
              <CoverButterflyArt tone={b.tone} p={p} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function GardenScene(p: ReturnType<typeof covenantPalette>): ReactNode {
  return (
    <div aria-hidden className="absolute inset-0">
      {FLOWERS.map((f, i) => (
        <span key={i} className="cvc-fl" style={{ left: `${f.x}%`, top: `${f.y}%`, width: f.size, height: f.size, "--t": `${f.delay}ms`, "--away": `${(i % 4) * 80}ms` } as Vars}>
          <span className="cvc-fl-in block" style={{ animationDuration: `${20 + (i % 5) * 4}s` }}>
            <CoverFlowerArt tone={f.tone} p={p} />
          </span>
        </span>
      ))}
    </div>
  );
}

export function CovenantButterflyCover(props: CoverProps) {
  return <CovenantCoverShell {...props} scene={ButterflyScene} />;
}

export function CovenantGardenCover(props: CoverProps) {
  return <CovenantCoverShell {...props} scene={GardenScene} />;
}



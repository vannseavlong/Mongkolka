"use client";

import { useMemo, type CSSProperties, type ReactNode } from "react";
import type { CoverProps } from "../../types";
import { useLanguage } from "../../i18n";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { useCoverPhase } from "../../cover/use-cover-phase";
import { formatWeddingDate } from "../../format";
import { foilTextGradient, isDarkColor } from "../khmer/foil";
import { BUTTERFLIES, bloomCluster, butterflyEntry, DOVES, FLYERS, FOLIAGE_REGIONS, leafCluster, SPARKLES } from "./cover-logic";
import {
  CoverButterflyArt,
  CoverChandelierArt,
  CoverDoveArt,
  CoverFlowerArt,
  CoverLeafArt,
  CoverSparkleArt,
} from "./cover-art";
import { COVENANT_COVER_CSS } from "./cover-styles";
import { hasKhmer, petals, unit } from "./intro-logic";
import { coupleNamesFor } from "./names";
import { covenantPalette, PINK, type CovenantPalette } from "./palette";

type Vars = CSSProperties & Record<`--${string}`, string | number>;
const SCRIPT = 'var(--font-script), "Great Vibes", cursive';

/** Light that is always there: drifting petals, rising gold bokeh and twinkling sparkles. */
function Ambient({ p }: { p: CovenantPalette }) {
  const fall = useMemo(() => petals(14), []);
  return (
    <div aria-hidden className="absolute inset-0">
      {fall.map((pt, i) => (
        <span key={i} className="cvc-petal" style={{ left: `${pt.x}%`, width: pt.size, height: pt.size * 1.3, "--d": `${Math.round(pt.duration * 1.6)}s`, "--t": `${pt.delay}s`, "--x": `${pt.drift}px`, "--r": `${pt.spin}deg` } as Vars} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <span key={`b${i}`} className="cvc-bokeh" style={{ left: `${8 + unit(i, 31) * 84}%`, width: 8 + unit(i, 32) * 22, height: 8 + unit(i, 32) * 22, "--d": `${8 + unit(i, 33) * 6}s`, "--t": `${unit(i, 34) * 6}s` } as Vars} />
      ))}
      {SPARKLES.map((s, i) => (
        <span key={i} className="cvc-sp" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, "--t": `${s.delay}ms`, "--dur": `${s.duration}ms` } as Vars}>
          <CoverSparkleArt p={p} />
        </span>
      ))}
    </div>
  );
}

/** How far a piece starts from its place: pushed toward the nearest screen edge, so the garden grows in from the borders. Returns vmin offsets. */
function edgeOffset(x: number, y: number, vmin: number): Vars {
  const dx = Math.abs(x - 50) > Math.abs(y - 50) ? (x < 50 ? -vmin : vmin) : 0;
  const dy = dx === 0 ? (y < 50 ? -vmin : vmin) : 0;
  return { "--ox": `${dx}vmin`, "--oy": `${dy}vmin` };
}

/** Foliage framing the screen: leaves first, then blooms on top, dense at the top, sides and bottom. `density` thins it for lighter covers. */
function Foliage({ p, density }: { p: CovenantPalette; density: number }) {
  const { leaves, blooms } = useMemo(
    () => ({
      leaves: FOLIAGE_REGIONS.flatMap((r, i) => leafCluster(r.region, Math.round(r.leaves * density), 10 + i * 7)),
      blooms: FOLIAGE_REGIONS.flatMap((r, i) => bloomCluster(r.region, Math.round(r.blooms * density), 40 + i * 11)),
    }),
    [density],
  );
  // far blooms first so near ones sit on top
  const ordered = useMemo(() => [...blooms].sort((a, b) => Number(b.far) - Number(a.far)), [blooms]);
  return (
    <div aria-hidden className="absolute inset-0 z-[1]">
      {leaves.map((l, i) => (
        <span key={`l${i}`} className="cvc-leafy" style={{ left: `${l.x}%`, top: `${l.y}%`, width: `${l.size}vmin`, "--r": `${l.rot}deg`, "--t": `${l.delay}ms`, ...edgeOffset(l.x, l.y, 7) } as Vars}>
          <CoverLeafArt deep={l.deep} />
        </span>
      ))}
      {ordered.map((b, i) => (
        <span key={`f${i}`} className={`cvc-bloom${b.far ? " far" : ""}`} style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.size}vmin`, "--r": `${b.rot}deg`, "--t": `${b.delay}ms`, ...edgeOffset(b.x, b.y, 9) } as Vars}>
          <span style={{ animationDelay: `${(i % 7) * 400}ms` }}>
            <CoverFlowerArt tone={b.tone} p={p} />
          </span>
        </span>
      ))}
    </div>
  );
}

/** The backdrop every cover shares: mist, soft trees, a light halo, the foliage and two chandeliers. */
function World({ p, density, children }: { p: CovenantPalette; density: number; children: ReactNode }) {
  return (
    <div aria-hidden className="cvc-world">
      <span className="cvc-trees" />
      <span className="cvc-halo" />
      <span className="cvc-mist" />
      <span className="cvc-mist two" />
      <Ambient p={p} />
      <Foliage p={p} density={density} />
      <span className="cvc-chand l">
        <CoverChandelierArt p={p} />
      </span>
      <span className="cvc-chand r">
        <CoverChandelierArt p={p} />
      </span>
      {children}
    </div>
  );
}

function Butterflies({ p }: { p: CovenantPalette }) {
  return (
    <div className="absolute inset-0">
      {BUTTERFLIES.map((b, i) => {
        const { dx, dy } = butterflyEntry(b);
        return (
          <span key={i} className="cvc-bf" style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size * 0.8, "--rot": `${b.rot}deg`, "--t": `${b.delay}ms`, "--dx": `${dx}vw`, "--dy": `${dy}vh` } as Vars}>
            <span className="cvc-bf-in block">
              <CoverButterflyArt tone={b.tone} p={p} />
            </span>
          </span>
        );
      })}
      {FLYERS.map((f, i) => (
        <span key={`f${i}`} className="cvc-fy" style={{ width: f.size, height: f.size * 0.8, "--path": `cvc-fly-${f.path}`, "--dur": `${f.duration}ms`, "--t": `${f.delay}ms` } as Vars}>
          <CoverButterflyArt tone={f.tone} p={p} />
        </span>
      ))}
    </div>
  );
}

function Doves({ p }: { p: CovenantPalette }) {
  return (
    <div className="absolute inset-0">
      {DOVES.map((d, i) => (
        <span key={i} className="cvc-fy" style={{ width: d.size, height: d.size * 0.7, "--path": `cvc-fly-${d.path}`, "--dur": `${d.duration}ms`, "--t": `${d.delay}ms` } as Vars}>
          <CoverDoveArt p={p} />
        </span>
      ))}
    </div>
  );
}

/**
 * Shared frame of both Covenant covers: a garden in soft mist with the couple's names and date floating in the clear middle. Plays by itself, then the camera pushes through while an iris opens
 * over the opening gate that mounts beneath. It cannot be skipped.
 */
function CovenantCoverShell({
  couple,
  theme,
  onReveal,
  onDone,
  preview,
  density,
  critters,
}: CoverProps & { density: number; critters: (p: CovenantPalette) => ReactNode }) {
  const { t, language } = useLanguage();
  const { phase, timing, reduce } = useCoverPhase({ onReveal, onDone, preview });
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
      ? { fontFamily: MOUL_FONT, fontSize: "calc(var(--pw) * .075)", lineHeight: 1.9 }
      : { fontFamily: SCRIPT, fontSize: "calc(var(--pw) * .2)", lineHeight: 1.1 };
  const vars: Vars = {
    "--cv-ground": p.ground,
    "--cv-wash": p.wash,
    "--cv-mid": p.gold.mid,
        "--cv-petal": withAlpha(PINK.petal, 0.6),
    "--cv-rose": PINK.rose,
    "--rv": `${timing.revealMs}ms`,
    "--pw": "min(86vw,560px,calc(120svh / 1.4))",
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
    >
      <style href="mk-covenant-cover-css" precedence="mk-covenant">
        {COVENANT_COVER_CSS}
      </style>
      <World p={p} density={density}>
        {critters(p)}
      </World>

      <div className="cvc-glass">
        <p className="cvc-rise m-0" style={{ "--at": "1400ms", color: p.gold.mid, fontFamily: kh ? MOUL_FONT : CINZEL_FONT, letterSpacing: kh ? "normal" : "0.22em", textTransform: "uppercase", fontSize: "calc(var(--pw) * .032)", lineHeight: 1.9 } as Vars}>
          {t("covenant.tagline")}
        </p>
        <h1 className="cvc-rise m-0 flex flex-col items-center" style={{ filter: `drop-shadow(0 0 14px rgba(255,255,255,.95)) drop-shadow(0 2px 3px ${withAlpha(PINK.deepRose, 0.25)})`, "--at": "2000ms" } as Vars}>
          <span style={{ ...foil, ...nameFace(first) }}>{first}</span>
          {second && (
            <>
              <span style={{ ...foil, fontFamily: SCRIPT, fontSize: "calc(var(--pw) * .1)", lineHeight: 1 }}>&amp;</span>
              <span style={{ ...foil, ...nameFace(second) }}>{second}</span>
            </>
          )}
        </h1>
        <div className="cvc-divider" aria-hidden>
          <i />
          <b />
          <i />
        </div>
        {date && (
          <p className="cvc-rise m-0" style={{ "--at": "3400ms", color: p.gold.mid, fontFamily: kh ? MOUL_FONT : CINZEL_FONT, letterSpacing: kh ? "normal" : "0.2em", textTransform: "uppercase", fontSize: "calc(var(--pw) * .042)", lineHeight: 1.8 } as Vars}>
            {date}
          </p>
        )}
      </div>
    </div>
  );
}

/** Garden with white doves crossing, dense blooms. */
export function CovenantGardenCover(props: CoverProps) {
  return <CovenantCoverShell {...props} density={1} critters={(p) => <Doves p={p} />} />;
}

/** The same scene with lighter foliage, and butterflies hovering and crossing. */
export function CovenantButterflyCover(props: CoverProps) {
  return <CovenantCoverShell {...props} density={0.6} critters={(p) => <Butterflies p={p} />} />;
}

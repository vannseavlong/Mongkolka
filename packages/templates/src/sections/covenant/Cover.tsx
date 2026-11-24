"use client";

import { useId, useMemo, type CSSProperties, type ReactNode } from "react";
import type { CoverProps } from "../../types";
import { useLanguage } from "../../i18n";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { useCoverPhase } from "../../cover/use-cover-phase";
import { formatWeddingDate } from "../../format";
import { foilTextGradient, isDarkColor } from "../khmer/foil";
import { BUTTERFLIES, butterflyEntry, FLOWERS, FLYERS, initialOf, SPARKLES, wreath } from "./cover-logic";
import { CoverButterflyArt, CoverFlowerArt, CoverRing, CoverSparkleArt, CoverVine } from "./cover-art";
import { COVENANT_COVER_CSS } from "./cover-styles";
import { hasKhmer, petals } from "./intro-logic";
import { coupleNamesFor } from "./names";
import { covenantPalette, PINK, type CovenantPalette } from "./palette";

type Vars = CSSProperties & Record<`--${string}`, string | number>;
const SCRIPT = 'var(--font-script), "Great Vibes", cursive';
const TONES = ["rose", "blush", "white", "gold"] as const;

/** Light that is always there: slow sunburst rays, drifting petals, twinkling sparkles. */
function Ambient({ p }: { p: CovenantPalette }) {
  const fall = useMemo(() => petals(16), []);
  return (
    <div aria-hidden className="absolute inset-0">
      <span className="cvc-rays" />
      {fall.map((pt, i) => (
        <span key={i} className="cvc-petal" style={{ left: `${pt.x}%`, width: pt.size, height: pt.size * 1.3, "--d": `${pt.duration}s`, "--t": `${pt.delay}s`, "--x": `${pt.drift}px`, "--r": `${pt.spin}deg` } as Vars} />
      ))}
      {SPARKLES.map((s, i) => (
        <span key={i} className="cvc-sp" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, "--t": `${s.delay}ms`, "--dur": `${s.duration}ms` } as Vars}>
          <CoverSparkleArt p={p} />
        </span>
      ))}
    </div>
  );
}

/** Four corner vines that grow in, mirrored. Garden vines end in a bloom. */
function Vines({ p, bloom }: { p: CovenantPalette; bloom: boolean }) {
  return (
    <>
      {(["tl", "tr", "bl", "br"] as const).map((pos, i) => (
        <div key={pos} aria-hidden className={`cvc-corner ${pos}`}>
          <CoverVine p={p} bloom={bloom} delay={300 + i * 220} />
        </div>
      ))}
    </>
  );
}

function ButterflyScene({ p }: { p: CovenantPalette }) {
  return (
    <>
      <Vines p={p} bloom={false} />
      <div aria-hidden className="absolute inset-0">
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
          <span key={i} className="cvc-fy" style={{ width: f.size, height: f.size * 0.8, "--path": `cvc-fly-${f.path}`, "--dur": `${f.duration}ms`, "--t": `${f.delay}ms` } as Vars}>
            <CoverButterflyArt tone={f.tone} p={p} />
          </span>
        ))}
      </div>
    </>
  );
}

const LEAF = "M0 0 C6 -9 17 -9 24 0 C17 9 6 9 0 0 Z";

/** Flowers in the corners and along the bottom, plus a wreath of blooms and leaves around the medallion. */
function GardenScene({ p }: { p: CovenantPalette }) {
  return (
    <>
      <Vines p={p} bloom />
      <div aria-hidden className="absolute inset-0">
        {FLOWERS.map((f, i) => (
          <span key={i} className="cvc-fl" style={{ left: `${f.x}%`, top: `${f.y}%`, width: f.size, height: f.size, "--t": `${f.delay}ms` } as Vars}>
            <span className="cvc-fl-in block" style={{ animationDuration: `${5 + (i % 4)}s` }}>
              <CoverFlowerArt tone={f.tone} p={p} />
            </span>
          </span>
        ))}
      </div>
    </>
  );
}

/** Blooms and leaves ringed around the medallion (garden only), positioned in % of the medallion box. */
function Wreath({ p }: { p: CovenantPalette }) {
  const spots = wreath(24, 56);
  return (
    <div aria-hidden className="cvc-wreath">
      {spots.map((pt, i) =>
        i % 2 ? (
          <span key={i} className="cvc-wl" style={{ left: `${pt.x}%`, top: `${pt.y}%`, "--a": `${pt.angle + 90}deg`, animationDelay: `${900 + i * 55}ms` } as Vars}>
            <svg viewBox="-2 -10 28 20" width="100%" height="100%">
              <path d={LEAF} fill={p.gold.mid} fillOpacity={0.85} stroke={p.gold.lo} strokeWidth={0.8} />
            </svg>
          </span>
        ) : (
          <span key={i} className="cvc-fl" style={{ left: `${pt.x}%`, top: `${pt.y}%`, width: "13%", height: "13%", "--t": `${700 + i * 55}ms` } as Vars}>
            <span className="cvc-fl-in block" style={{ animationDuration: `${5 + (i % 4)}s` }}>
              <CoverFlowerArt tone={TONES[(i / 2) % TONES.length]!} p={p} />
            </span>
          </span>
        ),
      )}
    </div>
  );
}

/**
 * Shared frame of both Covenant covers: a gold frame that draws itself, a medallion with the couple's
 * monogram, their names and the date, over an ambient layer and the variant's scene. Plays by itself,
 * then an iris opens from the centre over the opening gate. Tap or Enter skips to the reveal.
 */
function CovenantCoverShell({
  couple,
  theme,
  onReveal,
  onDone,
  preview,
  scene,
  garland,
}: CoverProps & { scene: (p: CovenantPalette) => ReactNode; garland?: boolean }) {
  const { t, language } = useLanguage();
  const { phase, timing, reduce, skip } = useCoverPhase({ onReveal, onDone, preview });
  const frameId = useId();
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
      ? { fontFamily: MOUL_FONT, fontSize: "clamp(1.4rem,7vw,2.1rem)", lineHeight: 1.9 }
      : { fontFamily: SCRIPT, fontSize: "clamp(2.6rem,12vw,4rem)", lineHeight: 1.15 };
  const mono = (n: string): CSSProperties => ({
    ...foil,
    fontFamily: hasKhmer(n) ? MOUL_FONT : SCRIPT,
    fontSize: hasKhmer(n) ? "calc(var(--ring) * .22)" : "calc(var(--ring) * .35)",
    lineHeight: 1,
  });
  const vars: Vars = {
    "--cv-ground": p.ground,
    "--cv-wash": p.wash,
    "--cv-mid": p.gold.mid,
    "--cv-glow": withAlpha(p.gold.mid, 0.16),
    "--cv-petal": withAlpha(PINK.petal, 0.6),
    "--cv-rose": PINK.rose,
    "--rv": `${timing.revealMs}ms`,
    "--ring": "clamp(200px,min(58vw,42svh),380px)",
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
      <Ambient p={p} />
      {scene(p)}
      {[0, 1].map((n) => (
        <svg key={`${frameId}${n}`} aria-hidden className={`cvc-frame${n ? " in" : ""}`} width="100%" height="100%" overflow="visible">
          <rect pathLength={1} className="cvc-draw" style={{ animationDelay: `${n * 250}ms` }} />
        </svg>
      ))}

      <div className="cvc-center">
        <div className="cvc-ringbox">
          <div className="cvc-ringart">
            <CoverRing p={p} />
          </div>
          {garland && <Wreath p={p} />}
          <div className="cvc-mono" aria-hidden>
            <span style={mono(first)}>{initialOf(first)}</span>
            {second && (
              <>
                <span style={{ ...foil, fontFamily: SCRIPT, fontSize: "calc(var(--ring) * .15)", lineHeight: 1, margin: "0 .12em" }}>&amp;</span>
                <span style={mono(second)}>{initialOf(second)}</span>
              </>
            )}
          </div>
        </div>
        <h1 className="cvc-rise m-0 flex flex-wrap items-center justify-center gap-x-3" style={{ filter: `drop-shadow(0 2px 3px ${withAlpha(PINK.deepRose, 0.25)})`, "--at": "1800ms" } as Vars}>
          <span style={{ ...foil, ...nameFace(first) }}>{first}</span>
          {second && (
            <>
              <span style={{ ...foil, fontFamily: SCRIPT, fontSize: "clamp(1.6rem,8vw,2.4rem)" }}>&amp;</span>
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
          <p className="cvc-rise m-0" style={{ "--at": "3200ms", color: p.gold.mid, fontFamily: kh ? MOUL_FONT : CINZEL_FONT, letterSpacing: kh ? "normal" : "0.22em", textTransform: "uppercase", fontSize: "0.85rem", lineHeight: 1.8 } as Vars}>
            {date}
          </p>
        )}
      </div>
      <p className="cvc-hint">{t("covenant.skip")}</p>
    </div>
  );
}

export function CovenantButterflyCover(props: CoverProps) {
  return <CovenantCoverShell {...props} scene={(p) => <ButterflyScene p={p} />} />;
}

export function CovenantGardenCover(props: CoverProps) {
  return <CovenantCoverShell {...props} garland scene={(p) => <GardenScene p={p} />} />;
}

"use client";

import { useMemo, type CSSProperties } from "react";
import type { OpeningProps } from "../../types";
import { useLanguage } from "../../i18n";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { foilTextGradient } from "../khmer/foil";
import { monogramOf } from "../khmer/skin-logic";
import { Door } from "./art/Door";
import { EmeraldBackdrop } from "./art/Backdrop";
import { GateFrame } from "./art/GateFrame";
import { Medallion } from "./art/Medallion";
import { EMERALD_CSS } from "./emerald-styles";
import { archPolygon, gildedMotes, hasKhmer, sparkBurst } from "./opening-logic";
import { emeraldPalette } from "./palette";
import { useOpening } from "./use-opening";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * Cover gate for the Emerald Kbach template. Two emerald doors with gold pin-striping and kbach panels
 * stand under a pointed gold arch, a gold medallion on the seam. One tap swings the doors open in 3D
 * (the seal falls away), a larger medallion turns into view in a burst of gold sparks, then `onOpen`
 * fires. Slow gold motes drift behind everything. Reduced motion skips the swing and opens quickly.
 */
export function EmeraldOpening({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const { t, language } = useLanguage();
  const { phase, tap } = useOpening(onOpen);
  const p = emeraldPalette(theme);
  const open = phase !== "closed";
  const label = monogramOf(couple);
  const motes = useMemo(() => gildedMotes(16), []);
  const sparks = useMemo(() => sparkBurst(18, 150), []);
  const arch = useMemo(() => archPolygon(), []);
  const date = formatWeddingDate(couple.weddingDate, language);
  const khmer = language === "kh";
  const nameKhmer = hasKhmer(formatCoupleNames(couple));

  const vars: Vars = {
    "--em-hi": p.gold.hi,
    "--em-mid": p.gold.mid,
    "--em-lo": p.gold.lo,
    "--em-deep": p.deep,
    "--em-glow": withAlpha(p.gold.mid, 0.28),
    "--em-ring": withAlpha(p.gold.mid, 0.5),
    backgroundColor: p.deep,
    color: theme.text_color,
    fontFamily: KHMER_BODY_FONT,
  };

  return (
    <div className={`em-stage${open ? " is-open" : ""}`} style={vars} data-mk-lang={language}>
      <style href="mk-emerald-css" precedence="mk-emerald">
        {EMERALD_CSS}
      </style>
      <EmeraldBackdrop accent={theme.accent_color} ground={p.ground} deep={p.deep} />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {motes.map((m, i) => (
          <span key={i} className="em-mote" style={{ left: `${m.x}%`, width: m.size, height: m.size, "--d": `${m.duration}s`, "--t": `${m.delay}s`, "--x": `${m.drift}px` } as Vars} />
        ))}
      </div>

      <div className="em-fadeout relative z-10 flex max-w-[88vw] flex-col items-center gap-1">
        <p
          className="m-0 text-[0.8rem] leading-relaxed sm:text-sm"
          style={{ fontFamily: MOUL_FONT, color: theme.accent_color, backgroundImage: foilTextGradient(theme.accent_color, p.ground), WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: khmer ? "normal" : "0.04em" }}
        >
          {t("emerald.greeting")}
        </p>
        {guestGreeting && (
          <p className="m-0 text-sm" style={{ color: p.gold.hi }}>
            {t("khmer.dear")} <strong className="font-semibold">{guestGreeting}</strong>
          </p>
        )}
      </div>

      <div className="relative z-10 cursor-pointer" onClick={tap}>
        <div className="em-gate" aria-hidden>
          <div className="em-clip" style={{ clipPath: arch }}>
            <div className="em-scene">
              <div className="em-reveal em-fit" style={{ "--w": "82%" } as Vars}>
                <Medallion color={theme.accent_color} ground={p.ground} label={label} size={300} spin />
              </div>
              {sparks.map((s, i) => (
                <span key={i} className="em-spark" style={{ width: s.size, height: s.size, "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, "--t": `${s.delay}s` } as Vars} />
              ))}
            </div>
            <div className="em-door em-door-l">
              <Door color={theme.accent_color} face={p.lift} deep={p.deep} />
            </div>
            <div className="em-door em-door-r">
              <Door color={theme.accent_color} face={p.lift} deep={p.deep} />
            </div>
          </div>
          <GateFrame color={theme.accent_color} deep={p.deep} />
          <div className="em-seal em-fit" style={{ "--w": "50%" } as Vars}>
            <Medallion color={theme.accent_color} ground={p.ground} label={label} size={200} spin />
          </div>
        </div>
      </div>

      <div className="em-fadeout relative z-10 flex max-w-[90vw] flex-col items-center gap-3">
        <h1
          className="m-0 leading-tight"
          style={{
            fontFamily: nameKhmer ? MOUL_FONT : 'var(--font-script), "Great Vibes", cursive',
            fontSize: nameKhmer ? "clamp(1.1rem,5.4vw,1.6rem)" : "clamp(2rem,9.5vw,3rem)",
            fontWeight: 400,
            backgroundImage: foilTextGradient(theme.accent_color, p.ground),
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))",
          }}
        >
          {formatCoupleNames(couple)}
        </h1>
        {date && (
          <p className="m-0 text-sm tracking-[0.18em]" style={{ color: p.gold.hi }}>
            {date}
          </p>
        )}
        <button type="button" className={`em-cta${open ? "" : " em-pulse"}`} onClick={tap} disabled={open} style={{ fontFamily: khmer ? MOUL_FONT : KHMER_BODY_FONT, fontSize: khmer ? "0.82rem" : "0.95rem" }}>
          {t("emerald.open")}
        </button>
      </div>
    </div>
  );
}

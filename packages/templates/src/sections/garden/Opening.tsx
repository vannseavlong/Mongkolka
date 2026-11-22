"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import type { OpeningProps } from "../../types";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { useLanguage } from "../../i18n";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { goldGradient, withAlpha } from "../../chrome/gold";
import { monogramOf } from "../khmer/skin-logic";
import { Dove, RoseVine } from "./art/Botanicals";
import { GardenCourt } from "./art/Court";
import { GateLeaf } from "./art/Gate";
import { GARDEN_CSS } from "./garden-css";
import { GardenCrest } from "./ornaments/GardenCrest";
import { canStart, phaseAfterTap, timelineFor, timelineVars, GATE_TIMELINE, type GatePhase } from "./opening-logic";
import { gardenPalette } from "./palette";

const SCRIPT_FONT = 'var(--font-script), "Great Vibes", cursive';
const ARCH = "50% 50% 28px 28px / 34% 34% 28px 28px";

/**
 * The garden-gate cover. A closed gold wrought-iron gate stands in front of a palace-garden court (seen,
 * veiled, through the bars) with the invitation on an arched gold cartouche. Tapping the button swings the
 * two leaves apart in 3D, the veil lifts off the fountain court, the line "Join Us Together Till Eternity"
 * appears, doves cross the sky, then the page fades in. Transforms and opacity only; with reduced motion
 * the invitation opens at once. The real button is the only interactive element (Enter / Space work).
 */
export function GardenOpening({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const { t, language } = useLanguage();
  const reduce = useReducedMotion();
  const p = gardenPalette(theme);
  const [phase, setPhase] = useState<GatePhase>("closed");
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    if (phase !== "opening") return;
    const timer = setTimeout(() => onOpenRef.current(), GATE_TIMELINE.totalMs);
    return () => clearTimeout(timer);
  }, [phase]);

  const start = () => {
    if (!canStart(phase)) return;
    if (timelineFor(Boolean(reduce)) === null) {
      onOpenRef.current();
      return;
    }
    setPhase(phaseAfterTap(phase));
  };

  const kh = language === "kh";
  const names = formatCoupleNames(couple);
  const date = formatWeddingDate(couple.weddingDate, language);
  const guest = guestGreeting?.trim() || undefined;
  const headFont = kh ? MOUL_FONT : CINZEL_FONT;
  const gold = goldGradient(theme.accent_color);
  const rootStyle = { backgroundColor: p.ground, color: p.text, fontFamily: KHMER_BODY_FONT, ...timelineVars(GATE_TIMELINE) } as CSSProperties;
  const foil = (extra?: CSSProperties): CSSProperties => ({
    backgroundImage: gold,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: theme.accent_color,
    ...extra,
  });

  return (
    <div className="gd-open" data-phase={phase} style={rootStyle} role="region" aria-label={t("garden.gateLabel")}>
      <style href="mk-garden-css" precedence="mk-garden">
        {GARDEN_CSS}
      </style>

      <GardenCourt palette={p} className="gd-court" style={{ width: "100%", height: "100%" }} />
      <div className="gd-veil" aria-hidden style={{ background: `linear-gradient(180deg, ${withAlpha(p.ground, 0.78)}, ${withAlpha(p.ground, 0.5)})` }} />

      <p className="gd-tagline m-0" style={{ fontFamily: SCRIPT_FONT, fontSize: "clamp(1.9rem, 9.5vw, 3rem)", lineHeight: 1.15, color: p.gold.lo, textShadow: `0 1px 0 ${withAlpha("#ffffff", 0.8)}, 0 0 18px ${withAlpha("#ffffff", 0.9)}` }}>
        {t("garden.tagline")}
      </p>

      <div aria-hidden>
        {[0, 1, 2].map((i) => (
          <div key={i} className="gd-dove" style={{ top: `${14 + i * 9}%`, left: 0, width: 46 - i * 8, animationDelay: `calc(var(--gd-dove) + ${i * 380}ms)` }}>
            <Dove palette={p} width={46 - i * 8} />
          </div>
        ))}
      </div>

      <div className="gd-stage" aria-hidden>
        {(["l", "r"] as const).map((side) => (
          <div key={side} className={`gd-leaf gd-leaf-${side}`}>
            <div className="gd-leaf-in">
              <GateLeaf palette={p} style={{ width: "100%", height: "100%" }} />
              <div className="gd-breeze" style={{ position: "absolute", left: -6, bottom: -10 }}>
                <RoseVine palette={p} width={150} />
              </div>
              <div style={{ position: "absolute", left: -22, top: "38%", transform: "rotate(-70deg)", opacity: 0.95 }}>
                <RoseVine palette={p} width={84} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="gd-plaque">
        <div style={{ borderRadius: ARCH, padding: 2, backgroundImage: gold, boxShadow: `0 24px 50px -18px ${withAlpha("#4a3020", 0.55)}` }}>
          <div style={{ borderRadius: ARCH, padding: 5, backgroundColor: p.ground }}>
            <div
              style={{
                borderRadius: ARCH,
                border: `1px solid ${withAlpha(theme.accent_color, 0.75)}`,
                background: `radial-gradient(120% 50% at 50% 100%, ${withAlpha(p.rose, 0.28)}, transparent 70%), ${p.ground}`,
                padding: "26px 20px 24px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <GardenCrest color={theme.accent_color} ground={p.ground} label={monogramOf(couple)} size={92} />
              <p className="m-0" style={foil({ fontFamily: headFont, fontSize: kh ? 12.5 : 11, letterSpacing: kh ? "normal" : "0.2em", textTransform: kh ? "none" : "uppercase", lineHeight: kh ? 2 : 1.6, fontWeight: kh ? 400 : 600 })}>
                {t("garden.greeting")}
              </p>
              {guest && (
                <p className="m-0" style={{ color: p.text, fontSize: 14 }}>
                  {t("khmer.dear")} <span style={foil({ fontFamily: SCRIPT_FONT, fontSize: 24, lineHeight: 1.2 })}>{guest}</span>
                </p>
              )}
              <h1 className="m-0" style={foil({ fontFamily: SCRIPT_FONT, fontWeight: 400, fontSize: "clamp(2rem, 11vw, 2.8rem)", lineHeight: 1.1, overflowWrap: "anywhere" })}>
                {names}
              </h1>
              {date && (
                <p className="m-0" style={{ fontFamily: CINZEL_FONT, fontSize: 12, letterSpacing: "0.18em", color: p.text, opacity: 0.85 }}>
                  {date}
                </p>
              )}
              <button
                type="button"
                data-mk-open
                className="gd-btn"
                onClick={start}
                style={{
                  marginTop: 6,
                  minHeight: 46,
                  padding: "10px 26px",
                  borderRadius: 999,
                  border: `1px solid ${p.gold.lo}`,
                  backgroundImage: gold,
                  color: "#2f2108",
                  fontFamily: headFont,
                  fontSize: kh ? 13 : 12,
                  letterSpacing: kh ? "normal" : "0.12em",
                  boxShadow: `0 6px 14px -6px ${withAlpha("#5a3a10", 0.6)}, inset 0 1px 0 ${withAlpha("#ffffff", 0.55)}`,
                }}
              >
                {t("garden.open")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="gd-fade" aria-hidden style={{ backgroundColor: p.ground }} />
    </div>
  );
}

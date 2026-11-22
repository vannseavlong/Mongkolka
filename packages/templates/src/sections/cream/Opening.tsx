"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import type { OpeningProps } from "../../types";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { formatCoupleNames } from "../../format";
import { useLanguage } from "../../i18n";
import { foilTextGradient } from "../khmer/foil";
import { monogramOf } from "../khmer/skin-logic";
import { Butterfly } from "./art/Butterfly";
import { FloralBorder, HangingFlorals } from "./art/Compositions";
import { Shield } from "./art/Shield";
import { CREAM_CSS } from "./cream-styles";
import { isKhmerText, nameFamily } from "./cream-type";
import { dotDate } from "./date-line";
import { guestName, openingTotalMs } from "./opening-logic";
import { creamPalette } from "./palette";

/**
 * Royal Cream opening: a cream envelope sealed with the couple's gold shield. The guest's name is
 * addressed on the front. Tap: the seal lifts, the flap turns over (its lining is gold-dotted), the
 * invitation card slides up out of the envelope, comes forward, and the scene fades to paper.
 *
 * All motion is CSS (transform/opacity); this file only owns the phase flag and the `onOpen` timer.
 * Reduced motion skips the show and opens at once. The whole envelope is tappable, and the real
 * button (`data-mk-open`, so the shared music starts from it) is the keyboard path.
 */
export function CreamOpening({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const { t, language } = useLanguage();
  const reduce = useReducedMotion();
  const p = creamPalette(theme);
  const [opening, setOpening] = useState(false);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const started = useRef(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!opening) return;
    const timer = setTimeout(() => onOpenRef.current(), openingTotalMs() + 60);
    return () => clearTimeout(timer);
  }, [opening]);

  const start = () => {
    if (started.current) return;
    started.current = true;
    if (reduce) onOpenRef.current();
    else setOpening(true);
  };

  const names = formatCoupleNames(couple);
  const guest = guestName(guestGreeting);
  const date = dotDate(couple.weddingDate, language);
  const kh = language === "kh";
  const bodyFont = KHMER_BODY_FONT;
  const labelFont = kh ? MOUL_FONT : CINZEL_FONT;
  const foil = foilTextGradient(theme.accent_color, theme.bg_color);
  const foilText: CSSProperties = { backgroundImage: foil, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" };

  const vars = {
    "--w": "min(86vw, 330px)",
    "--cr-gold": p.gold,
    "--cr-gold-hi": p.goldHi,
    "--cr-gold-lo": p.goldLo,
    "--cr-gold-a": withAlpha(p.gold, 0.55),
    backgroundColor: p.ground,
    backgroundImage:
      `radial-gradient(70% 40% at 85% 8%, ${p.blush}80, transparent 70%),` +
      `radial-gradient(70% 40% at 10% 62%, ${p.champagne}b3, transparent 70%),` +
      `radial-gradient(60% 40% at 90% 90%, ${p.sage}33, transparent 70%)`,
    color: p.ink,
    fontFamily: bodyFont,
  } as CSSProperties;

  return (
    <div className="cr-gate" data-open={opening} data-mk-lang={language} style={vars}>
      <style href="mk-cream-css" precedence="mk-cream">
        {CREAM_CSS}
      </style>

      {/* scene: blossoms hanging from both top corners, the flower bed along the bottom */}
      <div aria-hidden className="cr-fade" style={{ position: "absolute", top: -6, left: -10, width: "min(36vw, 160px)", zIndex: 1 }}>
        <div className="cr-sway">
          <HangingFlorals theme={theme} />
        </div>
      </div>
      <div aria-hidden className="cr-fade" style={{ position: "absolute", top: -6, right: -10, width: "min(36vw, 160px)", zIndex: 1, transform: "scaleX(-1)" }}>
        <div className="cr-sway">
          <HangingFlorals theme={theme} />
        </div>
      </div>
      <div aria-hidden className="cr-bf cr-bf-a"><Butterfly p={p} size={34} /></div>
      <div aria-hidden className="cr-bf cr-bf-b"><Butterfly p={p} size={28} /></div>
      <div aria-hidden className="cr-bf cr-bf-c"><Butterfly p={p} size={24} /></div>
      <div aria-hidden className="cr-fade" style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 1, maxWidth: 620, margin: "0 auto" }}>
        <FloralBorder theme={theme} />
      </div>

      <div className="cr-stack">
        <header className="cr-fade" style={{ maxWidth: 340 }}>
          <p className="m-0" style={{ ...foilText, fontFamily: kh ? MOUL_FONT : CINZEL_FONT, fontSize: kh ? 17 : 13, letterSpacing: kh ? "normal" : "0.28em", textTransform: kh ? "none" : "uppercase", lineHeight: kh ? 2 : 1.6 }}>
            {t("cream.greeting")}
          </p>
        </header>

        {/* the envelope: back, card, pocket (three folded triangles), address, flap with seal */}
        <div className="cr-env-wrap" onClick={() => button.current?.click()}>
          <div className="cr-env" role="img" aria-label={t("cream.envelope")}>
            <div className="cr-env-back" style={{ backgroundImage: `linear-gradient(160deg, ${p.paperDeep}, ${p.champagne})` }} />

            <div
              className="cr-card"
              style={{
                backgroundImage: `linear-gradient(180deg, ${p.paper}, ${p.paperDeep})`,
                boxShadow: `inset 0 0 0 1px ${withAlpha(p.gold, 0.6)}, inset 0 0 0 4px ${p.paper}, inset 0 0 0 5px ${withAlpha(p.gold, 0.35)}`,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5em" }}>
                <Shield color={theme.accent_color} ground={p.paper} label={monogramOf(couple)} size={34} />
                <h1
                  className="m-0"
                  style={{ ...foilText, fontFamily: nameFamily(names), fontSize: isKhmerText(names) ? "1.35em" : "2.5em", lineHeight: isKhmerText(names) ? 1.8 : 1.15, overflowWrap: "anywhere" }}
                >
                  {names}
                </h1>
                {date && (
                  <p className="m-0" style={{ fontFamily: kh ? bodyFont : CINZEL_FONT, fontSize: "1.05em", letterSpacing: kh ? "0.08em" : "0.22em", color: p.gold }}>
                    {date}
                  </p>
                )}
              </div>
            </div>

            <svg className="cr-pocket" viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden focusable="false">
              <defs>
                <linearGradient id="cr-pk-l" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor={p.paper} />
                  <stop offset="1" stopColor={p.paperDeep} />
                </linearGradient>
                <linearGradient id="cr-pk-r" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={p.paper} />
                  <stop offset="1" stopColor={p.paperDeep} />
                </linearGradient>
                <linearGradient id="cr-pk-b" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={p.paperDeep} />
                  <stop offset="1" stopColor={p.champagne} />
                </linearGradient>
              </defs>
              <polygon points="0,0 50,38.5 0,70" fill="url(#cr-pk-l)" stroke={p.gold} strokeOpacity="0.55" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
              <polygon points="100,0 50,38.5 100,70" fill="url(#cr-pk-r)" stroke={p.gold} strokeOpacity="0.55" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
              <polygon points="0,70 50,38.5 100,70" fill="url(#cr-pk-b)" stroke={p.gold} strokeOpacity="0.6" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
            </svg>

            <div className="cr-addr cr-fade">
              {guest ? (
                <>
                  <p className="m-0" style={{ fontFamily: labelFont, fontSize: kh ? "1.05em" : "0.8em", letterSpacing: kh ? "normal" : "0.24em", textTransform: kh ? "none" : "uppercase", color: p.gold, lineHeight: 1.7 }}>
                    {t("cream.guest")}
                  </p>
                  <p
                    className="m-0"
                    style={{ ...foilText, fontFamily: nameFamily(guest), fontSize: isKhmerText(guest) ? "1.5em" : "2em", lineHeight: isKhmerText(guest) ? 1.8 : 1.15, overflowWrap: "anywhere" }}
                  >
                    {guest}
                  </p>
                </>
              ) : (
                <p className="m-0" style={{ ...foilText, fontFamily: nameFamily(t("cream.tagline")), fontSize: isKhmerText(t("cream.tagline")) ? "1.2em" : "2em", lineHeight: 1.4 }}>
                  {t("cream.tagline")}
                </p>
              )}
            </div>

            <div className="cr-flap">
              <div className="cr-flap-face">
                <svg viewBox="0 0 100 55" preserveAspectRatio="none" width="100%" height="100%" aria-hidden focusable="false" style={{ display: "block" }}>
                  <defs>
                    <linearGradient id="cr-fl-f" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor={p.paper} />
                      <stop offset="1" stopColor={p.paperDeep} />
                    </linearGradient>
                  </defs>
                  <polygon points="0,0 100,0 50,55" fill="url(#cr-fl-f)" stroke={p.gold} strokeOpacity="0.7" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
                  <polygon points="6,2 94,2 50,49" fill="none" stroke={p.gold} strokeOpacity="0.35" strokeWidth="0.7" vectorEffect="non-scaling-stroke" strokeDasharray="1 3" />
                </svg>
                <div className="cr-seal">
                  <Shield color={theme.accent_color} ground={p.paper} label={monogramOf(couple)} size={58} />
                </div>
              </div>
              <div className="cr-flap-face cr-flap-back">
                <svg viewBox="0 0 100 55" preserveAspectRatio="none" width="100%" height="100%" aria-hidden focusable="false" style={{ display: "block" }}>
                  <defs>
                    <pattern id="cr-fl-dots" width="6" height="6" patternUnits="userSpaceOnUse">
                      <circle cx="3" cy="3" r="0.7" fill={p.gold} fillOpacity="0.55" />
                    </pattern>
                    <linearGradient id="cr-fl-b" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor={p.blush} stopOpacity="0.9" />
                      <stop offset="1" stopColor={p.champagne} />
                    </linearGradient>
                  </defs>
                  <polygon points="0,0 100,0 50,55" fill="url(#cr-fl-b)" stroke={p.gold} strokeOpacity="0.7" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
                  <polygon points="0,0 100,0 50,55" fill="url(#cr-fl-dots)" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button ref={button} type="button" className="cr-cta cr-fade" data-mk-open onClick={start} style={{ fontFamily: kh ? bodyFont : CINZEL_FONT, fontWeight: 600, letterSpacing: kh ? "0.02em" : "0.16em", textTransform: kh ? "none" : "uppercase", fontSize: kh ? 16 : 13 }}>
          {t("cream.open")}
        </button>
      </div>
    </div>
  );
}

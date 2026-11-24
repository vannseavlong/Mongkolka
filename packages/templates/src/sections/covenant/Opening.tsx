"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import type { OpeningProps } from "../../types";
import { useLanguage } from "../../i18n";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { foilTextGradient, isDarkColor } from "../khmer/foil";
import { COVENANT_CSS } from "./covenant-styles";
import { coupleNamesFor } from "./names";
import { guestLine, hasKhmer, introFor, petals } from "./intro-logic";
import { COVENANT_ORNAMENTS } from "./ornaments";
import { covenantPalette, PINK } from "./palette";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const SCRIPT = 'var(--font-script), "Great Vibes", cursive';

/** Timing for one animated piece: when it starts and how long it takes, in ms. */
const at = (start: number, ms: number): Vars => ({ "--at": `${start}ms`, "--ms": `${Math.max(ms, 1)}ms` });

/**
 * Covenant cover. Without a tap it plays by itself: a gold frame draws around the page, the Khmer blessing
 * is written, the couple's names arrive from either side, then the guest is addressed ("សូមគោរពអញ្ចើញ <name>",
 * the name read from the invitation link, shown exactly as set; "អស់លោក​លោកស្រី" when there is none). The open button appears at the end; a tap earlier skips ahead.
 * A tap fades the card out and hands over to the hero. Reduced motion shows everything at once.
 */
export function CovenantOpening({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const { t, language } = useLanguage();
  const reduce = useReducedMotion() ?? false;
  const tl = introFor(reduce);
  const p = covenantPalette(theme);
  const [ready, setReady] = useState(tl.readyAt === 0);
  const [skip, setSkip] = useState(false);
  const [crossing, setCrossing] = useState(false);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const started = useRef(false);

  useEffect(() => {
    if (ready) return;
    const timer = setTimeout(() => setReady(true), tl.readyAt);
    return () => clearTimeout(timer);
  }, [ready, tl.readyAt]);

  useEffect(() => {
    if (!crossing) return;
    const timer = setTimeout(() => onOpenRef.current(), tl.crossMs);
    return () => clearTimeout(timer);
  }, [crossing, tl.crossMs]);

  const petalList = useMemo(() => petals(14), []);
  const { first, second } = coupleNamesFor(couple, language);
    const guest = guestLine(guestGreeting) || t("covenant.guestDefault");
  const kh = language === "kh";
  const blessing = t("covenant.blessing");
  const accent = theme.accent_color;
  const foil: CSSProperties = {
    backgroundImage: foilTextGradient(accent, isDarkColor(theme.bg_color) ? theme.bg_color : "#ffffff"),
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
    "--cv-petal": withAlpha(PINK.petal, 0.55),
    "--cv-rose": PINK.rose,
    "--cv-hi": p.gold.hi,
    "--cv-mid": p.gold.mid,
    "--cv-lo": p.gold.lo,
    "--cv-glow": withAlpha(p.gold.mid, 0.45),
    "--cv-cta-ink": isDarkColor(accent) ? "#ffffff" : "#3a2400",
    color: theme.text_color,
    fontFamily: KHMER_BODY_FONT,
  };

  const begin = () => {
    if (started.current) return;
    started.current = true;
    setCrossing(true);
  };
  const stageClass = ["cv-stage", skip ? "cv-skip" : "", crossing ? "is-cross" : ""].filter(Boolean).join(" ");
  const Corner = COVENANT_ORNAMENTS.Corner;
  const frameTime = at(0, tl.frameMs);

  return (
    <div
      className={stageClass}
      style={vars}
      data-mk-lang={language}
      onClick={() => {
        if (!ready) {
          setSkip(true);
          setReady(true);
        }
      }}
    >
      <style href="mk-covenant-css" precedence="mk-covenant">
        {COVENANT_CSS}
      </style>

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {petalList.map((pt, i) => (
          <span
            key={i}
            className="cv-petal"
            style={{ left: `${pt.x}%`, width: pt.size, height: pt.size * 1.3, "--d": `${pt.duration}s`, "--t": `${pt.delay}s`, "--x": `${pt.drift}px`, "--r": `${pt.spin}deg` } as Vars}
          />
        ))}
      </div>

      {/* two gold frames draw themselves, then the four corner sprigs bloom */}
      {[14, 24].map((inset, i) => (
        <div key={inset} aria-hidden className="cv-fr" style={{ inset, ...(i === 1 ? { opacity: 0.55 } : null), ...frameTime }}>
          <span className="cv-line cv-line-h t" />
          <span className="cv-line cv-line-v r" />
          <span className="cv-line cv-line-h b" />
          <span className="cv-line cv-line-v l" />
        </div>
      ))}
      {(
        [
          ["top-[8px] left-[8px]", ""],
          ["top-[8px] right-[8px]", "scaleX(-1)"],
          ["bottom-[8px] left-[8px]", "scaleY(-1)"],
          ["bottom-[8px] right-[8px]", "scale(-1,-1)"],
        ] as const
      ).map(([pos, transform]) => (
        <span key={pos} aria-hidden className={`cv-corner absolute ${pos}`} style={{ ...frameTime }}>
          <span style={{ display: "block", transform }}>
            <Corner color={accent} size={58} />
          </span>
        </span>
      ))}

      <div className="cv-content">

        <p
          className="cv-wipe m-0 max-w-[22em]"
          style={{
            ...foil,
            ...at(tl.blessingAt, tl.blessingMs),
            fontFamily: kh ? MOUL_FONT : CINZEL_FONT,
            fontSize: kh ? "clamp(1rem,4.8vw,1.35rem)" : "clamp(.9rem,3.8vw,1.1rem)",
            letterSpacing: kh ? "normal" : "0.14em",
            textTransform: kh ? "none" : "uppercase",
            lineHeight: kh ? 2 : 1.7,
          }}
        >
          {blessing}
        </p>

        <h1 className="m-0 flex flex-wrap items-center justify-center gap-x-3" style={{ filter: `drop-shadow(0 2px 3px ${withAlpha(PINK.deepRose, 0.25)})` }}>
          <span className="cv-in-l" style={{ ...foil, ...at(tl.namesAt, tl.namesMs), ...nameFace(first) }}>
            {first}
          </span>
          {second && (
            <>
              <span className="cv-amp" style={{ ...foil, ...at(tl.namesAt, tl.namesMs), fontFamily: SCRIPT, fontSize: "clamp(1.8rem,9vw,2.6rem)" }}>
                &amp;
              </span>
              <span className="cv-in-r" style={{ ...foil, ...at(tl.namesAt, tl.namesMs), ...nameFace(second) }}>
                {second}
              </span>
            </>
          )}
        </h1>

        {guest && (
          <div className="cv-rise flex flex-col items-center gap-1" style={at(tl.guestAt, tl.guestMs)}>
            <p className="m-0 text-sm" style={{ color: p.gold.mid, fontFamily: kh ? MOUL_FONT : CINZEL_FONT, letterSpacing: kh ? "normal" : "0.18em", textTransform: kh ? "none" : "uppercase", lineHeight: 1.9 }}>
              {t("covenant.invite")}
            </p>
            <p
              className="m-0 break-words"
              style={{ ...foil, fontFamily: hasKhmer(guest) ? MOUL_FONT : SCRIPT, fontSize: hasKhmer(guest) ? "clamp(1.15rem,6vw,1.6rem)" : "clamp(1.8rem,9vw,2.6rem)", lineHeight: hasKhmer(guest) ? 1.9 : 1.2, overflowWrap: "anywhere" }}
            >
              {guest}
            </p>
          </div>
        )}

        <div style={{ minHeight: 56 }}>
          {ready && (
            <button type="button" className="cv-cta cv-ready cv-pulse" data-mk-open onClick={begin} disabled={crossing} style={{ fontFamily: kh ? MOUL_FONT : CINZEL_FONT, fontSize: kh ? "0.9rem" : "0.85rem", letterSpacing: kh ? "normal" : "0.16em", textTransform: kh ? "none" : "uppercase" }}>
              {t("covenant.open")}
            </button>
          )}
        </div>
      </div>

      {!ready && <p className="cv-skiphint m-0">{t("covenant.skip")}</p>}
    </div>
  );
}

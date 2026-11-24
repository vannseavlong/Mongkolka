"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import type { OpeningProps } from "../../types";
import { useLanguage } from "../../i18n";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import { formatWeddingDate } from "../../format";
import { foilTextGradient, isDarkColor } from "../khmer/foil";
import { Butterfly, EdgePetals, FlourishCorner, FlourishEdge, Hearts } from "./card-art";
import { CARD_CSS, COVENANT_CSS } from "./covenant-styles";
import { Cross } from "./cross";
import { coupleNamesFor } from "./names";
import { useFitScale } from "./use-fit-scale";
import { guestLine, hasKhmer, introFor } from "./intro-logic";
import { covenantPalette, PINK } from "./palette";

type Vars = CSSProperties & Record<`--${string}`, string | number>;
const SCRIPT = 'var(--font-script), "Great Vibes", cursive';
const at = (start: number, ms: number): Vars => ({ "--at": `${start}ms`, "--ms": `${Math.max(ms, 1)}ms` });

/**
 * The Covenant invitation card: a cream card with a gold flourish border on a dusty-pink mat, the Khmer and English
 * blessing, the couple's names with a butterfly and hearts, "សូមគោរពអញ្ចើញ / INVITATION" and the guest's name in a
 * framed box, then the date and venue. Plays by itself like the other Covenant opening (tap to skip, tap to open,
 * cross, hero). Venue and time come from the couple's details; lines without data are left out.
 */
export function CovenantCardOpening({ couple, theme, guestGreeting, details, onOpen }: OpeningProps) {
  const { t, language } = useLanguage();
  const reduce = useReducedMotion() ?? false;
  const tl = introFor(reduce);
  const p = covenantPalette(theme);
  const { boxRef, contentRef, scale } = useFitScale<HTMLDivElement, HTMLDivElement>();
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

  const kh = language === "kh";
  const accent = theme.accent_color;
  const guest = guestLine(guestGreeting);
  const { first, second } = coupleNamesFor(couple, language);
  const dateKh = formatWeddingDate(couple.weddingDate, "kh");
  const dateEn = formatWeddingDate(couple.weddingDate, "en");
  const where = [details?.ceremonyVenue, details?.ceremonyAddress].filter(Boolean).join(" · ");
  const when = [details?.ceremonyTime].filter(Boolean).join("");
  const foil: CSSProperties = {
    backgroundImage: foilTextGradient(accent, isDarkColor(theme.bg_color) ? theme.bg_color : "#ffffff"),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
  const nameFace = (n: string): CSSProperties =>
    hasKhmer(n) ? { fontFamily: MOUL_FONT, fontSize: "clamp(1.6rem,9vw,2.6rem)", lineHeight: 1.8 } : { fontFamily: SCRIPT, fontSize: "clamp(2.6rem,13vw,4rem)", lineHeight: 1.1 };

  const vars: Vars = {
    "--cv-ground": p.ground,
    "--cv-band": PINK.petal,
    "--cv-cream": mixHex(theme.bg_color, "#fffbea", 35),
    "--cv-petal": withAlpha(PINK.petal, 0.55),
    "--cv-hi": p.gold.hi,
    "--cv-mid": p.gold.mid,
    "--cv-lo": p.gold.lo,
    "--cv-glow": withAlpha(p.gold.mid, 0.45),
    "--cv-cta-ink": isDarkColor(accent) ? "#ffffff" : "#3a2400",
    color: theme.text_color,
    fontFamily: KHMER_BODY_FONT,
  };
  const classes = ["cv-cardstage", skip ? "cv-skip" : "", crossing ? "is-cross" : ""].filter(Boolean).join(" ");
  const label = (_text: string, size: string): CSSProperties => ({ ...foil, fontFamily: kh ? MOUL_FONT : CINZEL_FONT, fontSize: size, lineHeight: 1.9 });
  const small: CSSProperties = { ...foil, fontFamily: KHMER_BODY_FONT, fontWeight: 700, lineHeight: 1.7 };

  return (
    <div
      className={classes}
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
      <style href="mk-covenant-card-css" precedence="mk-covenant">
        {CARD_CSS}
      </style>

      <div className="cv-card" ref={boxRef}>
        <div aria-hidden className="cv-petals" style={at(0, tl.frameMs)}>
          <EdgePetals height={520} />
        </div>
        {(
          [
            ["top-1.5 left-1.5", ""],
            ["top-1.5 right-1.5", "scaleX(-1)"],
            ["bottom-1.5 left-1.5", "scaleY(-1)"],
            ["bottom-1.5 right-1.5", "scale(-1,-1)"],
          ] as const
        ).map(([pos, transform]) => (
          <span key={pos} aria-hidden className={`cv-cardcorner absolute ${pos}`} style={at(0, tl.frameMs)}>
            <span style={{ display: "block", transform }}>
              <FlourishCorner color={accent} size={96} />
            </span>
          </span>
        ))}
        <span aria-hidden className="cv-cardedge" style={{ ...at(0, tl.frameMs), top: 4, transform: "translateX(-50%)" }}>
          <FlourishEdge color={accent} width={150} />
        </span>
        <span aria-hidden className="cv-cardedge" style={{ ...at(0, tl.frameMs), bottom: 4, transform: "translateX(-50%) scaleY(-1)" }}>
          <FlourishEdge color={accent} width={150} />
        </span>

        <div ref={contentRef} style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
        <div className="cv-content">
          <div className="cv-cross-top">
            <Cross color={accent} size={44} draw glow />
          </div>

          <div className="cv-wipe" style={at(tl.blessingAt, tl.blessingMs)}>
            <p className="m-0" style={{ ...foil, fontFamily: MOUL_FONT, fontSize: "clamp(1.05rem,5.4vw,1.5rem)", lineHeight: 1.9 }}>
              {t("covenant.blessingKh")}
            </p>
            <p className="m-0" style={{ ...foil, fontFamily: SCRIPT, fontSize: "clamp(1.1rem,5vw,1.5rem)", lineHeight: 1.4 }}>
              {t("covenant.blessingEn")}
            </p>
          </div>

          <div className="flex w-full flex-col items-center">
            <div className="cv-in-l flex items-center justify-center gap-2" style={at(tl.namesAt, tl.namesMs)}>
              <span className="shrink-0">
                <Butterfly color={accent} size={64} />
              </span>
              <span style={{ ...foil, ...nameFace(first) }}>{first}</span>
            </div>
            {second && (
              <div className="cv-in-r flex items-center justify-center gap-2" style={at(tl.namesAt + 250, tl.namesMs)}>
                <span className="shrink-0">
                  <Hearts color={accent} size={60} />
                </span>
                <span style={{ ...foil, ...nameFace(second) }}>{second}</span>
              </div>
            )}
          </div>

          <div className="cv-rise flex w-full flex-col items-center" style={at(tl.guestAt, tl.guestMs)}>
            <p className="m-0" style={label("", "clamp(.95rem,4.6vw,1.25rem)")}>
              {t("covenant.invite")}
            </p>
            <p className="m-0" style={{ ...foil, fontFamily: CINZEL_FONT, fontWeight: 700, fontSize: "clamp(1rem,5vw,1.3rem)", letterSpacing: "0.04em" }}>
              {t("covenant.inviteEn").toUpperCase()}
            </p>
            {guest && (
              <div className="cv-guestbox mt-3">
                <p className="m-0 break-words" style={{ ...foil, fontFamily: hasKhmer(guest) ? MOUL_FONT : SCRIPT, fontSize: hasKhmer(guest) ? "clamp(1.1rem,5.6vw,1.6rem)" : "clamp(1.7rem,8vw,2.4rem)", lineHeight: hasKhmer(guest) ? 1.9 : 1.2, overflowWrap: "anywhere" }}>
                  {guest}
                </p>
              </div>
            )}
          </div>

          {(dateKh || where) && (
            <div className="cv-rise flex flex-col items-center" style={at(tl.guestAt + 300, tl.guestMs)}>
              {dateKh && (
                <p className="m-0" style={{ ...small, fontSize: "clamp(.85rem,4vw,1.05rem)" }}>
                  {kh ? `ថ្ងៃទី ${dateKh}` : `${dateEn}`}
                  {when ? ` · ${when}` : ""}
                </p>
              )}
              {where && (
                <p className="m-0 break-words" style={{ ...small, fontWeight: 400, fontSize: "clamp(.8rem,3.8vw,1rem)" }}>
                  {where}
                </p>
              )}
              {kh && dateEn && (
                <p className="m-0" style={{ ...small, fontFamily: CINZEL_FONT, fontSize: "clamp(.75rem,3.4vw,.9rem)" }}>
                  {dateEn}
                </p>
              )}
            </div>
          )}

          <div style={{ minHeight: 56, marginTop: 6 }}>
            {ready && (
              <button type="button" className="cv-cta cv-ready cv-pulse" data-mk-open onClick={() => {
                if (started.current) return;
                started.current = true;
                setCrossing(true);
              }} disabled={crossing} style={{ fontFamily: kh ? MOUL_FONT : CINZEL_FONT, fontSize: kh ? "0.9rem" : "0.85rem", letterSpacing: kh ? "normal" : "0.16em", textTransform: kh ? "none" : "uppercase" }}>
                {t("covenant.open")}
              </button>
            )}
          </div>
        </div>
        </div>
      </div>

      {!ready && <p className="cv-skiphint m-0">{t("covenant.skip")}</p>}

      <div aria-hidden className="cv-burst">
        <span className="cv-ray" />
        {crossing && (
          <span className="cv-big">
            <Cross color={accent} size={170} draw glow />
          </span>
        )}
      </div>
    </div>
  );
}

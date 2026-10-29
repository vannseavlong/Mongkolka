"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { OpeningProps } from "../../types";
import { formatCoupleNames, formatWeddingDate } from "../../format";
import { useLanguage } from "../../i18n";
import { Cross, DISPLAY_FONT, FoilText, GoldDivider, Petals, gracePalette, nameFont } from "./shared";

const OPEN_MS = 1300;
const KHMER = /[ក-៿]/;

const FOCUS_CSS =
  ".grace-open-btn:focus-visible{outline:2px solid var(--grace-open-accent);outline-offset:4px}" +
  ".grace-open-btn:hover:not(:disabled){background-color:var(--grace-open-hover)}";

/**
 * Elegant invitation gate: a tall white arched window with a double gold line on a soft pink
 * gradient. The arch is rendered twice and each copy is clipped to one half, so opening is a
 * pure transform: the two doors swing apart, then the whole gate fades and onOpen fires.
 * Only the first copy is interactive and readable; the second is inert and aria-hidden.
 */
export function GraceOpening({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const { t, language } = useLanguage();
  const reduce = useReducedMotion();
  const p = gracePalette(theme);
  const [opening, setOpening] = useState(false);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    if (!opening) return;
    const timer = setTimeout(() => onOpenRef.current(), OPEN_MS);
    return () => clearTimeout(timer);
  }, [opening]);

  const start = () => {
    if (opening) return;
    if (reduce) onOpenRef.current();
    else setOpening(true);
  };

  const names = formatCoupleNames(couple);
  const date = formatWeddingDate(couple.weddingDate, language);
  const kh = language === "kh";
  const guest = guestGreeting?.trim() || undefined;
  const track = (em: number): CSSProperties => (kh ? {} : { letterSpacing: `${em}em` });
  const fontFor = (text: string) => (KHMER.test(text) ? DISPLAY_FONT : nameFont(language));
  const wrap: CSSProperties = { overflowWrap: "anywhere" };

  const foilLine = { backgroundColor: p.accent, backgroundImage: p.foilGradient } satisfies CSSProperties;
  const archRadius = "rounded-t-[999px]";

  const face = (interactive: boolean) => (
    <div
      className={`${archRadius} p-[2px]`}
      style={foilLine}
      aria-hidden={interactive ? undefined : true}
    >
      <div className={`${archRadius} p-[5px]`} style={{ backgroundColor: p.card }}>
        <div className={`${archRadius} p-[1.5px]`} style={foilLine}>
          <div
            className={`${archRadius} flex flex-col items-center px-[9cqw] pb-[11cqw] pt-[16cqw] text-center`}
            style={{ backgroundColor: p.card, backgroundImage: `linear-gradient(180deg, ${p.card} 0%, ${p.card} 55%, ${p.ground} 100%)`, color: p.text }}
          >
            <Cross spray stroke={p.accent} strokeWidth={2.4} className="h-[15cqw] w-auto" />

            <p
              className="mt-[7cqw] max-w-full text-[clamp(1.2rem,7.2cqw,1.9rem)] leading-snug"
              style={{ color: p.accent, fontFamily: guest ? fontFor(guest) : nameFont(language), ...wrap }}
            >
              {guest ? `${t("opening.dear")} ${guest},` : t("grace.opening.invited")}
            </p>

            {guest && (
              <p
                className="mt-[3cqw] text-[clamp(0.78rem,3.8cqw,0.95rem)] leading-relaxed"
                style={{ color: p.muted, fontFamily: DISPLAY_FONT, ...track(0.04) }}
              >
                {t("grace.opening.invitedTo")}
              </p>
            )}

            <h1
              className="mt-[5cqw] max-w-full text-[clamp(2.3rem,14.5cqw,4.1rem)] leading-[1.12]"
              style={{ fontFamily: fontFor(`${couple.partner1Name}${couple.partner2Name ?? ""}`), fontWeight: 400, ...wrap }}
            >
              <FoilText theme={theme}>{couple.partner1Name}</FoilText>
              {couple.partner2Name && (
                <>
                  <span className="my-[0.5cqw] block text-[0.5em] leading-tight" style={{ color: p.accent }}>
                    &amp;
                  </span>
                  <FoilText theme={theme}>{couple.partner2Name}</FoilText>
                </>
              )}
            </h1>

            <GoldDivider theme={theme} mark="diamond" className="mt-[6cqw] max-w-[60%]" />

            {date && (
              <p
                className="mt-[5cqw] text-[clamp(0.95rem,5cqw,1.3rem)]"
                style={{ fontFamily: DISPLAY_FONT, color: p.text, ...track(0.08) }}
              >
                {date}
              </p>
            )}

            {interactive ? (
              <button
                type="button"
                onClick={start}
                disabled={opening}
                aria-label={`${t("grace.opening.openLabel")} ${names}`}
                className="grace-open-btn mt-[8cqw] max-w-full cursor-pointer rounded-full px-[7cqw] py-[3cqw] text-[clamp(0.85rem,4.2cqw,1.05rem)] transition-colors"
                style={{
                  border: `1px solid ${p.accent}`,
                  color: p.accent,
                  fontFamily: DISPLAY_FONT,
                  backgroundColor: "transparent",
                  ["--grace-open-accent" as string]: p.accent,
                  ["--grace-open-hover" as string]: `color-mix(in srgb, ${p.accent} 9%, transparent)`,
                  ...track(0.06),
                }}
              >
                {t("grace.opening.open")}
              </button>
            ) : (
              <span
                className="mt-[8cqw] max-w-full rounded-full px-[7cqw] py-[3cqw] text-[clamp(0.85rem,4.2cqw,1.05rem)]"
                style={{ border: `1px solid ${p.accent}`, color: p.accent, fontFamily: DISPLAY_FONT, ...track(0.06) }}
              >
                {t("grace.opening.open")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const door = (side: "left" | "right") => (
    <motion.div
      key={side}
      className={side === "left" ? "" : "absolute inset-0"}
      style={{
        clipPath: side === "left" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
        transformOrigin: side === "left" ? "0% 50%" : "100% 50%",
        position: side === "left" ? "relative" : undefined,
        willChange: opening ? "transform" : undefined,
      }}
      animate={opening ? { rotateY: side === "left" ? -78 : 78, opacity: 0.0 } : { rotateY: 0, opacity: 1 }}
      transition={{
        rotateY: { duration: 1.05, ease: [0.65, 0, 0.35, 1] },
        opacity: { duration: 0.4, delay: 0.65, ease: "easeIn" },
      }}
    >
      {face(side === "left")}
    </motion.div>
  );

  return (
    <motion.div
      lang={kh ? "km" : undefined}
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
      style={{
        backgroundColor: p.ground,
        backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${p.ground} 62%, #f4a7bb) 0%, ${p.ground} 52%, color-mix(in srgb, ${p.ground} 55%, #ffffff) 100%)`,
      }}
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{ duration: 0.3, delay: opening ? OPEN_MS / 1000 - 0.35 : 0 }}
    >
      <style>{FOCUS_CSS}</style>
      <Petals theme={theme} />
      <div className="relative flex min-h-full items-center justify-center px-4 py-8">
        <div
          className="relative w-full max-w-[400px] [container-type:inline-size]"
          style={{ perspective: "1400px", width: "min(100%, 400px)" }}
        >
          {/* Light revealed behind the doors */}
          <div
            aria-hidden
            className={`${archRadius} absolute inset-0`}
            style={{ backgroundColor: p.card, backgroundImage: `radial-gradient(ellipse at 50% 35%, #ffffff 0%, ${p.blush} 100%)`, border: `1px solid ${p.accent}` }}
          />
          <div className="relative">
            {door("left")}
            {door("right")}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

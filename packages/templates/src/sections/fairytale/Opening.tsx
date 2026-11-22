"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { OpeningProps } from "../../types";
import { useLanguage } from "../../i18n";
import { formatWeddingDate } from "../../format";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { mixHex, withAlpha } from "../../chrome/gold";
import { monogramOf } from "../khmer/skin-logic";
import { Castle, Cloud, Hydrangea, Morpho, Sparkle, Sprig, SunRays } from "./art";
import { FairytaleStyles } from "./FairytaleStyles";
import { COVER_OPEN_DEG, fairytalePalette, openingTimeline } from "./fairytale-logic";
import { SCRIPT_FONT, SprayCorner, WreathCrest } from "./ornaments";

const BOKEH = [
  { l: "12%", t: "18%", s: 46, d: 0 },
  { l: "82%", t: "12%", s: 64, d: 1.2 },
  { l: "70%", t: "62%", s: 38, d: 2.1 },
  { l: "20%", t: "72%", s: 58, d: 0.6 },
  { l: "48%", t: "8%", s: 30, d: 1.8 },
];

const CORNERS: Array<{ pos: string; transform?: string }> = [
  { pos: "left-[3.4cqw] top-[3.4cqw]" },
  { pos: "right-[3.4cqw] top-[3.4cqw]", transform: "scaleX(-1)" },
  { pos: "bottom-[3.4cqw] left-[3.4cqw]", transform: "scaleY(-1)" },
  { pos: "bottom-[3.4cqw] right-[3.4cqw]", transform: "scale(-1,-1)" },
];

/**
 * Storybook cover. A closed royal-blue hardcover stands in a sunlit sky; on the tap the cover swings
 * open on its spine (CSS 3D), a white palace pops up from the page, then the whole page zooms in to
 * the palace door and fades to white before `onOpen`. Reduced motion: a short cross-fade only.
 */
export function FairytaleOpening({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const { t, language } = useLanguage();
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const doneRef = useRef(false);
  const tl = openingTimeline(reduced);
  const p = fairytalePalette(theme);
  const date = formatWeddingDate(couple.weddingDate, language);
  const foil = mixHex(p.royal, "#ffffff", 30);
  const kh = language === "kh";
  const sec = (ms: number) => ms / 1000;

  const start = useCallback(() => setOpen(true), []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      onOpen();
    }, tl.doneMs);
    return () => clearTimeout(timer);
  }, [open, tl.doneMs, onOpen]);

  return (
    <div
      data-fairytale-opening
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ color: p.ink, fontFamily: KHMER_BODY_FONT, backgroundImage: `linear-gradient(180deg, #eef6fc 0%, ${p.sky} 52%, #e9d6e6 100%)` }}
    >
      <FairytaleStyles />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[70%] opacity-90">
          <SunRays opacity={0.55} />
        </div>
        <div className="ft-drift absolute left-[-4%] top-[9%]">
          <Cloud width={150} opacity={0.9} />
        </div>
        <div className="ft-drift absolute right-[-6%] top-[26%]" style={{ animationDirection: "alternate-reverse" }}>
          <Cloud width={120} opacity={0.75} />
        </div>
        {BOKEH.map((b) => (
          <span
            key={b.l}
            className="ft-bokeh absolute rounded-full"
            style={{ left: b.l, top: b.t, width: b.s, height: b.s, animationDelay: `${b.d}s`, background: `radial-gradient(circle, ${withAlpha("#ffffff", 0.9)}, ${withAlpha("#ffffff", 0)} 70%)` }}
          />
        ))}
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
          <Sparkle x={70} y={80} size={7} delay={0.3} />
          <Sparkle x={330} y={60} size={9} delay={1.4} />
          <Sparkle x={350} y={190} size={6} delay={0.9} />
          <Sparkle x={48} y={200} size={6} delay={2} />
        </svg>
        <svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 w-full" style={{ height: 150 }}>
          <Hydrangea x={30} y={96} r={34} blooms={p.blooms} seed={13} count={15} />
          <Hydrangea x={92} y={112} r={22} blooms={p.blooms} seed={31} count={11} />
          <Hydrangea x={370} y={96} r={34} blooms={p.blooms} seed={37} count={15} />
          <Hydrangea x={308} y={112} r={22} blooms={p.blooms} seed={43} count={11} />
          <Sprig x={52} y={40} scale={0.7} rotate={-8} />
          <Sprig x={324} y={40} scale={0.7} rotate={10} />
        </svg>
        <div className="ft-flutter absolute left-[10%] top-[44%]">
          <Morpho size={38} tilt={-14} />
        </div>
        <div className="ft-flutter absolute right-[9%] top-[30%]" style={{ animationDelay: "-3s" }}>
          <Morpho size={30} tilt={12} />
        </div>
      </div>

      {/* the book zooms as a whole, into the palace door */}
      <motion.div
        className="relative"
        style={{ perspective: 1500, transformOrigin: "50% 74%" }}
        animate={{ scale: open && !reduced ? 9 : 1 }}
        transition={{ delay: sec(tl.zoomAtMs), duration: sec(tl.zoomMs), ease: [0.55, 0, 0.9, 0.45] }}
      >
        <div className="relative [container-type:inline-size]" style={{ height: "min(60svh, 460px)", aspectRatio: "0.74", transformStyle: "preserve-3d" }}>
          {/* inner page with the palace that pops up */}
          <div
            className="absolute inset-0 overflow-hidden rounded-r-[2.2cqw] rounded-l-[0.8cqw]"
            style={{
              background: "linear-gradient(100deg, #f3ecdd 0%, #fffdf7 14%, #ffffff 60%, #f6f0e4 100%)",
              boxShadow: `0 2.4cqw 6cqw -1cqw ${withAlpha(p.royal, 0.45)}, inset 0 0 0 1.2cqw #ffffff, inset 0 0 0 1.5cqw ${withAlpha(p.royal, 0.25)}`,
            }}
          >
            <div className="absolute inset-x-0 top-0 h-1/2 opacity-60">
              <SunRays color="#cfe3f7" opacity={0.8} />
            </div>
            <motion.div
              className="ft-pop absolute inset-x-[7%] bottom-[7%] top-[18%]"
              initial={false}
              animate={{ scaleY: open || reduced ? 1 : 0.55, opacity: open || reduced ? 1 : 0.2 }}
              transition={{ delay: reduced ? 0 : sec(tl.popAtMs), duration: 0.7, ease: "backOut" }}
            >
              <Castle royal={p.royal} sky={p.sky} blooms={p.blooms} glow={open} />
            </motion.div>
            <p className="absolute inset-x-0 top-[6%] m-0 text-center uppercase" style={{ fontFamily: CINZEL_FONT, fontSize: "3.4cqw", letterSpacing: "0.3em", color: p.royal }}>
              {t("fairytale.tagline")}
            </p>
            <div className="ft-flutter absolute right-[6%] top-[22%]">
              <Morpho size={30} tilt={14} />
            </div>
          </div>

          {/* the cover, hinged on the spine */}
          <motion.div
            data-fairytale-cover
            onClick={start}
            className="absolute inset-0"
            style={{ transformOrigin: "0% 50%", transformStyle: "preserve-3d", cursor: open ? "default" : "pointer" }}
            animate={{ rotateY: open && !reduced ? COVER_OPEN_DEG : 0, opacity: open && reduced ? 0 : 1 }}
            transition={{ duration: open && !reduced ? sec(tl.coverMs) : 0.25, ease: [0.45, 0.05, 0.25, 1] }}
          >
            <div
              className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-r-[2.2cqw] rounded-l-[0.8cqw] text-center"
              style={{
                backfaceVisibility: "hidden",
                color: "#ffffff",
                backgroundImage: `radial-gradient(120% 70% at 50% 0%, ${mixHex(p.royal, "#ffffff", 78)}, ${p.royal} 45%, ${mixHex(p.royal, p.ink, 45)} 100%)`,
                boxShadow: `0 3cqw 7cqw -1.5cqw ${withAlpha(p.ink, 0.55)}, inset 0 0 0 1.6cqw ${withAlpha(foil, 0.5)}, inset 0 0 0 2.2cqw ${withAlpha(p.royal, 0.9)}, inset 0 0 0 2.6cqw ${withAlpha(foil, 0.55)}`,
              }}
            >
              <div aria-hidden className="absolute left-0 top-0 h-full w-[3cqw]" style={{ background: `linear-gradient(90deg, ${withAlpha("#000000", 0.35)}, transparent)` }} />
              {CORNERS.map((c) => (
                <div key={c.pos} aria-hidden className={`absolute ${c.pos}`} style={{ transform: c.transform, width: "20cqw", height: "20cqw" }}>
                  <SprayCorner color={foil} size={100} />
                </div>
              ))}
              <div aria-hidden style={{ width: "26cqw" }}>
                <WreathCrest color={foil} ground={p.royal} label={monogramOf(couple)} size={100} />
              </div>
              <p
                className="m-0 mt-[3cqw] max-w-[80%]"
                style={{ fontFamily: kh ? MOUL_FONT : CINZEL_FONT, fontSize: kh ? "4cqw" : "3.4cqw", letterSpacing: kh ? "normal" : "0.22em", lineHeight: kh ? 1.9 : 1.5, textTransform: kh ? "none" : "uppercase", color: mixHex(foil, "#ffffff", 70) }}
              >
                {t("fairytale.greeting")}
              </p>
              {guestGreeting && (
                <p className="m-0 mt-[1.6cqw]" style={{ fontSize: "3.8cqw", opacity: 0.92 }}>
                  {t("khmer.dear")} {guestGreeting}
                </p>
              )}
              <h1 className="m-0 mt-[2cqw] font-normal leading-[1.05]" style={{ fontFamily: SCRIPT_FONT, fontSize: "11.5cqw", textShadow: `0 0.5cqw 1.2cqw ${withAlpha("#000000", 0.35)}` }}>
                {couple.partner1Name}
                {couple.partner2Name && (
                  <>
                    <span className="block" style={{ fontSize: "0.55em", color: mixHex(foil, "#ffffff", 60) }}>
                      &amp;
                    </span>
                    {couple.partner2Name}
                  </>
                )}
              </h1>
              {date && (
                <p className="m-0 mt-[2.4cqw] uppercase" style={{ fontFamily: CINZEL_FONT, fontSize: "3cqw", letterSpacing: "0.26em", color: mixHex(foil, "#ffffff", 70) }}>
                  {date}
                </p>
              )}
            </div>
            {/* the inside of the cover, seen as it swings away */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-l-[2.2cqw] rounded-r-[0.8cqw]"
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                backgroundImage: `repeating-linear-gradient(45deg, ${withAlpha(p.royal, 0.08)} 0 1.4cqw, transparent 1.4cqw 2.8cqw), linear-gradient(260deg, #f3ecdd, #ffffff)`,
                boxShadow: `inset 0 0 0 1.4cqw #ffffff, inset 0 0 0 1.7cqw ${withAlpha(p.royal, 0.3)}`,
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.button
        type="button"
        data-mk-open
        onClick={start}
        disabled={open}
        className="relative mt-7 cursor-pointer rounded-full px-7 py-3 font-medium outline-none focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-default"
        style={{
          fontFamily: kh ? MOUL_FONT : CINZEL_FONT,
          letterSpacing: kh ? "normal" : "0.16em",
          textTransform: kh ? "none" : "uppercase",
          fontSize: kh ? "0.78rem" : "0.72rem",
          color: p.royal,
          outlineColor: p.royal,
          background: "linear-gradient(180deg, #ffffff, #e9f1fa)",
          border: `1px solid ${withAlpha(p.royal, 0.55)}`,
          boxShadow: `0 10px 22px -10px ${withAlpha(p.royal, 0.7)}, inset 0 1px 0 #ffffff`,
        }}
        animate={{ opacity: open ? 0 : 1, y: open ? 8 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {t("fairytale.open")}
      </motion.button>

      {/* white-out that hides the hand-over to the page */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ delay: reduced ? 0 : sec(tl.zoomAtMs + tl.zoomMs * 0.55), duration: reduced ? 0.3 : sec(tl.zoomMs * 0.45), ease: "easeIn" }}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { OpeningProps } from "../../types";
import { formatWeddingDate } from "../../format";
import { useLanguage } from "../../i18n";
import { DISPLAY_FONT, Grain, KhResetStyle, LABEL_FONT, mix } from "../ink/shared";
import { FoilText, KbachCorner, KbachStrip, Lotus } from "./shared";

// Tall pointed arch for the cover, in a 300x500 box (the shared ARCH_* paths are 3:4).
const GATE_OUTER = "M6 500V240C6 150 104 130 150 8C196 130 294 150 294 240V500";
const GATE_INNER = "M24 500V246C24 168 112 148 150 40C188 148 276 168 276 246V500";

/**
 * A temple-gate cover: a pointed arch with a double foil outline holds the names.
 * Opening splits the whole cover down the middle and slides the halves apart.
 */
export function KbachGate({ couple, theme, guestGreeting, onOpen }: OpeningProps) {
  const { t, language } = useLanguage();
  const [opening, setOpening] = useState(false);
  const date = formatWeddingDate(couple.weddingDate);
  const foil = theme.accent_color;
  const ground = theme.text_color;
  const ivory = theme.bg_color;

  useEffect(() => {
    if (!opening) return;
    const timer = setTimeout(onOpen, 1300);
    return () => clearTimeout(timer);
  }, [opening, onOpen]);

  // The cover is rendered twice and each copy is clipped to one half, so the
  // split is a pure transform; only the first copy is interactive/readable.
  const cover = (interactive: boolean) => (
    <div
      className="absolute inset-0 flex items-center justify-center px-4"
      style={{ backgroundColor: ground, color: ivory, fontFamily: DISPLAY_FONT }}
      aria-hidden={!interactive}
    >
      <Grain opacity={0.16} />
      <div className="absolute inset-x-0 top-3 sm:top-5">
        <KbachStrip color={foil} />
      </div>
      <div className="absolute inset-x-0 bottom-3 sm:bottom-5">
        <KbachStrip color={foil} flip />
      </div>
      <KbachCorner color={foil} className="absolute left-2 top-10 size-16 sm:size-24" />
      <KbachCorner color={foil} className="absolute right-2 top-10 size-16 -scale-x-100 sm:size-24" />
      <KbachCorner color={foil} className="absolute bottom-10 left-2 size-16 -scale-y-100 sm:size-24" />
      <KbachCorner color={foil} className="absolute bottom-10 right-2 size-16 -scale-100 sm:size-24" />

      {/* Sized from the container's height (not the viewport) so it also fits the builder
          preview box; inline-size containment lets the text scale with the arch via cqw. */}
      <div className="relative aspect-[3/5] max-w-[86%] [container-type:inline-size]" style={{ height: "min(84%, 640px)" }}>
        <svg aria-hidden viewBox="0 0 300 500" className="absolute inset-0 size-full overflow-visible" fill="none">
          <motion.path
            d={GATE_OUTER}
            stroke={foil}
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
          <motion.path
            d={GATE_INNER}
            stroke={foil}
            strokeOpacity="0.7"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, delay: 0.3, ease: "easeInOut" }}
          />
          <path d="M150 8c-9-9-6-19 0-28 6 9 9 19 0 28z" fill={foil} />
        </svg>

        <div className="absolute inset-x-[13%] bottom-[7%] top-[25%] flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="flex flex-col items-center gap-[3cqw]"
          >
            <Lotus color={foil} className="h-[9cqw] w-[14cqw]" />
            <p className="text-[clamp(0.62rem,4.2cqw,0.85rem)] italic leading-snug" style={{ color: foil }}>
              {t("kbach.honour")}
            </p>
            {guestGreeting && (
              <p className="text-[clamp(0.7rem,4.4cqw,0.9rem)] italic opacity-80">
                {t("opening.dear")} {guestGreeting},
              </p>
            )}
            <h1 className="text-[clamp(1.7rem,13cqw,3.6rem)] font-light italic leading-[1.02]">
              <FoilText accent={foil}>{couple.partner1Name}</FoilText>
              {couple.partner2Name && (
                <>
                  <span className="my-0.5 block text-[0.5em]" style={{ color: foil }}>
                    &amp;
                  </span>
                  <FoilText accent={foil}>{couple.partner2Name}</FoilText>
                </>
              )}
            </h1>
            {date && (
              <p className="text-[clamp(0.55rem,3.2cqw,0.75rem)] uppercase tracking-[0.25em] opacity-85" style={{ fontFamily: LABEL_FONT }}>
                {date}
              </p>
            )}
          </motion.div>

          {/* Present in both copies (the second is inert) so the two halves lay out identically. */}
          <motion.button
              type="button"
              onClick={() => setOpening(true)}
              disabled={opening || !interactive}
              tabIndex={interactive ? 0 : -1}
              className="mt-[6cqw] cursor-pointer rounded-full px-[6cqw] py-[2.5cqw] text-[clamp(0.55rem,3cqw,0.7rem)] font-medium uppercase tracking-[0.25em] outline-none focus-visible:ring-2"
              style={{ border: `1px solid ${foil}`, color: foil, fontFamily: LABEL_FONT, backgroundColor: mix(foil, 10) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              whileHover={{ backgroundColor: mix(foil, 22) }}
              whileTap={{ scale: 0.97 }}
            >
              {t("kbach.open")}
            </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <div data-ink-lang={language} className="fixed inset-0 z-50 overflow-hidden" style={{ backgroundColor: ground }}>
      {language === "kh" && <KhResetStyle />}
      {(["left", "right"] as const).map((side, i) => (
        <motion.div
          key={side}
          className="absolute inset-0"
          style={{ clipPath: side === "left" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" }}
          animate={opening ? { x: side === "left" ? "-100%" : "100%" } : { x: 0 }}
          transition={{ duration: 1.1, delay: opening ? 0.15 : 0, ease: [0.76, 0, 0.24, 1] }}
        >
          {cover(i === 0)}
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Theme } from "../../types";
import type { Language } from "../../i18n";
import { DISPLAY_FONT, LABEL_FONT, mix } from "../ink/shared";

/*
 * Design primitives for the "Grace" pink, gold and white Christian-wedding pack.
 * Like the ink pack, everything derives from the four Theme colors: pink ground =
 * bg_color, white card surface, gold foil = accent_color, deep text = text_color.
 *
 * Seed values for the skeleton task (contrast checked against bg with contrastRatio,
 * WCAG; MIN_ACCENT_CONTRAST = 4.5):
 *   bg_color     #fff3f6   (pink ground)
 *   text_color   #4a2c35   (deep rosewood)  11.39:1 on bg
 *   accent_color #8a6418   (gold)            4.95:1 on bg, 5.36:1 on white cards
 * The lighter decorative foil is derived (gracePalette().foil*) and is NOT for text
 * smaller than large script; use `accent` for readable gold text.
 */

export { DISPLAY_FONT, LABEL_FONT, mix };

export const SCRIPT_FONT = 'var(--font-script), "Great Vibes", cursive';

/** Script font has no Khmer glyphs: Khmer names use the display Khmer serif. */
export function nameFont(language: Language): string {
  return language === "kh" ? DISPLAY_FONT : SCRIPT_FONT;
}

export interface GracePalette {
  /** Pink ground. */
  ground: string;
  /** White card surface. */
  card: string;
  /** Deep text. */
  text: string;
  /** Readable gold (contrast-checked accent), for small text and strokes. */
  accent: string;
  /** Lighter decorative gold, for foil lines and fills only. */
  foilLight: string;
  /** Mid gold for foil gradients. */
  foilMid: string;
  /** Soft blush derived from the ground, for petals and fallbacks. */
  blush: string;
  /** Muted text for secondary copy. */
  muted: string;
  /** Foil gradient (135deg) for lines, borders and big script text. */
  foilGradient: string;
}

export function gracePalette(theme: Theme): GracePalette {
  const accent = theme.accent_color;
  const foilLight = `color-mix(in srgb, ${accent} 60%, #ffffff)`;
  const foilMid = `color-mix(in srgb, ${accent} 85%, #ffffff)`;
  return {
    ground: theme.bg_color,
    card: "#ffffff",
    text: theme.text_color,
    accent,
    foilLight,
    foilMid,
    blush: `color-mix(in srgb, ${theme.bg_color} 70%, #f4a7bb)`,
    muted: `color-mix(in srgb, ${theme.text_color} 78%, ${theme.bg_color})`,
    foilGradient: foilGradient(accent),
  };
}

export function foilGradient(accent: string, angle = 135): string {
  const light = `color-mix(in srgb, ${accent} 60%, #ffffff)`;
  const mid = `color-mix(in srgb, ${accent} 85%, #ffffff)`;
  return `linear-gradient(${angle}deg, ${mid} 0%, ${light} 30%, ${accent} 55%, ${light} 80%, ${mid} 100%)`;
}

/** Style for text filled with the gold foil gradient (decorative / large display only). */
export function foilTextStyle(accent: string): CSSProperties {
  return {
    backgroundImage: foilGradient(accent),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: accent,
  };
}

const KH_CSS_ATTR = "data-grace-lang";

/* ------------------------------------------------------------------ Cross */

/**
 * Original plain Latin cross. `spray` adds a soft leaf-and-bud spray at the foot of
 * the cross. Size it with className (e.g. "h-10 w-7"); stroke/fill come from props.
 */
export function Cross({
  spray = false,
  stroke = "currentColor",
  fill = "none",
  strokeWidth = 1.5,
  className = "h-10 w-auto",
  title,
}: {
  spray?: boolean;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  className?: string;
  title?: string;
}) {
  const leaf = (rot: number, scale = 1) => (
    <path
      d="M0 0C-3 -5 -3 -11 0 -16C3 -11 3 -5 0 0Z"
      transform={`translate(32 90) rotate(${rot}) scale(${scale})`}
    />
  );
  return (
    <svg
      viewBox={spray ? "0 0 64 100" : "0 0 64 84"}
      className={className}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      <path d="M28 4H36V24H54V32H36V80H28V32H10V24H28Z" />
      {spray && (
        <g>
          {leaf(-70, 1.1)}
          {leaf(-40, 1.3)}
          {leaf(70, 1.1)}
          {leaf(40, 1.3)}
          <path d="M32 90V82" />
          <circle cx="22" cy="86" r="1.6" />
          <circle cx="42" cy="86" r="1.6" />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------ GoldDivider */

/** Thin gold line with a small centered cross or diamond. */
export function GoldDivider({
  theme,
  mark = "cross",
  className = "",
}: {
  theme: Theme;
  mark?: "cross" | "diamond";
  className?: string;
}) {
  const p = gracePalette(theme);
  const line: CSSProperties = {
    backgroundImage: `linear-gradient(90deg, transparent, ${p.foilLight}, ${p.accent})`,
  };
  return (
    <div aria-hidden className={`mx-auto flex w-full max-w-xs items-center gap-3 ${className}`}>
      <span className="h-px flex-1" style={line} />
      {mark === "cross" ? (
        <Cross stroke={p.accent} className="h-5 w-auto" strokeWidth={4} />
      ) : (
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill={p.accent}>
          <path d="M6 0l6 6-6 6-6-6z" />
        </svg>
      )}
      <span className="h-px flex-1" style={{ ...line, transform: "scaleX(-1)" }} />
    </div>
  );
}

/* ----------------------------------------------------------------- Petals */

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 8) % 100,
  size: 10 + ((i * 7) % 9),
  duration: 11 + ((i * 5) % 8),
  delay: -((i * 3) % 11),
  sway: ((i % 2 ? 1 : -1) * (18 + ((i * 11) % 30))),
  rotate: 120 + ((i * 53) % 240),
}));

/** Falling blush petals. Decorative; renders nothing under prefers-reduced-motion. */
export function Petals({ theme, className = "" }: { theme: Theme; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const { blush, foilLight } = gracePalette(theme);
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {PETALS.map((p, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 20 20"
          className="absolute -top-8"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, p.sway, -p.sway / 2, p.sway / 3],
            rotate: [0, p.rotate],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          <path d="M10 1C16 4 18 11 10 19C2 11 4 4 10 1Z" fill={i % 5 === 0 ? foilLight : blush} />
        </motion.svg>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- ArchFrame */

/** First letters of up to two words, uppercase; "" when nothing usable. */
export function initialsOf(text: string | undefined, max = 2): string {
  if (!text) return "";
  return Array.from(
    text
      .split(/[\s&+,]+/)
      .filter(Boolean)
      .map((w) => Array.from(w)[0] ?? ""),
  )
    .slice(0, max)
    .join("")
    .toUpperCase();
}

/**
 * Gold double-line arch that clips a photo (object-cover). With no `src` it shows a soft
 * pink monogram from `initials` (e.g. initialsOf("Sokha & Dara")).
 */
export function ArchFrame({
  theme,
  src,
  alt = "",
  initials,
  language = "en",
  className = "",
}: {
  theme: Theme;
  src?: string | null;
  alt?: string;
  initials?: string;
  language?: Language;
  className?: string;
}) {
  const p = gracePalette(theme);
  const arch = "rounded-t-[999px]";
  return (
    <div className={`mx-auto w-full max-w-sm ${className}`}>
      <div className={`${arch} p-[2px]`} style={{ backgroundImage: p.foilGradient }}>
        <div className={`${arch} p-[5px]`} style={{ backgroundColor: p.card }}>
          <div className={`${arch} p-[1.5px]`} style={{ backgroundImage: p.foilGradient }}>
            <div className={`${arch} relative aspect-[3/4] w-full overflow-hidden`} style={{ backgroundColor: p.blush }}>
              {src ? (
                <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, ${p.card}, ${p.blush})`,
                    color: p.accent,
                    fontFamily: nameFont(language),
                  }}
                >
                  <span aria-hidden={!alt} role={alt ? "img" : undefined} aria-label={alt || undefined} className="text-6xl">
                    {initials || <Cross stroke={p.accent} className="h-16 w-auto" strokeWidth={2} />}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Reveal */

/** Fade-up on scroll. Plain div (no animation) under prefers-reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------ GraceSection */

/** Section shell: pink (default) or white ground, vertical padding, centered max width. */
export function GraceSection({
  theme,
  language = "en",
  ground = "pink",
  children,
  className = "",
  maxWidth = "max-w-5xl",
  style,
  id,
}: {
  theme: Theme;
  language?: Language;
  ground?: "pink" | "white";
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  style?: CSSProperties;
  id?: string;
}) {
  const p = gracePalette(theme);
  return (
    <section
      id={id}
      {...{ [KH_CSS_ATTR]: language }}
      className={`relative isolate overflow-hidden px-5 py-20 sm:px-8 sm:py-28 ${className}`}
      style={{
        backgroundColor: ground === "white" ? p.card : p.ground,
        color: p.text,
        fontFamily: DISPLAY_FONT,
        ...style,
      }}
    >
      {language === "kh" && (
        <style>{`[${KH_CSS_ATTR}="kh"], [${KH_CSS_ATTR}="kh"] * { letter-spacing: normal !important; text-transform: none !important; }`}</style>
      )}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ backgroundImage: `linear-gradient(90deg, transparent, ${p.foilLight}, transparent)` }}
      />
      <div className={`relative mx-auto w-full ${maxWidth}`}>{children}</div>
    </section>
  );
}

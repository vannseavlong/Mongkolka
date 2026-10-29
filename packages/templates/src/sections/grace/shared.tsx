"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { Theme } from "../../types";
import { useLanguage, type Language } from "../../i18n";
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

// NOTE: gracePalette, foilGradient, nameFont and initialsOf are plain functions in a "use client" file;
// do not import them from a server component (they would become client references).
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

const FOIL_TEXT_CSS =
  ".grace-foil{color:var(--grace-accent)}" +
  "@supports (color:color-mix(in srgb,red 50%,white)) and (-webkit-background-clip:text){" +
  ".grace-foil{background-image:var(--grace-foil);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}}";

/**
 * Text filled with the gold foil gradient (decorative / large display only). Falls back
 * to solid accent where color-mix or background-clip:text is unsupported, so it is never invisible.
 */
export function FoilText({
  theme,
  children,
  className = "",
  style,
}: {
  theme: Theme;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <>
      <style>{FOIL_TEXT_CSS}</style>
      <span
        className={`grace-foil ${className}`}
        style={{ ["--grace-accent" as string]: theme.accent_color, ["--grace-foil" as string]: foilGradient(theme.accent_color), ...style }}
      >
        {children}
      </span>
    </>
  );
}

/** Mounted flag: false on the server and first client render, so server and client trees match. */
function useMounted(): boolean {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
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
      <path d={spray ? "M28 4H36V24H54V32H36V70H28V32H10V24H28Z" : "M28 4H36V24H54V32H36V80H28V32H10V24H28Z"} />
      {spray && (
        <g>
          {leaf(-72, 0.8)}
          {leaf(-42, 1)}
          {leaf(72, 0.8)}
          {leaf(42, 1)}
          <circle cx="32" cy="76" r="1.8" />
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
    backgroundColor: p.accent, // solid fallback if the gradient (color-mix) is unsupported
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

/**
 * Falling blush petals. Decorative. The container renders identically on server and first
 * client render; petals mount only after hydration, while in view, with the tab visible,
 * and never under prefers-reduced-motion.
 */
export function Petals({ theme, className = "" }: { theme: Theme; className?: string }) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [tabVisible, setTabVisible] = useState(true);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { blush, foilLight } = gracePalette(theme);
  const show = mounted && !reduce && inView && tabVisible && height > 0;
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {show &&
        PETALS.map((p, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 20 20"
            className="absolute -top-8"
            style={{ left: `${p.left}%`, width: p.size, height: p.size, willChange: "transform" }}
            initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: [0, height + 40],
              x: [0, p.sway, -p.sway / 2, p.sway / 3],
              rotate: [0, p.rotate],
              opacity: [0, 0.85, 0.85, 0],
            }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
          >
            {/* fill attribute = static fallback; style fill = theme-derived (dropped if color-mix unsupported) */}
            <path
              d="M10 1C16 4 18 11 10 19C2 11 4 4 10 1Z"
              fill={i % 5 === 0 ? "#ecd9a8" : "#f6b9c8"}
              style={{ fill: i % 5 === 0 ? foilLight : blush }}
            />
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
      .split(/[\s&+,\-\u2013]+/)
      .filter(Boolean)
      .map((w) => Array.from(w)[0] ?? ""),
  )
    .slice(0, max)
    .join("")
    .toUpperCase();
}

/**
 * Gold double-line arch that clips a photo (object-cover). Callers must pass `alt`
 * (the couple's names). With no `src`, or if the photo fails to load, it shows a soft
 * pink monogram from `initials` (e.g. initialsOf("Sokha & Dara")).
 * `position` is the CSS object-position focal point; `priority` loads eagerly (above the fold).
 */
export function ArchFrame({
  theme,
  src,
  alt = "",
  initials,
  position = "center",
  priority = false,
  className = "",
}: {
  theme: Theme;
  src?: string | null;
  alt?: string;
  initials?: string;
  position?: string;
  priority?: boolean;
  className?: string;
}) {
  const { language } = useLanguage();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  // The error event can fire before hydration attaches onError; re-check the finished-but-broken state on mount.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0 && src) setFailedSrc(src);
  }, [src]);
  const p = gracePalette(theme);
  const arch = "rounded-t-[999px]";
  // backgroundColor = solid fallback when the foil gradient (color-mix) is unsupported
  const foil: CSSProperties = { backgroundColor: p.accent, backgroundImage: p.foilGradient };
  const showPhoto = !!src && failedSrc !== src;
  return (
    <div className={`mx-auto w-full max-w-sm ${className}`}>
      <div className={`${arch} p-[2px]`} style={foil}>
        <div className={`${arch} p-[5px]`} style={{ backgroundColor: p.card }}>
          <div className={`${arch} p-[1.5px]`} style={foil}>
            <div className={`${arch} relative aspect-[3/4] w-full overflow-hidden`} style={{ backgroundColor: p.blush }}>
              {showPhoto ? (
                <img
                  ref={imgRef}
                  src={src!}
                  alt={alt}
                  loading={priority ? "eager" : "lazy"}
                  decoding="async"
                  onError={() => setFailedSrc(src!)}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: position }}
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(180deg, ${p.card}, ${p.blush})`,
                    color: p.accent,
                    fontFamily: nameFont(language),
                  }}
                >
                  <span
                    role={alt ? "img" : undefined}
                    aria-label={alt || undefined}
                    aria-hidden={alt ? undefined : true}
                    className="max-w-full whitespace-nowrap px-2 leading-none"
                    style={{ fontSize: "clamp(2rem, 16vw, 3.75rem)" }}
                  >
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

const REVEAL_PRINT_CSS = "@media print{[data-grace-reveal]{opacity:1!important;transform:none!important}}";

/**
 * Fade-up on scroll. Content starts visible (no JS, before hydration, no IntersectionObserver,
 * reduced motion, print); the hidden state is armed only after mount, and only below the fold.
 */
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
  const mounted = useMounted();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const armed = mounted && !reduce && typeof IntersectionObserver !== "undefined";
  const hidden = armed && !inView;
  return (
    <>
      <style>{REVEAL_PRINT_CSS}</style>
      <motion.div
        ref={ref}
        data-grace-reveal
        className={className}
        initial={false}
        animate={hidden ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
        transition={armed ? { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------ GraceSection */

/** Section shell: pink (default) or white ground, vertical padding, centered max width. */
export function GraceSection({
  theme,
  ground = "pink",
  children,
  className = "",
  maxWidth = "max-w-5xl",
  style,
  id,
}: {
  theme: Theme;
  ground?: "pink" | "white";
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  style?: CSSProperties;
  id?: string;
}) {
  const p = gracePalette(theme);
  const { language } = useLanguage();
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
        style={{ backgroundColor: p.accent, opacity: 0.4, backgroundImage: `linear-gradient(90deg, transparent, ${p.foilLight}, transparent)` }}
      />
      <div className={`relative mx-auto w-full ${maxWidth}`}>{children}</div>
    </section>
  );
}

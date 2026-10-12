"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Theme } from "../../types";

/*
 * Shared building blocks for the "Ink & Gold" printed-invitation pack. The pack is
 * deliberately driven only by the four Theme colors (paper = bg, ink = text, foil =
 * accent) so couples can still recolor it, and every other section in the pack
 * alternates paper/ink by swapping the two, which is what gives the page its rhythm.
 */

export const DISPLAY_FONT =
  'var(--font-display), "Cormorant Garamond", "Noto Serif Khmer", "Playfair Display", Georgia, serif';
export const LABEL_FONT = 'var(--font-label), "Helvetica Neue", Arial, "Noto Sans Khmer", sans-serif';

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export function mix(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

/** Paper-grain overlay; purely decorative, never intercepts pointer events. */
export function Grain({ opacity = 0.09 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-multiply"
      style={{ backgroundImage: GRAIN, opacity }}
    />
  );
}

/** A section shell: paper (default) or inverted ink, with grain and a gold hairline. */
export function InkSection({
  theme,
  inverted = false,
  children,
  className = "",
  style,
  id,
}: {
  theme: Theme;
  inverted?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative isolate overflow-hidden ${className}`}
      style={{
        backgroundColor: inverted ? theme.text_color : theme.bg_color,
        color: inverted ? theme.bg_color : theme.text_color,
        fontFamily: DISPLAY_FONT,
        ...style,
      }}
    >
      <Grain opacity={inverted ? 0.16 : 0.09} />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ backgroundImage: `linear-gradient(90deg, transparent, ${theme.accent_color}, transparent)` }}
      />
      <div className="relative">{children}</div>
    </section>
  );
}

/** Tiny uppercase tracked label, the "printer's mark" voice used across the pack. */
export function Eyebrow({ children, color, className = "" }: { children: ReactNode; color: string; className?: string }) {
  return (
    <p
      className={`text-[11px] font-medium uppercase tracking-[0.42em] ${className}`}
      style={{ color, fontFamily: LABEL_FONT }}
    >
      {children}
    </p>
  );
}

/** Centered diamond-and-line divider, a nod to Khmer border ornament. */
export function Ornament({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 16"
      className={`mx-auto h-4 w-60 ${className}`}
      fill="none"
      stroke={color}
      strokeWidth="1"
    >
      <path d="M0 8H92M148 8H240" />
      <path d="M120 1l7 7-7 7-7-7z" fill={color} />
      <path d="M104 8l4-4 4 4-4 4zM128 8l4-4 4 4-4 4z" />
    </svg>
  );
}

export function toRoman(n: number): string {
  const map: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  let rest = n;
  for (const [value, glyph] of map) {
    while (rest >= value) {
      out += glyph;
      rest -= value;
    }
  }
  return out;
}

export function splitDate(iso: string | undefined) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString(undefined, { month: "long" }),
    monthShort: d.toLocaleDateString(undefined, { month: "short" }),
    year: String(d.getFullYear()),
    weekday: d.toLocaleDateString(undefined, { weekday: "long" }),
  };
}

import { useId } from "react";
import type { CreamPalette } from "../palette";

/**
 * An original butterfly: two wing pairs in a blush-to-gold wash with a gold-lined edge. The wings
 * carry the class `cr-wing` so the CSS can flap them; the body stays still. Decorative (aria-hidden).
 */
export function Butterfly({ p, size = 40 }: { p: CreamPalette; size?: number }) {
  const g = `bf${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={g} cx="0.1" cy="0.5" r="1">
          <stop offset="0" stopColor={p.rose} stopOpacity="0.95" />
          <stop offset="0.55" stopColor={p.blush} stopOpacity="0.9" />
          <stop offset="1" stopColor={p.goldHi} stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <g className="cr-wing cr-wing-l" style={{ transformOrigin: "24px 24px" }}>
        <path d="M24 24C14 8 3 8 4 18C5 25 14 27 24 24Z" fill={`url(#${g})`} stroke={p.gold} strokeOpacity="0.7" strokeWidth="0.7" />
        <path d="M24 25C13 27 6 35 12 40C18 43 23 33 24 25Z" fill={`url(#${g})`} stroke={p.gold} strokeOpacity="0.7" strokeWidth="0.7" opacity="0.92" />
        <circle cx="12" cy="16" r="2" fill={p.goldHi} opacity="0.8" />
      </g>
      <g className="cr-wing cr-wing-r" style={{ transformOrigin: "24px 24px" }}>
        <path d="M24 24C34 8 45 8 44 18C43 25 34 27 24 24Z" fill={`url(#${g})`} stroke={p.gold} strokeOpacity="0.7" strokeWidth="0.7" />
        <path d="M24 25C35 27 42 35 36 40C30 43 25 33 24 25Z" fill={`url(#${g})`} stroke={p.gold} strokeOpacity="0.7" strokeWidth="0.7" opacity="0.92" />
        <circle cx="36" cy="16" r="2" fill={p.goldHi} opacity="0.8" />
      </g>
      <path d="M24 19V33" stroke={p.goldLo} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M24 19C22 14 20 12 18 11M24 19C26 14 28 12 30 11" fill="none" stroke={p.goldLo} strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

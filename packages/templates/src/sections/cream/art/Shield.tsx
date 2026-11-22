import { useId } from "react";
import { MOUL_FONT } from "../../../chrome/fonts";
import { goldStops } from "../../../chrome/gold";

const KHMER = /[ក-៿]/;
const SCRIPT = 'var(--font-script), "Great Vibes", cursive';

/**
 * Original gold shield monogram: a swooped-top shield with a lotus finial, a double foil rim, two
 * laurel sprigs and the couple's initials. Used as the envelope seal, the shared crest and the hero
 * fallback. The initials are text so they follow the page fonts.
 */
export function Shield({ color, ground, label, size = 96 }: { color: string; ground: string; label: string; size?: number }) {
  const g = `sh${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const { hi, mid, lo } = goldStops(color);
  const khmer = KHMER.test(label);
  const fontSize = label.length > 5 ? 17 : 22;
  return (
    <svg width={size} height={(size * 124) / 100} viewBox="0 0 100 124" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hi} />
          <stop offset="0.5" stopColor={mid} />
          <stop offset="1" stopColor={lo} />
        </linearGradient>
        <linearGradient id={`${g}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ground} />
          <stop offset="1" stopColor={ground} stopOpacity="0.88" />
        </linearGradient>
      </defs>
      {/* Lotus finial */}
      <g fill={`url(#${g})`}>
        <path d="M50 0C46 5 46 10 50 14C54 10 54 5 50 0Z" />
        <path d="M50 14C42 13 38 8 38 4C44 5 48 9 50 14Z" opacity="0.9" />
        <path d="M50 14C58 13 62 8 62 4C56 5 52 9 50 14Z" opacity="0.9" />
      </g>
      {/* Shield body: outer foil rim, then a paper inset */}
      <path d="M50 16C64 22 80 22 93 17C96 54 90 90 50 120C10 90 4 54 7 17C20 22 36 22 50 16Z" fill={`url(#${g})`} />
      <path d="M50 21C63 26 78 26 88 22C90 54 85 85 50 113C15 85 10 54 12 22C22 26 37 26 50 21Z" fill={`url(#${g}f)`} />
      <path d="M50 26C62 30 75 30 84 27C85 54 80 80 50 106C20 80 15 54 16 27C25 30 38 30 50 26Z" fill="none" stroke={`url(#${g})`} strokeWidth="0.9" opacity="0.8" />
      {/* Laurel sprigs */}
      <g fill="none" stroke={`url(#${g})`} strokeLinecap="round" strokeWidth="1.2">
        <path d="M30 92C22 80 21 66 25 52" />
        <path d="M70 92C78 80 79 66 75 52" />
      </g>
      <g fill={`url(#${g})`}>
        {[
          [24, 58, -30],
          [23, 68, -20],
          [25, 78, -8],
          [29, 87, 6],
        ].map(([x, y, r], i) => (
          <path key={`l${i}`} transform={`translate(${x} ${y}) rotate(${r})`} d="M0 0C-3 -3 -3 -7 0 -9C3 -7 3 -3 0 0Z" />
        ))}
        {[
          [76, 58, 30],
          [77, 68, 20],
          [75, 78, 8],
          [71, 87, -6],
        ].map(([x, y, r], i) => (
          <path key={`r${i}`} transform={`translate(${x} ${y}) rotate(${r})`} d="M0 0C-3 -3 -3 -7 0 -9C3 -7 3 -3 0 0Z" />
        ))}
      </g>
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fontSize={khmer ? fontSize - 4 : fontSize}
        fill={`url(#${g})`}
        style={{ fontFamily: khmer ? MOUL_FONT : SCRIPT, letterSpacing: khmer ? 0 : "0.02em" }}
      >
        {label}
      </text>
      <path d="M40 76H60" stroke={`url(#${g})`} strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
      <path d="M47 80 50 77 53 80 50 83Z" fill={`url(#${g})`} />
    </svg>
  );
}

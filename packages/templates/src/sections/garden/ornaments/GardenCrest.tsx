import { useId } from "react";
import type { CrestProps } from "../../khmer/skin-ornament-types";
import { Art } from "../art/Botanicals";
import { LEAF, ROSE } from "../art/botanical-data";
import { laurel } from "../laurel";
import { lightPalette } from "./light-palette";

/** Original monogram crest: a laurel wreath of leaves round a double gold ring, a rose at the crown, a ribbon below. */
export function GardenCrest({ color, ground, label, size = 112 }: CrestProps) {
  const p = lightPalette(color);
  const g = `gk${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const long = Array.from(label).length > 5;
  const leaves = laurel(9, 44);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={label} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.gold.hi} />
          <stop offset="0.5" stopColor={p.gold.mid} />
          <stop offset="1" stopColor={p.gold.lo} />
        </linearGradient>
        <radialGradient id={`${g}b`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor={ground} stopOpacity="0.55" />
          <stop offset="1" stopColor={ground} />
        </radialGradient>
      </defs>
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${60 + l.x} ${60 + l.y}) rotate(${l.rot})`}>
          <Art def={LEAF} palette={p} width={17} style={{ transform: "translate(-8px,-4px)" }} />
        </g>
      ))}
      <circle cx="60" cy="60" r="33" fill={`url(#${g}b)`} stroke={`url(#${g})`} strokeWidth="2" />
      <circle cx="60" cy="60" r="28.5" fill="none" stroke={`url(#${g})`} strokeWidth="0.7" opacity="0.8" />
      <g transform="translate(46 6)"><Art def={ROSE} palette={p} width={28} /></g>
      <path d="M40 104C48 98 54 104 60 106C66 104 72 98 80 104C74 110 66 109 60 112C54 109 46 110 40 104Z" fill={`url(#${g})`} />
      <text x="60" y={long ? 66 : 69} textAnchor="middle" fontSize={long ? 18 : 26} fill={`url(#${g})`} stroke={p.gold.lo} strokeWidth="0.12" style={{ fontFamily: 'var(--font-script), "Great Vibes", cursive' }}>
        {label}
      </text>
    </svg>
  );
}

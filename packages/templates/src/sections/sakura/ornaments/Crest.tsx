import { mixHex } from "../../../chrome/gold";
import type { CrestProps } from "../../khmer/skin-ornament-types";
import { SAKURA_GOLD } from "../palette";
import { SakuraArtStyle } from "../SakuraArtStyle";
import { BlossomMark, FoilDef, useSvgId } from "./shared";

const RING = Array.from({ length: 12 }, (_, i) => i * 30);

/**
 * Gold monogram medallion: a double gold ring wreathed by twelve small blossoms and leaf pairs, the
 * monogram in script at the centre. Drawn from scratch.
 */
export function SakuraCrest({ color, ground, label, size = 120 }: CrestProps) {
  const g = useSvgId("sk");
  const long = Array.from(label).length > 5;
  const petal = mixHex(color, "#ffffff", 40);
  const edge = mixHex(color, "#ffffff", 85);
  return (
    <>
      <SakuraArtStyle accent={color} />
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={label} style={{ display: "block", overflow: "visible" }}>
        <defs>
          <FoilDef id={g} />
          <radialGradient id={`${g}b`} cx="0.5" cy="0.38" r="0.75">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor={mixHex(ground, "#ffffff", 60)} />
          </radialGradient>
        </defs>
        {RING.map((a) => (
          <g key={a} transform={`rotate(${a} 60 60)`}>
            <path d="M60 8c-3 4-3 8 0 11c3-3 3-7 0-11Z" fill="#b3c7a8" transform="translate(-7 4) rotate(-35 60 14)" />
            <path d="M60 8c-3 4-3 8 0 11c3-3 3-7 0-11Z" fill="#b3c7a8" transform="translate(7 4) rotate(35 60 14)" />
            <BlossomMark x={60} y={10} r={a % 60 === 0 ? 6.5 : 4.4} rot={a} fill={a % 60 === 0 ? petal : "#ffffff"} edge={edge} />
          </g>
        ))}
        <circle cx="60" cy="60" r="40" fill={`url(#${g}b)`} stroke={`url(#${g})`} strokeWidth="2.4" />
        <circle cx="60" cy="60" r="35" fill="none" stroke={`url(#${g})`} strokeWidth="0.8" opacity="0.85" />
        <circle cx="60" cy="60" r="30" fill="none" stroke={`url(#${g})`} strokeWidth="0.5" strokeDasharray="1.4 3" opacity="0.7" />
        <path d="M60 26 57 29.5 60 33 63 29.5ZM60 94 57 90.5 60 87 63 90.5Z" fill={`url(#${g})`} />
        <text
          x="60"
          y={long ? 66 : 69}
          textAnchor="middle"
          fontSize={long ? 20 : 28}
          fill={`url(#${g})`}
          stroke={SAKURA_GOLD.lo}
          strokeWidth="0.15"
          style={{ fontFamily: 'var(--font-script), "Great Vibes", cursive' }}
        >
          {label}
        </text>
      </svg>
    </>
  );
}

import type { CSSProperties } from "react";
import type { CovenantPalette } from "./palette";
import { PINK } from "./palette";
import type { CoverTone } from "./cover-logic";

function tonePair(tone: CoverTone, p: CovenantPalette): { fill: string; edge: string } {
  switch (tone) {
    case "gold":
      return { fill: p.gold.hi, edge: p.gold.lo };
    case "rose":
      return { fill: PINK.rose, edge: PINK.deepRose };
    case "blush":
      return { fill: PINK.petal, edge: PINK.rose };
    default:
      return { fill: "#ffffff", edge: p.gold.mid };
  }
}

const WING_UPPER = "M50 38 C58 8 92 2 96 22 C99 36 74 46 50 40 Z";
const WING_LOWER = "M50 42 C70 46 88 52 82 66 C77 78 58 68 50 46 Z";
const MIRROR = "matrix(-1 0 0 1 100 0)";

/** Original butterfly: two mirrored wings that flap by squeezing toward the body, plus a body and antennae. */
export function CoverButterflyArt({ tone, p, style }: { tone: CoverTone; p: CovenantPalette; style?: CSSProperties }) {
  const { fill, edge } = tonePair(tone, p);
  const wing = (
    <g fill={fill} fillOpacity={0.88} stroke={edge} strokeWidth={1.2} strokeLinejoin="round">
      <path d={WING_UPPER} />
      <path d={WING_LOWER} />
      <circle cx={78} cy={22} r={3.4} fill="#fff" fillOpacity={0.75} stroke="none" />
      <circle cx={70} cy={60} r={2.4} fill="#fff" fillOpacity={0.7} stroke="none" />
      <path d="M52 40 C66 30 80 24 90 22 M52 44 C64 52 72 58 78 64" fill="none" strokeOpacity={0.5} strokeWidth={0.8} />
    </g>
  );
  return (
    <svg viewBox="0 0 100 80" width="100%" height="100%" aria-hidden style={style} overflow="visible">
      <g className="cv-wings">
        {wing}
        <g transform={MIRROR}>{wing}</g>
      </g>
      <ellipse cx={50} cy={42} rx={2.6} ry={14} fill={edge} />
      <path d="M49 28 C46 20 42 16 38 14 M51 28 C54 20 58 16 62 14" fill="none" stroke={edge} strokeWidth={1.1} strokeLinecap="round" />
    </svg>
  );
}

/** Original five-petal flower with a gold heart. */
export function CoverFlowerArt({ tone, p }: { tone: CoverTone; p: CovenantPalette }) {
  const { fill, edge } = tonePair(tone, p);
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden overflow="visible">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx={50} cy={27} rx={13} ry={23} transform={`rotate(${deg} 50 50)`} fill={fill} fillOpacity={0.92} stroke={edge} strokeWidth={1.1} />
      ))}
      <circle cx={50} cy={50} r={10} fill={p.gold.mid} stroke={p.gold.lo} strokeWidth={1} />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <circle key={deg} cx={50 + 5.5 * Math.cos((deg * Math.PI) / 180)} cy={50 + 5.5 * Math.sin((deg * Math.PI) / 180)} r={1.3} fill={p.gold.hi} />
      ))}
    </svg>
  );
}

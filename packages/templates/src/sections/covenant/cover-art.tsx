import { useId, type CSSProperties } from "react";
import type { CovenantPalette } from "./palette";
import { PINK } from "./palette";
import { VINE, type CoverTone } from "./cover-logic";

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

const LEAF = "M0 0 C6 -9 17 -9 24 0 C17 9 6 9 0 0 Z";

/**
 * One corner vine: the stem draws itself, leaves pop along it, and (garden cover) a bloom opens at its tip.
 * Drawn top-left in a 200x200 box; callers mirror it for the other corners.
 */
export function CoverVine({ p, bloom, delay }: { p: CovenantPalette; bloom: boolean; delay: number }) {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden overflow="visible">
      <g fill="none" stroke={p.gold.mid} strokeLinecap="round">
        <path d={VINE.stem} pathLength={1} className="cvc-draw" strokeWidth={2.2} style={{ animationDelay: `${delay}ms` }} />
        <path d={VINE.tendril} pathLength={1} className="cvc-draw" strokeWidth={1.4} style={{ animationDelay: `${delay + 900}ms` }} />
      </g>
      {VINE.leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.s})`}>
          <path
            d={LEAF}
            className="cvc-leaf"
            fill={i % 2 ? p.gold.hi : p.gold.mid}
            fillOpacity={0.9}
            stroke={p.gold.lo}
            strokeWidth={0.8}
            style={{ animationDelay: `${delay + 500 + i * 140}ms` }}
          />
        </g>
      ))}
      {bloom && (
        <svg x={VINE.bloom.x - VINE.bloom.size / 2} y={VINE.bloom.y - VINE.bloom.size / 2} width={VINE.bloom.size} height={VINE.bloom.size} overflow="visible">
          <g className="cvc-pop" style={{ animationDelay: `${delay + 1700}ms` }}>
            <CoverFlowerArt tone="rose" p={p} />
          </g>
        </svg>
      )}
    </svg>
  );
}

/** The gold medallion ring: two circles that draw themselves, with a diamond at each quarter. */
export function CoverRing({ p }: { p: CovenantPalette }) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.gold.hi} />
          <stop offset=".5" stopColor={p.gold.mid} />
          <stop offset="1" stopColor={p.gold.lo} />
        </linearGradient>
        <radialGradient id={`${id}-f`} cx=".5" cy=".42" r=".6">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.85} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0.15} />
        </radialGradient>
      </defs>
      <circle cx={100} cy={100} r={92} fill={`url(#${id}-f)`} className="cvc-fade-in" style={{ animationDelay: "500ms" }} />
      <g fill="none" stroke={`url(#${id}-g)`}>
        <circle cx={100} cy={100} r={96} pathLength={1} className="cvc-draw cvc-ring" strokeWidth={2.4} />
        <circle cx={100} cy={100} r={89} pathLength={1} className="cvc-draw cvc-ring" strokeWidth={1} style={{ animationDelay: "350ms" }} />
      </g>
      {[0, 90, 180, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 100 100)`}>
          <path d="M100 -2 l5 6 l-5 6 l-5 -6 Z" fill={p.gold.mid} className="cvc-pop" style={{ animationDelay: `${1300 + deg * 3}ms` }} />
        </g>
      ))}
    </svg>
  );
}

/** A four-point sparkle that twinkles. */
export function CoverSparkleArt({ p }: { p: CovenantPalette }) {
  return (
    <svg viewBox="0 0 20 20" width="100%" height="100%" aria-hidden>
      <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z" fill={p.gold.hi} stroke={p.gold.mid} strokeWidth={0.6} />
    </svg>
  );
}

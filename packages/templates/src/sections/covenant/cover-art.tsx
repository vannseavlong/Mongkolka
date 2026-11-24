import type { CSSProperties } from "react";
import type { CovenantPalette } from "./palette";
import { GREEN, PINK } from "./palette";
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

/** A layered flower: an outer ring of petals, a lighter inner ring, and a gold heart. */
export function CoverFlowerArt({ tone, p }: { tone: CoverTone; p: CovenantPalette }) {
  const { fill, edge } = tonePair(tone, p);
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden overflow="visible">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse key={deg} cx={50} cy={25} rx={11} ry={22} transform={`rotate(${deg} 50 50)`} fill={fill} fillOpacity={0.95} stroke={edge} strokeWidth={0.9} />
      ))}
      {[22, 94, 166, 238, 310].map((deg) => (
        <ellipse key={deg} cx={50} cy={34} rx={8} ry={14} transform={`rotate(${deg} 50 50)`} fill="#ffffff" fillOpacity={0.55} stroke={edge} strokeWidth={0.5} strokeOpacity={0.6} />
      ))}
      <circle cx={50} cy={50} r={8} fill={p.gold.mid} stroke={p.gold.lo} strokeWidth={0.8} />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <circle key={deg} cx={50 + 4.5 * Math.cos((deg * Math.PI) / 180)} cy={50 + 4.5 * Math.sin((deg * Math.PI) / 180)} r={1.2} fill={p.gold.hi} />
      ))}
    </svg>
  );
}

/** A soft green leaf with a centre vein, pointing right. */
export function CoverLeafArt({ deep }: { deep: boolean }) {
  return (
    <svg viewBox="0 0 40 20" width="100%" height="100%" aria-hidden>
      <path d="M0 10 C8 -2 28 -2 40 10 C28 22 8 22 0 10 Z" fill={deep ? GREEN.deep : GREEN.leaf} fillOpacity={0.95} />
      <path d="M2 10 H36" stroke="#ffffff" strokeOpacity={0.45} strokeWidth={0.8} />
    </svg>
  );
}

/** A white dove in flight: body, head and a wing that beats. */
export function CoverDoveArt({ p }: { p: CovenantPalette }) {
  return (
    <svg viewBox="0 0 100 70" width="100%" height="100%" aria-hidden overflow="visible">
      <path d="M8 42 C24 30 50 32 64 42 C72 48 82 46 90 36 C88 48 78 58 62 56 C46 60 22 58 8 42 Z" fill="#ffffff" stroke={p.gold.lo} strokeWidth={0.9} strokeOpacity={0.7} />
      <circle cx={85} cy={36} r={5.5} fill="#ffffff" stroke={p.gold.lo} strokeWidth={0.8} strokeOpacity={0.7} />
      <path d="M90 35 L99 38 L90 40 Z" fill={p.gold.mid} />
      <circle cx={86.5} cy={34.5} r={1} fill={p.gold.lo} />
      <g className="cvc-wing">
        <path d="M44 40 C38 14 58 0 80 4 C66 14 62 30 58 44 Z" fill="#ffffff" stroke={p.gold.lo} strokeWidth={0.9} strokeOpacity={0.7} />
        <path d="M50 38 C52 24 62 12 74 8" fill="none" stroke={p.gold.lo} strokeWidth={0.7} strokeOpacity={0.5} />
      </g>
    </svg>
  );
}

/** A hanging chandelier: chain, canopy, curved arms with candles, and swinging crystals. */
export function CoverChandelierArt({ p }: { p: CovenantPalette }) {
  const arm = (mirror: boolean) => (
    <g transform={mirror ? "matrix(-1 0 0 1 120 0)" : undefined} fill="none" stroke={p.gold.mid} strokeWidth={1.6} strokeLinecap="round">
      <path d="M60 44 C22 44 14 72 22 88" />
      <path d="M60 44 C40 56 36 78 40 96" />
      <g stroke="none" fill={p.gold.hi}>
        <rect x={19} y={76} width={6} height={12} rx={1.5} />
        <rect x={37} y={84} width={6} height={12} rx={1.5} />
      </g>
      <g stroke="none" fill="#fff3c4">
        <ellipse cx={22} cy={72} rx={3} ry={5} className="cvc-flame" />
        <ellipse cx={40} cy={80} rx={3} ry={5} className="cvc-flame" style={{ animationDelay: "300ms" }} />
      </g>
    </g>
  );
  return (
    <svg viewBox="0 0 120 170" width="100%" height="100%" aria-hidden overflow="visible">
      <defs>
        <radialGradient id="cvc-glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff3c4" stopOpacity={0.6} />
          <stop offset="1" stopColor="#fff3c4" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={60} cy={80} r={62} fill="url(#cvc-glow)" />
      <path d="M60 0 V30" stroke={p.gold.mid} strokeWidth={1.4} />
      <path d="M48 34 C48 26 72 26 72 34 L68 44 H52 Z" fill={p.gold.mid} />
      {arm(false)}
      {arm(true)}
      <path d="M60 44 V100" stroke={p.gold.mid} strokeWidth={1.6} />
      {[
        [60, 104],
        [46, 112],
        [74, 112],
        [30, 100],
        [90, 100],
        [60, 128],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l-3.5 8 c0 5 7 5 7 0 Z`} fill="#ffffff" fillOpacity={0.85} stroke={p.gold.mid} strokeWidth={0.7} className="cvc-crystal" style={{ animationDelay: `${i * 260}ms` }} />
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

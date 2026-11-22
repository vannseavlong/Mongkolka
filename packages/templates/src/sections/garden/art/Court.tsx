import { useId, type CSSProperties } from "react";
import type { GardenPalette } from "../palette";
import { Art } from "./Botanicals";
import { BUD, LEAF, ROSE } from "./botanical-data";

/** Bumpy hedge top as a closed path: a row of arcs along y, filled down to `bottom`. Pure, deterministic. */
export function hedgePath(x0: number, x1: number, y: number, bottom: number, bump = 26, rise = 16): string {
  const n = Math.max(1, Math.round(Math.abs(x1 - x0) / bump));
  const step = (x1 - x0) / n;
  let d = `M${x0} ${bottom}L${x0} ${y}`;
  for (let i = 0; i < n; i++) {
    const a = x0 + step * i;
    const lift = i % 2 === 0 ? rise : rise * 0.7;
    d += `Q${(a + step / 2).toFixed(1)} ${(y - lift).toFixed(1)} ${(a + step).toFixed(1)} ${y}`;
  }
  return `${d}L${x1} ${bottom}Z`;
}

/** A small arcade of windows for the distant palace facade. */
function Facade({ p, x, y, w, h }: { p: GardenPalette; x: number; y: number; w: number; h: number }) {
  const cols = 7;
  const cw = w / cols;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={p.stone} opacity="0.5" />
      <rect x={x} y={y} width={w} height="5" fill={p.stone} opacity="0.7" />
      {Array.from({ length: cols }, (_, i) => (
        <path key={i} d={`M${x + cw * i + cw * 0.22} ${y + h}V${y + h * 0.46}a${cw * 0.28} ${cw * 0.28} 0 0 1 ${cw * 0.56} 0V${y + h}Z`} fill={p.sky} opacity="0.55" />
      ))}
      <path d={`M${x + w * 0.38} ${y}V${y - 26}a${w * 0.12} ${w * 0.12} 0 0 1 ${w * 0.24} 0V${y}Z`} fill={p.stone} opacity="0.55" />
      <path d={`M${x + w * 0.5} ${y - 50}V${y - 62}`} stroke={p.gold.mid} strokeWidth="1.5" />
      <circle cx={x + w * 0.5} cy={y - 63} r="2.2" fill={p.gold.mid} />
    </g>
  );
}

function Fountain({ p, uid }: { p: GardenPalette; uid: string }) {
  const stone = p.stoneLight;
  return (
    <g transform="translate(195 548)">
      <ellipse cx="0" cy="8" rx="96" ry="19" fill={p.stone} opacity="0.55" />
      <ellipse cx="0" cy="2" rx="90" ry="16" fill={stone} />
      <ellipse cx="0" cy="2" rx="80" ry="12" fill={p.sage} opacity="0.35" />
      <ellipse cx="0" cy="0" rx="74" ry="10" fill={`url(#w${uid})`} />
      <path d="M-12 -2V-46H12V-2Z" fill={stone} />
      <ellipse cx="0" cy="-46" rx="40" ry="8" fill={stone} />
      <ellipse cx="0" cy="-47" rx="34" ry="5.5" fill={`url(#w${uid})`} />
      <path d="M-6 -48V-84H6V-48Z" fill={stone} />
      <ellipse cx="0" cy="-84" rx="22" ry="5" fill={stone} />
      <ellipse cx="0" cy="-85" rx="17" ry="3.4" fill={`url(#w${uid})`} />
      <path d="M0 -86C-3 -98 3 -108 0 -116" stroke={p.white} strokeWidth="2.2" fill="none" strokeLinecap="round" className="gd-water" />
      <g stroke={p.white} strokeWidth="1.6" fill="none" strokeLinecap="round" className="gd-water" opacity="0.9">
        <path d="M0 -86C-24 -112 -50 -80 -62 -50" />
        <path d="M0 -86C24 -112 50 -80 62 -50" />
        <path d="M0 -48C-30 -62 -56 -40 -70 -4" />
        <path d="M0 -48C30 -62 56 -40 70 -4" />
      </g>
      <circle cx="0" cy="-118" r="3" fill={p.gold.hi} />
    </g>
  );
}

/**
 * The illustrated palace-garden court revealed behind the gate (and echoed, softer, behind the hero):
 * pale sky, a distant arcaded palace, clipped hedges, a stone path to a tiered fountain, rose bushes
 * in the foreground. Pure SVG, drawn from scratch, scaled with `slice` so it always fills the screen.
 */
export function GardenCourt({ palette: p, className, style, veil = 0 }: { palette: GardenPalette; className?: string; style?: CSSProperties; veil?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 390 720" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false" className={className} style={{ display: "block", ...style }}>
      <defs>
        <linearGradient id={`s${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.dark ? "#2a2a33" : "#fbf3ee"} />
          <stop offset="0.55" stopColor={p.sky} />
          <stop offset="1" stopColor={p.dark ? "#3a3340" : "#f1dfd8"} />
        </linearGradient>
        <linearGradient id={`w${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9ece9" />
          <stop offset="1" stopColor="#a9cfcf" />
        </linearGradient>
        <linearGradient id={`p${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.stoneLight} />
          <stop offset="1" stopColor={p.stone} stopOpacity="0.75" />
        </linearGradient>
        <radialGradient id={`l${uid}`} cx="0.5" cy="0.28" r="0.6">
          <stop offset="0" stopColor={p.gold.hi} stopOpacity="0.55" />
          <stop offset="1" stopColor={p.gold.hi} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="390" height="720" fill={`url(#s${uid})`} />
      <rect width="390" height="720" fill={`url(#l${uid})`} />
      <Facade p={p} x={60} y={250} w={270} h={92} />
      <Facade p={p} x={0} y={282} w={110} h={64} />
      <Facade p={p} x={280} y={282} w={110} h={64} />
      <rect y="330" width="390" height="30" fill={p.sky} opacity="0.55" />
      <path d={hedgePath(0, 390, 372, 640, 30, 14)} fill={p.sage} opacity="0.55" />
      <path d="M170 372L220 372L390 720L0 720Z" fill={`url(#p${uid})`} />
      <path d="M170 372L0 720M220 372L390 720" stroke={p.stone} strokeWidth="1.2" opacity="0.6" />
      <path d="M186 380L130 720M204 380L260 720" stroke={p.white} strokeWidth="0.8" opacity="0.5" />
      <path d={hedgePath(-10, 128, 400, 720, 24, 18)} fill={p.sage} />
      <path d={hedgePath(262, 400, 400, 720, 24, 18)} fill={p.sage} />
      <path d={hedgePath(-10, 96, 452, 720, 22, 14)} fill={p.sageDeep} opacity="0.85" />
      <path d={hedgePath(294, 400, 452, 720, 22, 14)} fill={p.sageDeep} opacity="0.85" />
      <g opacity="0.9">
        {[
          [18, 410, 20],
          [46, 428, 16],
          [88, 418, 18],
          [352, 412, 20],
          [326, 430, 16],
          [292, 420, 18],
        ].map(([x, y, w], i) => (
          <g key={i} transform={`translate(${(x ?? 0) - (w ?? 0) / 2} ${y})`}>
            <Art def={ROSE} palette={p} width={w ?? 18} />
          </g>
        ))}
      </g>
      <Fountain p={p} uid={uid} />
      <g>
        {[
          [24, 640, 54, -20],
          [70, 668, 44, 10],
          [366, 640, 54, 200],
          [320, 668, 44, 170],
        ].map(([x, y, w, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <Art def={LEAF} palette={p} width={w ?? 40} />
          </g>
        ))}
        {[
          [36, 646, 40],
          [86, 676, 34],
          [354, 646, 40],
          [304, 676, 34],
          [20, 690, 30],
          [372, 692, 30],
        ].map(([x, y, w], i) => (
          <g key={i} transform={`translate(${(x ?? 0) - (w ?? 0) / 2} ${(y ?? 0) - (w ?? 0) / 2})`}>
            <Art def={i % 3 === 2 ? BUD : ROSE} palette={p} width={w ?? 34} />
          </g>
        ))}
      </g>
      <rect width="390" height="720" fill={p.ground} opacity={veil} />
    </svg>
  );
}

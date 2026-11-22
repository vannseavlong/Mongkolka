import { useId } from "react";
import { mixHex } from "../../chrome/gold";
import { LEAF, LEAF_DEEP, MORPHO_DEEP, MORPHO_LIGHT, PINK, PINK_DEEP, clusterPoints } from "./fairytale-logic";

/**
 * Original fairytale artwork, inline SVG only: a white palace, hydrangea heads, baby's-breath sprigs,
 * a blue morpho-style butterfly, clouds, sparkles, flower stickers. Drawn from scratch for this
 * template; nothing is traced from any reference. Animation classes (ft-*) live in fairytale-styles.ts.
 */

export function useUid(prefix: string): string {
  return `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}

/** Four-lobed floret in a unit circle (one path). */
const FLORET =
  "M0 0C-.55-.2-.55-.9 0-1C.55-.9.55-.2 0 0ZM0 0C.2-.55.9-.55 1 0C.9.55.2.55 0 0ZM0 0C.55.2.55.9 0 1C-.55.9-.55.2 0 0ZM0 0C-.2.55-.9.55-1 0C-.9-.55-.2-.55 0 0Z";

const LEAF_PATH = "M0 0C6-10 20-12 30 0C20 12 6 10 0 0Z";

export function Leaf({ x, y, rotate, scale = 1, color = LEAF }: { x: number; y: number; rotate: number; scale?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d={LEAF_PATH} fill={color} />
      <path d="M2 0H26" stroke={LEAF_DEEP} strokeOpacity=".55" strokeWidth=".8" strokeLinecap="round" />
    </g>
  );
}

export interface HydrangeaProps {
  x: number;
  y: number;
  /** Radius of the head. */
  r: number;
  blooms: string[];
  seed?: number;
  /** Floret count; kept modest so a page with many heads stays light. */
  count?: number;
  leaves?: boolean;
}

export function Hydrangea({ x, y, r, blooms, seed = 3, count = 15, leaves = true }: HydrangeaProps) {
  const pts = clusterPoints(count, r, seed, blooms.length);
  return (
    <g transform={`translate(${x} ${y})`}>
      {leaves && (
        <>
          <Leaf x={-r * 0.2} y={r * 0.55} rotate={160} scale={r / 22} />
          <Leaf x={r * 0.2} y={r * 0.6} rotate={20} scale={r / 22} />
          <Leaf x={0} y={r * 0.7} rotate={90} scale={r / 26} color={LEAF_DEEP} />
        </>
      )}
      {pts.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.rotate}) scale(${p.r})`}>
          <path d={FLORET} fill={blooms[p.tint % blooms.length]} stroke="#ffffff" strokeOpacity=".55" strokeWidth={0.08} />
          <circle r=".16" fill="#ffffff" fillOpacity=".85" />
        </g>
      ))}
    </g>
  );
}

/** Baby's breath: a branching stem tipped with tiny white blossoms, in a 60x80 box. */
export function Sprig({ x, y, scale = 1, rotate = 0, stem = "#9db7d4" }: { x: number; y: number; scale?: number; rotate?: number; stem?: string }) {
  const tips: Array<[number, number]> = [
    [30, 6], [22, 10], [38, 11], [12, 22], [19, 25], [6, 31], [48, 22], [41, 26], [54, 32], [20, 44], [11, 49], [40, 46], [50, 52],
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g fill="none" stroke={stem} strokeWidth="1.1" strokeLinecap="round">
        <path d="M30 80C30 60 29 40 30 6" />
        <path d="M30 56C22 48 16 40 12 22M30 44C38 36 44 30 48 22M30 66C24 58 18 54 11 49M30 62C38 54 44 52 50 52M30 34C26 28 20 24 19 25M30 30C34 24 40 22 41 26" />
        <path d="M12 22C9 28 7 30 6 31M48 22C52 27 53 30 54 32M20 44C20 46 20 46 20 44M40 46C40 47 40 47 40 46" />
      </g>
      {tips.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={2.6} fill="#ffffff" />
          <circle cx={cx} cy={cy} r={0.9} fill="#e7eefa" />
        </g>
      ))}
    </g>
  );
}

/** Blue morpho-style butterfly (top view), 64x48, both wings flap via ft-wing-l / ft-wing-r. */
export function Morpho({ size = 48, flap = true, tilt = 0 }: { size?: number; flap?: boolean; tilt?: number }) {
  const g = useUid("mo");
  const upper = "M32 22C26 6 8 0 2 8C-2 16 8 26 24 28C14 30 10 36 14 42C20 48 30 40 32 30Z";
  const lower = "M32 30C28 40 22 46 28 47C30 47 32 44 32 36Z";
  return (
    <svg width={size} height={(size * 48) / 64} viewBox="0 0 64 48" aria-hidden focusable="false" style={{ overflow: "visible", transform: `rotate(${tilt}deg)` }}>
      <defs>
        <radialGradient id={g} cx="0.7" cy="0.55" r="0.9">
          <stop offset="0" stopColor={MORPHO_LIGHT} />
          <stop offset="0.55" stopColor="#2f6fd0" />
          <stop offset="1" stopColor={MORPHO_DEEP} />
        </radialGradient>
      </defs>
      {(["l", "r"] as const).map((side) => (
        <g key={side} transform={side === "r" ? "translate(64 0) scale(-1 1)" : undefined}>
         <g className={flap ? "ft-wing" : undefined}>
          <path d={upper} fill={`url(#${g})`} stroke="#0e2150" strokeWidth="1.4" strokeLinejoin="round" />
          <path d={lower} fill="#1f55b8" stroke="#0e2150" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M30 22C22 14 14 10 8 11M28 26C20 24 12 25 8 28" stroke="#bfe0ff" strokeOpacity=".55" strokeWidth=".8" fill="none" strokeLinecap="round" />
          {[[6, 9], [10, 5.5], [4, 14], [13, 38], [16, 42]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={1} fill="#ffffff" fillOpacity=".92" />
          ))}
         </g>
        </g>
      ))}
      <ellipse cx="32" cy="26" rx="1.7" ry="11" fill="#0e2150" />
      <path d="M32 15C30 9 27 6 24 5M32 15C34 9 37 6 40 5" stroke="#0e2150" strokeWidth=".9" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Sparkle({ x, y, size = 10, color = "#ffffff", delay = 0 }: { x: number; y: number; size?: number; color?: string; delay?: number }) {
  return (
    <path
      className="ft-twinkle"
      style={{ animationDelay: `${delay}s`, transformOrigin: `${x}px ${y}px` }}
      d={`M${x} ${y - size}C${x + 1} ${y - 1} ${x + 1} ${y - 1} ${x + size} ${y}C${x + 1} ${y + 1} ${x + 1} ${y + 1} ${x} ${y + size}C${x - 1} ${y + 1} ${x - 1} ${y + 1} ${x - size} ${y}C${x - 1} ${y - 1} ${x - 1} ${y - 1} ${x} ${y - size}Z`}
      fill={color}
    />
  );
}

export function Cloud({ width = 120, color = "#ffffff", opacity = 0.7 }: { width?: number; color?: string; opacity?: number }) {
  return (
    <svg width={width} height={(width * 40) / 120} viewBox="0 0 120 40" aria-hidden focusable="false" style={{ opacity }}>
      <path d="M14 34C4 34 2 22 12 20C12 8 28 6 34 14C38 4 56 2 62 12C70 6 86 10 86 20C98 16 108 26 100 34Z" fill={color} />
    </svg>
  );
}

/** A soft fan of light rays from the top centre of a 400x400 box. */
export function SunRays({ color = "#ffffff", opacity = 0.35 }: { color?: string; opacity?: number }) {
  const id = useUid("ray");
  const rays = [-62, -44, -28, -12, 4, 20, 36, 54];
  return (
    <svg viewBox="-200 0 400 400" preserveAspectRatio="xMidYMin slice" aria-hidden focusable="false" className="ft-rays" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={opacity} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {rays.map((a, i) => (
        <path key={a} transform={`rotate(${a})`} d={`M-${6 + (i % 3) * 4} 0H${6 + (i % 3) * 4}L${34 + (i % 4) * 10} 520H-${34 + (i % 4) * 10}Z`} fill={`url(#${id})`} />
      ))}
    </svg>
  );
}

export interface CastleProps {
  royal: string;
  sky: string;
  blooms: string[];
  /** Render the door as a lit, open archway (used at the end of the opening). */
  glow?: boolean;
}

/** A white fairytale palace with a domed portico, two conical towers and flower-box balconies, 300x340. */
export function Castle({ royal, sky, blooms, glow }: CastleProps) {
  const g = useUid("ca");
  const stone = "#ffffff";
  const shade = mixHex(sky, "#ffffff", 55);
  const line = mixHex(royal, "#ffffff", 55);
  const roof = mixHex(royal, "#ffffff", 20);
  const win = (x: number, y: number, w = 12, h = 22) => (
    <g key={`${x}-${y}`}>
      <path d={`M${x} ${y + h}V${y + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${y + h}Z`} fill={mixHex(royal, sky, 55)} stroke={line} strokeWidth="1" />
      <path d={`M${x + w / 2} ${y + 2}V${y + h}M${x} ${y + h * 0.6}H${x + w}`} stroke="#ffffff" strokeOpacity=".7" strokeWidth=".8" />
    </g>
  );
  const tower = (cx: number) => (
    <g key={cx}>
      <rect x={cx - 21} y={150} width={42} height={150} fill={`url(#${g}s)`} stroke={line} strokeWidth="1.2" />
      <path d={`M${cx - 27} 152L${cx} 92L${cx + 27} 152Z`} fill={roof} stroke={line} strokeWidth="1.2" strokeLinejoin="round" />
      <path d={`M${cx} 92V70`} stroke={line} strokeWidth="1.4" />
      <path d={`M${cx} 70L${cx + 17} 76L${cx} 82Z`} fill={PINK_DEEP} />
      <path d={`M${cx - 21} 154H${cx + 21}M${cx - 21} 232H${cx + 21}`} stroke={line} strokeWidth="1" />
      {win(cx - 6, 168)}
      {win(cx - 6, 246, 12, 26)}
      <rect x={cx - 17} y={226} width={34} height={6} rx="2" fill="#ffffff" stroke={line} strokeWidth=".9" />
      {[-12, -4, 4, 12].map((dx, i) => (
        <circle key={dx} cx={cx + dx} cy={223} r={3.2} fill={blooms[(i + 1) % blooms.length]} />
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 300 340" width="100%" height="100%" aria-hidden focusable="false" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`${g}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={shade} />
          <stop offset="0.45" stopColor={stone} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
        <radialGradient id={`${g}d`} cx="0.5" cy="0.7" r="0.7">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="1" stopColor={mixHex(royal, sky, 60)} />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="318" rx="146" ry="14" fill={mixHex(royal, sky, 25)} opacity=".18" />
      {/* wings and towers */}
      <rect x="26" y="200" width="56" height="100" fill={`url(#${g}s)`} stroke={line} strokeWidth="1.2" />
      <rect x="218" y="200" width="56" height="100" fill={`url(#${g}s)`} stroke={line} strokeWidth="1.2" />
      {tower(52)}
      {tower(248)}
      {/* main body */}
      <rect x="76" y="160" width="148" height="140" fill={`url(#${g}s)`} stroke={line} strokeWidth="1.2" />
      {/* dome */}
      <path d="M112 134C112 96 188 96 188 134Z" fill={roof} stroke={line} strokeWidth="1.2" />
      <path d="M124 130C124 106 176 106 176 130M136 128C136 112 164 112 164 128" stroke="#ffffff" strokeOpacity=".6" strokeWidth="1" fill="none" />
      <rect x="144" y="84" width="12" height="16" rx="3" fill="#ffffff" stroke={line} strokeWidth="1" />
      <path d="M150 84V58" stroke={line} strokeWidth="1.5" />
      <path d="M150 58L172 65L150 72Z" fill={PINK} stroke={PINK_DEEP} strokeWidth=".8" />
      {/* pediment and columns */}
      <path d="M94 160L150 124L206 160Z" fill="#ffffff" stroke={line} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="150" cy="148" r="6" fill={mixHex(royal, sky, 55)} stroke={line} strokeWidth="1" />
      {[100, 126, 166, 192].map((x) => (
        <g key={x}>
          <rect x={x} y="160" width="8" height="112" fill="#ffffff" stroke={line} strokeWidth=".9" />
          <path d={`M${x - 2} 160H${x + 10}M${x - 2} 272H${x + 10}`} stroke={line} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
      {/* doors */}
      <path d="M130 300V236C130 204 170 204 170 236V300Z" fill={glow ? `url(#${g}d)` : mixHex(royal, "#ffffff", 70)} stroke={line} strokeWidth="1.4" />
      <path d="M150 210V300M134 250H166" stroke="#ffffff" strokeOpacity=".7" strokeWidth="1" />
      <circle cx="145" cy="262" r="1.6" fill="#ffffff" />
      <circle cx="155" cy="262" r="1.6" fill="#ffffff" />
      {win(44, 214, 12, 28)}
      {win(244, 214, 12, 28)}
      {/* steps */}
      <rect x="112" y="300" width="76" height="6" fill="#ffffff" stroke={line} strokeWidth=".9" />
      <rect x="104" y="306" width="92" height="7" fill="#ffffff" stroke={line} strokeWidth=".9" />
      <rect x="94" y="313" width="112" height="8" fill="#ffffff" stroke={line} strokeWidth=".9" />
      {/* garden */}
      <Hydrangea x={22} y={304} r={20} blooms={blooms} seed={11} count={12} />
      <Hydrangea x={278} y={304} r={20} blooms={blooms} seed={23} count={12} />
      <Hydrangea x={72} y={312} r={14} blooms={blooms} seed={5} count={9} />
      <Hydrangea x={228} y={312} r={14} blooms={blooms} seed={17} count={9} />
      <Sparkle x={150} y={40} size={9} delay={0.2} />
      <Sparkle x={70} y={110} size={6} delay={1.1} />
      <Sparkle x={236} y={104} size={7} delay={0.7} />
    </svg>
  );
}

export function Rose({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden focusable="false">
      <Leaf x={20} y={30} rotate={150} scale={0.7} />
      <Leaf x={20} y={30} rotate={30} scale={0.7} />
      <circle cx="20" cy="19" r="14" fill={PINK} />
      <path d="M20 19C20 15 25 14 26 18C27 23 20 25 16 22C12 19 14 12 20 11C27 10 32 16 30 22" fill="none" stroke={PINK_DEEP} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 14C15 8 24 7 29 12" fill="none" stroke="#ffffff" strokeOpacity=".7" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function Daisy({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden focusable="false">
      {Array.from({ length: 10 }, (_, i) => (
        <ellipse key={i} cx="20" cy="9" rx="3.6" ry="8" fill="#ffffff" stroke="#c9d7ea" strokeWidth=".7" transform={`rotate(${i * 36} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="5" fill="#f6d77a" />
      <circle cx="18.6" cy="18.6" r="1.6" fill="#fff3bf" />
    </svg>
  );
}

export function HydrangeaSticker({ size = 46, blooms }: { size?: number; blooms: string[] }) {
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48" aria-hidden focusable="false">
      <Hydrangea x={0} y={0} r={19} blooms={blooms} seed={41} count={13} />
    </svg>
  );
}

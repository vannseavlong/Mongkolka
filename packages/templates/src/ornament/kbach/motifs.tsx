import { useId, type CSSProperties } from "react";
import { cornerFlames, FLAME_PATH, petalPath } from "./geometry";

const useSvgId = (prefix: string) => `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

export interface MotifProps {
  color: string;
  className?: string;
  style?: CSSProperties;
}

/** Four petals around a bud, centred on (x, y). */
function Quatrefoil({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 90, 180, 270].map((turn) => (
        <path key={turn} d={petalPath(0, -size * 0.18, size * 0.62, size * 0.82)} transform={`rotate(${turn})`} />
      ))}
      <circle r={size * 0.16} />
    </g>
  );
}

/** A diamond weave with a four-petal flower in every cell, in the manner of carved and woven grounds. */
export function DiamondWeave({ color, className, style, tile = 56 }: MotifProps & { tile?: number }) {
  const id = useSvgId("kbw");
  return (
    <svg aria-hidden focusable="false" className={className} style={style} width="100%" height="100%">
      <defs>
        <pattern id={id} width={tile} height={tile} patternUnits="userSpaceOnUse">
          <g transform={`scale(${tile / 56})`} fill={color}>
            <path d="M28 0L56 28L28 56L0 28Z" fill="none" stroke={color} strokeWidth="1" />
            <path d="M28 7L49 28L28 49L7 28Z" fill="none" stroke={color} strokeWidth="0.6" strokeDasharray="1.5 3" />
            <Quatrefoil x={28} y={28} size={17} />
            {[[0, 0], [56, 0], [0, 56], [56, 56]].map(([x, y]) => (
              <Quatrefoil key={`${x}-${y}`} x={x!} y={y!} size={11} />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Outlined lotus blooms in offset rows. */
export function LotusLattice({ color, className, style }: MotifProps) {
  const id = useSvgId("kbl");
  const bloom = (x: number, y: number) => (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
      <path d={petalPath(0, 10, 13, 24)} />
      {[-42, 42].map((turn) => (
        <path key={turn} d={petalPath(0, 10, 11, 19)} transform={`rotate(${turn} 0 10)`} />
      ))}
      <path d="M-14 13Q0 20 14 13" />
    </g>
  );
  return (
    <svg aria-hidden focusable="false" className={className} style={style} width="100%" height="100%">
      <defs>
        <pattern id={id} width="72" height="80" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={color} strokeWidth="1">
            {bloom(36, 20)}
            {bloom(0, 60)}
            {bloom(72, 60)}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Scattered blossoms and loose petals, still (the page already has its own moving petals). */
export function BlossomScatter({ color, className, style }: MotifProps) {
  const id = useSvgId("kbs");
  const blossom = (x: number, y: number, size: number, turn: number) => (
    <g transform={`translate(${x} ${y}) rotate(${turn})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <path key={angle} d={petalPath(0, -2, size * 0.8, size)} transform={`rotate(${angle})`} />
      ))}
    </g>
  );
  const petal = (x: number, y: number, turn: number) => <path d={petalPath(0, 0, 6, 11)} transform={`translate(${x} ${y}) rotate(${turn})`} />;
  return (
    <svg aria-hidden focusable="false" className={className} style={style} width="100%" height="100%">
      <defs>
        <pattern id={id} width="168" height="176" patternUnits="userSpaceOnUse">
          <g fill={color}>
            {blossom(34, 34, 13, 8)}
            {blossom(122, 108, 9, 40)}
            {blossom(66, 142, 6, 20)}
            {petal(98, 42, 55)}
            {petal(24, 104, -35)}
            {petal(146, 22, 130)}
            {petal(130, 162, -70)}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** A border of lotus petals between two hairlines; `flip` hangs the petals from the top edge. */
export function LotusBand({ color, className, style, flip = false }: MotifProps & { flip?: boolean }) {
  const id = useSvgId("kbb");
  return (
    <svg aria-hidden focusable="false" className={className} style={{ display: "block", transform: flip ? "scaleY(-1)" : undefined, ...style }} width="100%" height="28">
      <defs>
        <pattern id={id} width="30" height="28" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={color} strokeWidth="1">
            <path d={petalPath(15, 23, 24, 20)} />
            <path d={petalPath(15, 23, 13, 13)} />
            <path d={petalPath(0, 23, 9, 11)} />
            <path d={petalPath(30, 23, 9, 11)} />
            <circle cx="15" cy="19" r="1.4" />
            <path d="M0 24.5H30M0 27.5H30" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="28" fill={`url(#${id})`} />
    </svg>
  );
}

/** Flame leaves running out from a corner (top-left as drawn; rotate or mirror it for the others). */
export function FlameCorner({ color, className, style }: MotifProps) {
  const arm = (
    <g>
      {cornerFlames().map((p) => (
        <path key={p.x} d={FLAME_PATH} transform={`translate(${p.x} ${p.y}) rotate(${p.turn}) scale(${p.scale})`} />
      ))}
      <path d="M8 6H214" fill="none" stroke={color} strokeWidth="2" />
      <path d="M8 11H170" fill="none" stroke={color} strokeWidth="0.8" />
    </g>
  );
  return (
    <svg aria-hidden focusable="false" className={className} style={style} viewBox="0 0 220 220" fill={color}>
      {arm}
      <g transform="matrix(0 1 1 0 0 0)">{arm}</g>
      <path d={FLAME_PATH} transform="translate(22 22) rotate(135) scale(1.5)" />
    </svg>
  );
}

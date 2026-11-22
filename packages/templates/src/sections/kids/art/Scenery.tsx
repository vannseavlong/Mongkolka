import type { CSSProperties } from "react";
import { buntingFlags } from "../kids-logic-art";

/** Original small scenery pieces for the kids skin: stars, clouds, balloons, bunting, hearts. All aria-hidden SVG. */

export function Sparkle({ color, size = 20, className, style }: { color: string; size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false" className={className} style={style}>
      <path d="M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z" fill={color} />
    </svg>
  );
}

/** A chubby five-point star with rounded corners. */
export function Star({ color, size = 24, className, style }: { color: string; size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false" className={className} style={style}>
      <path
        d="M12 3.2 14.6 9l6.2.6-4.7 4.2 1.4 6.1L12 16.7 6.5 19.9l1.4-6.1L3.2 9.6 9.4 9Z"
        fill={color}
        stroke={color}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Heart({ color, size = 18, className, style }: { color: string; size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false" className={className} style={style}>
      <path d="M12 21C4 15 2 11 2 7.8A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 10 1.8C22 11 20 15 12 21Z" fill={color} />
    </svg>
  );
}

export function Cloud({ fill = "#fff", shade, width = 160, className, style }: { fill?: string; shade?: string; width?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg width={width} height={width / 2} viewBox="0 0 160 80" aria-hidden focusable="false" className={className} style={style}>
      <g fill={shade ?? fill} transform="translate(0 4)">
        <circle cx="40" cy="50" r="22" />
        <circle cx="72" cy="38" r="28" />
        <circle cx="108" cy="46" r="24" />
        <circle cx="132" cy="56" r="17" />
        <rect x="22" y="52" width="124" height="22" rx="11" />
      </g>
      <g fill={fill}>
        <circle cx="40" cy="50" r="22" />
        <circle cx="72" cy="38" r="28" />
        <circle cx="108" cy="46" r="24" />
        <circle cx="132" cy="56" r="17" />
        <rect x="22" y="52" width="124" height="20" rx="10" />
      </g>
    </svg>
  );
}

export function Balloon({ color, size = 46, className, style }: { color: string; size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size * 1.7} viewBox="0 0 40 68" aria-hidden focusable="false" className={className} style={style}>
      <path d="M20 46C20 54 16 58 18 66" fill="none" stroke="rgba(120,80,100,.45)" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="20" cy="20" rx="16" ry="19" fill={color} />
      <path d="M16 38 20 46 24 38Z" fill={color} />
      <ellipse cx="14" cy="12" rx="4" ry="6.5" fill="#fff" opacity=".45" transform="rotate(-18 14 12)" />
    </svg>
  );
}

/** A sagging string of triangular flags; width follows the container, flag positions come from pure maths. */
export function Bunting({ colors, className, style }: { colors: readonly string[]; className?: string; style?: CSSProperties }) {
  const flags = buntingFlags(9, 400, 26);
  return (
    <svg viewBox="0 0 400 70" width="100%" aria-hidden focusable="false" className={className} style={style} preserveAspectRatio="xMidYMin meet">
      <path d="M0 2Q200 54 400 2" fill="none" stroke="rgba(150,90,120,.55)" strokeWidth="1.6" />
      {flags.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`}>
          <path d="M-13 0H13L0 28Z" fill={colors[i % colors.length]} />
          <path d="M-13 0H13" stroke="rgba(255,255,255,.55)" strokeWidth="1.4" />
          <circle cx="0" cy="9" r="2.2" fill="rgba(255,255,255,.7)" />
        </g>
      ))}
    </svg>
  );
}

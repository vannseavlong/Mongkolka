"use client";

import { useId } from "react";
import { MOUL_FONT } from "../../chrome/fonts";
import { goldStops, withAlpha } from "../../chrome/gold";
import { FLAME_PATH, petalPath } from "../../ornament/kbach/geometry";
import type { CrestProps } from "../khmer/skin-ornament-types";
import { hasKhmer } from "./intro-logic";
import { PINK } from "./palette";

const SCRIPT = 'var(--font-script), "Great Vibes", cursive';
const around = (count: number) => Array.from({ length: count }, (_, i) => (360 / count) * i);

/** A flame leaf and its mirror image, leaning away from each other from `y` above the centre. */
function FlamePair({ y, gap, scale, lean }: { y: number; gap: number; scale: number; lean: number }) {
  return (
    <>
      {[1, -1].map((side) => (
        <g key={side} transform={`scale(${side} 1)`}>
          <path d={FLAME_PATH} transform={`translate(${gap} ${y}) rotate(${lean}) scale(${scale})`} />
        </g>
      ))}
    </>
  );
}

/**
 * The monogram medallion in Khmer kbach: a lotus-petal ring round a beaded disc, crowned and flanked by flame leaves
 * (phni phleung). Floral and geometric motifs only. Drawn around (0, 0); colours follow the theme's accent.
 */
export function KbachCrest({ color, ground, label, size = 104 }: CrestProps) {
  const id = `cvk${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const { hi, mid, lo } = goldStops(color);
  const gold = `url(#${id})`;
  const khmer = hasKhmer(label);
  const long = Array.from(label).length > 5;
  return (
    <svg width={size * 1.3} height={size * 1.3} viewBox="-80 -80 160 160" role="img" aria-label={label} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="-70" y1="-70" x2="70" y2="70">
          <stop offset="0" stopColor={hi} />
          <stop offset="0.45" stopColor={mid} />
          <stop offset="1" stopColor={lo} />
        </linearGradient>
      </defs>

      <g fill={gold}>
        {/* Crown: a tall middle petal between two tiers of flames. */}
        <path d={petalPath(0, -52, 11, 24)} />
        <FlamePair y={-52} gap={6} scale={0.46} lean={14} />
        <FlamePair y={-47} gap={19} scale={0.32} lean={42} />
        {/* Sides and foot: flames sweeping round the ring. */}
        {[90, -90].map((turn) => (
          <g key={turn} transform={`rotate(${turn})`}>
            <path d={petalPath(0, -53, 8, 15)} />
            <FlamePair y={-51} gap={5} scale={0.3} lean={52} />
          </g>
        ))}
        <g transform="rotate(180)">
          <path d={petalPath(0, -53, 9, 18)} />
          <FlamePair y={-51} gap={6} scale={0.36} lean={46} />
        </g>
        {/* Lotus ring. */}
        {around(28).map((turn) => (
          <path key={turn} d={petalPath(0, -44, 9.5, 11)} transform={`rotate(${turn})`} opacity="0.92" />
        ))}
      </g>

      <circle r="45" fill={ground} stroke={gold} strokeWidth="2" />
      <circle r="38" fill={withAlpha(PINK.blush, 0.55)} stroke={gold} strokeWidth="0.8" />
      {around(40).map((turn) => (
        <circle key={turn} cy="-41.5" r="1.1" fill={gold} transform={`rotate(${turn})`} />
      ))}
      {[0, 180].map((turn) => (
        <path key={turn} d={petalPath(0, -27, 5, 8)} fill={gold} transform={`rotate(${turn})`} />
      ))}

      <text y={khmer ? 8 : 9} textAnchor="middle" fontSize={long ? 15 : khmer ? 22 : 29} fill={lo} style={{ fontFamily: khmer ? MOUL_FONT : SCRIPT }}>
        {/* The "&" between initials keeps the flowing script, even beside Khmer letters. */}
        {label.split("&").map((part, i) => (
          <tspan key={i}>
            {i > 0 && <tspan style={{ fontFamily: SCRIPT }}>&amp;</tspan>}
            {part}
          </tspan>
        ))}
      </text>
    </svg>
  );
}

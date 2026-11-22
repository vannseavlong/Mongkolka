import { useId } from "react";
import type { OrnamentProps } from "../../khmer/skin-ornament-types";
import { Art } from "../art/Botanicals";
import { BUD, LEAF, ROSE } from "../art/botanical-data";
import { lightPalette } from "./light-palette";

/**
 * Original rose-spray corner (top-left): a gold double rule that turns the corner, with a full rose, a
 * smaller rose, a bud and leaves clustered on it. The frame mirrors it into the other three corners,
 * so the roses overlap the card edge like a garland.
 */
export function GardenCorner({ color, size = 64 }: OrnamentProps) {
  const p = lightPalette(color);
  const g = `gc${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const s = size / 80;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.gold.hi} />
          <stop offset="0.5" stopColor={p.gold.mid} />
          <stop offset="1" stopColor={p.gold.lo} />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${g})`} strokeLinecap="round">
        <path d="M2 74V22Q2 2 22 2H74" strokeWidth="1.5" />
        <path d="M8 62V26Q8 8 26 8H62" strokeWidth="0.8" opacity="0.6" />
      </g>
      <g transform="translate(-2 -2)">
        <g transform="translate(34 12) rotate(20)">
          <Art def={LEAF} palette={p} width={30 * s * 1.25} />
        </g>
        <g transform="translate(12 36) rotate(70)">
          <Art def={LEAF} palette={p} width={26 * s * 1.25} />
        </g>
        <g transform="translate(46 2) rotate(75)">
          <Art def={BUD} palette={p} width={13 * s * 1.25} />
        </g>
        <g transform="translate(6 46) rotate(-10)">
          <Art def={BUD} palette={p} width={13 * s * 1.25} />
        </g>
        <g transform="translate(22 22)">
          <Art def={ROSE} palette={p} width={36 * s * 1.25} />
        </g>
        <g transform="translate(-2 -2) rotate(-14)">
          <Art def={ROSE} palette={p} width={28 * s * 1.25} />
        </g>
      </g>
    </svg>
  );
}

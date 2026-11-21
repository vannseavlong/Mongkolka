import { useId } from "react";
import { goldStops } from "../../../chrome/gold";
import type { OrnamentProps } from "../skin-ornament-types";

export function useSvgId(prefix: string): string {
  return `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}

export function GoldGradientDef({ id, color }: { id: string; color: string }) {
  const { hi, mid, lo } = goldStops(color);
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={hi} />
      <stop offset="0.5" stopColor={mid} />
      <stop offset="1" stopColor={lo} />
    </linearGradient>
  );
}

/**
 * Original kbach-inspired corner (top-left): a double rule that turns the corner, a flame-leaf
 * (kanok) along the diagonal with a hollow core, two small scrolls and a corner jewel. Drawn from
 * scratch; not traced from any reference.
 */
export function KbachCorner({ color, size = 64 }: OrnamentProps) {
  const g = useSvgId("kc");
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <GoldGradientDef id={g} color={color} />
      </defs>
      <g fill="none" stroke={`url(#${g})`} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 76V17Q3 3 17 3H76" strokeWidth="1.7" />
        <path d="M9 60V23Q9 9 23 9H60" strokeWidth="0.9" opacity="0.65" />
        <path d="M18 18C18 29 24 35 36 37C34 25 28 18 18 18Z" strokeWidth="0.9" opacity="0.8" />
        <path d="M47 14c7 0 11 4 10 10" strokeWidth="1.1" />
        <path d="M14 47c0 7 4 11 10 10" strokeWidth="1.1" />
        <path d="M60 3.5c3 2 4 5 2 8" strokeWidth="0.9" opacity="0.7" />
        <path d="M3.5 60c2 3 5 4 8 2" strokeWidth="0.9" opacity="0.7" />
      </g>
      <path d="M12 12C12 30 22 40 46 46C40 22 30 12 12 12Z" fill={`url(#${g})`} opacity="0.92" />
      <circle cx="3" cy="3" r="3" fill={`url(#${g})`} />
      <path d="M3 80 0 74.5 3 69 6 74.5ZM80 3 74.5 0 69 3 74.5 6Z" fill={`url(#${g})`} />
      <circle cx="66" cy="9" r="1.3" fill={`url(#${g})`} />
      <circle cx="9" cy="66" r="1.3" fill={`url(#${g})`} />
    </svg>
  );
}

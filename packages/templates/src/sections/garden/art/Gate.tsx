import { useId } from "react";
import { archRailPath, finialPath, gateBars, scrollPath, LEAF_H, LEAF_W, RAIL_LOW, RAIL_MID } from "./gate-geometry";
import type { GardenPalette } from "../palette";
import { mixHex } from "../../../chrome/gold";

/**
 * One leaf of an original wrought-iron garden gate in gold: spear-topped bars under a rising arch
 * rail, two cross rails, a row of C-scrolls and a half rosette on the meeting edge (the two leaves
 * form the whole rosette when shut). The right leaf is this same SVG mirrored by CSS.
 */
export function GateLeaf({ palette, className, style }: { palette: GardenPalette; className?: string; style?: React.CSSProperties }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = `gg${uid}`;
  const bars = gateBars(7);
  // decorative champagne-gold foil: brighter than the (text-safe) accent so the iron reads as gold
  const hi = mixHex(palette.accent, "#fff1c4", 25);
  const mid = mixHex(palette.accent, "#d9b66a", 30);
  const lo = mixHex(palette.accent, "#7a5a1e", 55);
  const railY1 = RAIL_MID;
  const railY2 = RAIL_LOW;
  return (
    <svg viewBox={`0 0 ${LEAF_W} ${LEAF_H}`} preserveAspectRatio="none" aria-hidden focusable="false" className={className} style={{ display: "block", ...style }}>
      <defs>
        <linearGradient id={g} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={LEAF_W} y2={LEAF_H}>
          <stop offset="0" stopColor={hi} />
          <stop offset="0.5" stopColor={mid} />
          <stop offset="1" stopColor={lo} />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${g})`} strokeLinecap="round" strokeLinejoin="round">
        <path d={archRailPath()} strokeWidth="5" />
        <path d={`${archRailPath()}`} strokeWidth="1.2" stroke={hi} opacity="0.7" transform="translate(0 4)" />
        <path d={`M3 ${bars[0]!.top + 4}V${LEAF_H - 8}`} strokeWidth="7" />
        <path d={`M${LEAF_W - 2} ${bars[6]!.top - 10}V${LEAF_H - 8}`} strokeWidth="4" />
        <path d={`M3 ${railY1}H${LEAF_W}`} strokeWidth="4" />
        <path d={`M3 ${railY2}H${LEAF_W}`} strokeWidth="5" />
        <path d={`M3 ${LEAF_H - 10}H${LEAF_W}`} strokeWidth="6" />
        {bars.map((b) => (
          <path key={b.x} d={`M${b.x} ${b.top}V${b.bottom}`} strokeWidth="3.2" />
        ))}
        {bars.slice(0, -1).map((b, i) => {
          const next = bars[i + 1]!;
          const cx = (b.x + next.x) / 2;
          return (
            <g key={`s${i}`} strokeWidth="1.4">
              <path d={scrollPath(cx - 0.8, 412, 10, 1)} />
              <path d={scrollPath(cx + 0.8, 412, 10, -1)} />
              <path d={scrollPath(cx - 0.8, 540, 10, -1)} transform={`rotate(180 ${cx} 540)`} />
              <path d={scrollPath(cx + 0.8, 540, 10, 1)} transform={`rotate(180 ${cx} 540)`} />
            </g>
          );
        })}
        <path d={`M${LEAF_W} 300a30 30 0 0 0 0 60`} strokeWidth="3" />
        <path d={`M${LEAF_W} 312a18 18 0 0 0 0 36`} strokeWidth="1.4" />
      </g>
      <g fill={`url(#${g})`}>
        {bars.map((b) => (
          <path key={`f${b.x}`} d={finialPath(b.x, b.top - 1, b.finial)} />
        ))}
        {bars.map((b) => (
          <circle key={`c${b.x}`} cx={b.x} cy={railY1} r="4" />
        ))}
        <path d={`M${LEAF_W} 320a10 10 0 0 0 0 20z`} />
        <circle cx="3" cy={railY2} r="5.5" />
      </g>
    </svg>
  );
}

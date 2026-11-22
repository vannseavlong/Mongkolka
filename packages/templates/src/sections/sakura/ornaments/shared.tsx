import { useId } from "react";
import { PETAL_PATH } from "../art/parts";
import { SAKURA_GOLD } from "../palette";

/** Unique, SVG-id-safe prefix per instance (several ornaments can share a page). */
export function useSvgId(prefix: string): string {
  return `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}

/** Fixed gold foil gradient for linework; the skin's gold does not follow the accent. */
export function FoilDef({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={SAKURA_GOLD.hi} />
      <stop offset="0.45" stopColor={SAKURA_GOLD.mid} />
      <stop offset="1" stopColor={SAKURA_GOLD.lo} />
    </linearGradient>
  );
}

/** A small five-petal blossom mark filled with `fill` and edged by `edge`. */
export function BlossomMark({ x, y, r, rot = 0, fill, edge }: { x: number; y: number; r: number; rot?: number; fill: string; edge: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`} fill={fill} stroke={edge} strokeWidth={0.05}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d={PETAL_PATH} transform={`rotate(${a})`} />
      ))}
      <circle r={0.16} fill={SAKURA_GOLD.mid} stroke="none" />
    </g>
  );
}

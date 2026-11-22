import type { CSSProperties } from "react";
import type { GardenPalette } from "../palette";
import { BUD, DOVE, LEAF, LILY, ROSE, renderShapeAttrs, type ArtDef } from "./botanical-data";

/** Renders one piece of garden artwork (rose, bud, leaf, lily sprig, dove) as an inline SVG. Decorative: always aria-hidden. */
export function Art({
  def,
  palette,
  width,
  style,
  className,
}: {
  def: ArtDef;
  palette: GardenPalette;
  width: number;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <svg
      viewBox={def.viewBox}
      width={width}
      height={(width * def.h) / def.w}
      aria-hidden
      focusable="false"
      className={className}
      style={{ display: "block", overflow: "visible", ...style }}
    >
      {def.shapes.map((s, i) => (
        <path key={i} {...renderShapeAttrs(s, palette)} />
      ))}
    </svg>
  );
}

export const Rose = (p: { palette: GardenPalette; width: number; style?: CSSProperties; className?: string }) => <Art def={ROSE} {...p} />;
export const Bud = (p: { palette: GardenPalette; width: number; style?: CSSProperties; className?: string }) => <Art def={BUD} {...p} />;
export const Leaf = (p: { palette: GardenPalette; width: number; style?: CSSProperties; className?: string }) => <Art def={LEAF} {...p} />;
export const Lily = (p: { palette: GardenPalette; width: number; style?: CSSProperties; className?: string }) => <Art def={LILY} {...p} />;
export const Dove = (p: { palette: GardenPalette; width: number; style?: CSSProperties; className?: string }) => <Art def={DOVE} {...p} />;

interface Placed {
  def: ArtDef;
  x: number;
  y: number;
  w: number;
  rot?: number;
  flip?: boolean;
}

const at = (def: ArtDef, x: number, y: number, w: number, rot = 0, flip = false): Placed => ({ def, x, y, w, rot, flip });

/**
 * A climbing rose vine laid out in a 200 x 200 box, growing from the bottom-left corner up and
 * across: a curving stem, leaves, buds and roses of different sizes. Used as the corner garland of
 * the hero and the court, and as the garland that drapes over the arch frame.
 */
const VINE_ITEMS: Placed[] = [
  at(LEAF, 20, 150, 34, -60),
  at(LEAF, 38, 118, 36, -35),
  at(LEAF, 66, 96, 34, -15, true),
  at(LEAF, 100, 74, 36, -30),
  at(LEAF, 140, 52, 34, -10, true),
  at(BUD, 80, 120, 16, 25),
  at(BUD, 150, 78, 15, 60),
  at(ROSE, 18, 128, 44, -10),
  at(ROSE, 56, 84, 36, 12),
  at(ROSE, 110, 52, 40, -6),
  at(ROSE, 160, 26, 30, 8),
];

export function RoseVine({ palette, width, style, className }: { palette: GardenPalette; width: number; style?: CSSProperties; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" width={width} height={width} aria-hidden focusable="false" className={className} style={{ display: "block", overflow: "visible", ...style }}>
      <path d="M6 198C10 150 26 110 60 84C96 58 140 50 196 14" fill="none" stroke={palette.sageDeep} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 198C14 160 34 128 60 104C86 82 120 68 150 62" fill="none" stroke={palette.sage} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      {VINE_ITEMS.map((it, i) => {
        const h = (it.w * it.def.h) / it.def.w;
        const sx = it.flip ? -1 : 1;
        return (
          <g key={i} transform={`translate(${it.x} ${it.y}) rotate(${it.rot ?? 0}) scale(${sx} 1) translate(${-it.w / 2} ${-h / 2})`}>
            <Art def={it.def} palette={palette} width={it.w} />
          </g>
        );
      })}
    </svg>
  );
}

/** Same vine as an SVG fragment string (CSS background use). */
export function vineItems(): Placed[] {
  return VINE_ITEMS;
}

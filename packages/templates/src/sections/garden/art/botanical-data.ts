import { gardenPalette, tone, type ColorToken, type GardenPalette } from "../palette";
import type { Theme } from "../../../types";

/**
 * Original botanical artwork for the Royal Garden skin, drawn from scratch as plain data so that the
 * same shapes feed both React components (opening, hero) and the tiny SVG strings used as CSS
 * backgrounds. Nothing here is traced from any reference.
 */
export interface Shape {
  d: string;
  fill?: ColorToken | "none" | (string & {});
  stroke?: ColorToken | (string & {});
  sw?: number;
  op?: number;
}

export interface ArtDef {
  viewBox: string;
  w: number;
  h: number;
  shapes: Shape[];
}

/** A full-blown garden rose, 40 x 40. */
export const ROSE: ArtDef = {
  viewBox: "0 0 40 40",
  w: 40,
  h: 40,
  shapes: [
    { d: "M20 3C29 3 37 10 37 20C37 30 29 37 20 37C11 37 3 30 3 20C3 10 11 3 20 3Z", fill: "roseDeep", op: 0.92 },
    { d: "M9 13C5 22 10 32 20 35C12 29 11 20 15 11Z", fill: "rose" },
    { d: "M31 13C35 22 30 32 20 35C28 29 29 20 25 11Z", fill: "rose" },
    { d: "M11 17C11 8 29 8 29 17C29 27 23 32 20 32C17 32 11 27 11 17Z", fill: "roseLight" },
    { d: "M15 18C15 12 25 12 25 18C25 24 22 27 20 27C18 27 15 24 15 18Z", fill: "rose" },
    { d: "M17 19C17 15.5 23 15.5 23 19C23 22 21.5 23.5 20 23.5C18.5 23.5 17 22 17 19Z", fill: "roseDeep" },
    { d: "M12 15C14 10 20 9 24 10", fill: "none", stroke: "white", sw: 0.9, op: 0.6 },
    { d: "M15 21C17 25 22 25 25 21", fill: "none", stroke: "roseDeep", sw: 0.8, op: 0.7 },
  ],
};

/** A closed rose bud on a short stem, 20 x 34. */
export const BUD: ArtDef = {
  viewBox: "0 0 20 34",
  w: 20,
  h: 34,
  shapes: [
    { d: "M10 32C10 26 10 22 10 18", fill: "none", stroke: "sageDeep", sw: 1.3 },
    { d: "M10 2C16 6 17 14 10 20C3 14 4 6 10 2Z", fill: "rose" },
    { d: "M10 4C13 8 13 13 10 17C7 13 7 8 10 4Z", fill: "roseLight", op: 0.8 },
    { d: "M10 20C5 19 3 16 2 13C6 15 9 17 10 20ZM10 20C15 19 17 16 18 13C14 15 11 17 10 20Z", fill: "sage" },
  ],
};

/** A lance leaf, 30 x 14, pointing right. */
export const LEAF: ArtDef = {
  viewBox: "0 0 30 14",
  w: 30,
  h: 14,
  shapes: [
    { d: "M1 7C8 -1 22 -1 29 7C22 15 8 15 1 7Z", fill: "sage" },
    { d: "M2 7H27", fill: "none", stroke: "sageDeep", sw: 0.7, op: 0.7 },
  ],
};

/** One lily-of-the-valley bell, centred on its top, 10 x 12. */
const BELL = "M-4.4 0C-4.4 -4 4.4 -4 4.4 0C4.4 3 5.2 5 3.2 6.2C2.3 5.2 1.2 6.4 0 6.1C-1.2 6.4 -2.3 5.2 -3.2 6.2C-5.2 5 -4.4 3 -4.4 0Z";

function bellAt(x: number, y: number, rot: number): Shape[] {
  return [
    { d: `M${x.toFixed(1)} ${(y - 5).toFixed(1)}L${x.toFixed(1)} ${y.toFixed(1)}`, fill: "none", stroke: "sageDeep", sw: 0.7 },
    // the bell is a translated + rotated copy of BELL, baked into absolute coordinates by `placePath`
    { d: placePath(BELL, x, y, rot), fill: "white", stroke: "stone", sw: 0.45 },
  ];
}

/** Rotates then translates the relative path `BELL` into absolute coordinates (only M C L Z, absolute pairs). */
function placePath(d: string, tx: number, ty: number, deg: number): string {
  const a = (deg * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const pt = (x: number, y: number) => `${(x * cos - y * sin + tx).toFixed(2)} ${(x * sin + y * cos + ty).toFixed(2)}`;
  return d.replace(/([MLC])([^MLCZ]*)/g, (_m, cmd: string, rest: string) => {
    const nums = rest.trim().split(/[\s,]+/).map(Number);
    const pairs: string[] = [];
    for (let i = 0; i < nums.length; i += 2) pairs.push(pt(nums[i]!, nums[i + 1]!));
    return `${cmd}${pairs.join(" ")}`;
  }) + "Z";
}

/** An arching lily-of-the-valley sprig with two broad leaves, 60 x 84. */
export const LILY: ArtDef = {
  viewBox: "0 0 60 84",
  w: 60,
  h: 84,
  shapes: [
    { d: "M14 82C4 64 6 40 20 28C24 46 22 66 14 82Z", fill: "sage" },
    { d: "M14 82C26 66 28 44 18 24C10 40 8 62 14 82Z", fill: "sageDeep", op: 0.8 },
    { d: "M14 82C18 54 28 28 50 10", fill: "none", stroke: "sageDeep", sw: 1.5 },
    ...bellAt(46, 22, 8),
    ...bellAt(40, 30, 4),
    ...bellAt(34, 40, -2),
    ...bellAt(29, 51, -8),
    ...bellAt(24, 63, -14),
  ],
};

/** A dove in flight facing right, one wing raised, 64 x 40. */
export const DOVE: ArtDef = {
  viewBox: "0 0 64 40",
  w: 64,
  h: 40,
  shapes: [
    { d: "M34 27C35 17 41 9 52 5C50 13 48 19 47 25Z", fill: "stoneLight", op: 0.85 },
    { d: "M13 27C8 27 3 29 0 34C6 36 12 34 17 32Z", fill: "white", stroke: "stone", sw: 0.6 },
    { d: "M10 28C18 31 30 31 40 27C46 25 50 22 52 18C53 14 57 12 60 14C61 16 60 18 58 19C57 25 52 32 44 35C34 38 20 36 10 28Z", fill: "white", stroke: "stone", sw: 0.7 },
    { d: "M24 29C17 19 17 8 24 0C26 8 32 15 41 22C37 26 31 29 24 29Z", fill: "white", stroke: "stone", sw: 0.8 },
    { d: "M26 22C29 17 33 15 37 15M23 15C26 12 29 11 32 12M23 9C25 7 27 6 29 6", fill: "none", stroke: "stone", sw: 0.5, op: 0.8 },
    { d: "M59.5 14.4 63.6 16.2 59.4 17Z", fill: "#c9a45c" },
    { d: "M56.4 15.1a0.9 0.9 0 1 0 0.01 0Z", fill: "#7a6a58" },
  ],
};

export function renderShapeAttrs(s: Shape, p: GardenPalette) {
  const fill = s.fill === "none" ? "none" : tone(p, s.fill ?? "none");
  const stroke = s.stroke ? tone(p, s.stroke) : undefined;
  return { d: s.d, fill: s.fill ? fill : "none", stroke, strokeWidth: s.sw, opacity: s.op, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
}

const esc = (n: number | undefined) => (n === undefined ? "" : String(n));

/** The same artwork as an inline SVG string fragment (used for data-URI backgrounds). Positioned and scaled by `transform`. */
export function artToSvg(def: ArtDef, p: GardenPalette, transform: string): string {
  const body = def.shapes
    .map((s) => {
      const a = renderShapeAttrs(s, p);
      const attrs = [
        `d="${a.d}"`,
        `fill="${a.fill}"`,
        a.stroke ? `stroke="${a.stroke}"` : "",
        a.strokeWidth ? `stroke-width="${esc(a.strokeWidth)}"` : "",
        a.opacity !== undefined ? `opacity="${esc(a.opacity)}"` : "",
        a.stroke ? 'stroke-linecap="round"' : "",
      ]
        .filter(Boolean)
        .join(" ");
      return `<path ${attrs}/>`;
    })
    .join("");
  return `<g transform="${transform}">${body}</g>`;
}

export function paletteFor(theme: Theme): GardenPalette {
  return gardenPalette(theme);
}

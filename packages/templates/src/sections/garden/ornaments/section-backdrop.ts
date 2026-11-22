import type { CSSProperties } from "react";
import type { Theme } from "../../../types";
import { withAlpha } from "../../../chrome/gold";
import { artToSvg, BUD, LEAF, ROSE } from "../art/botanical-data";
import { gardenPalette } from "../palette";

/**
 * Layered scene art behind every shared section: a rose-and-leaf vine climbing the top-left corner
 * and the bottom-right corner (static SVG as CSS backgrounds, so it costs no DOM and no JS),
 * a clipped hedge line at the foot and soft sage / blush glows. Built from the same botanical data
 * as the opening and the hero.
 */
const VINE_BOX = 220;

function vineSvg(theme: Theme, flipped = false): string {
  const p = gardenPalette(theme);
  const stem = `<path d="M6 214C10 160 30 118 66 92C104 66 152 56 214 18" fill="none" stroke="${p.sageDeep}" stroke-width="2.6" stroke-linecap="round"/>`;
  const leaves = [
    [24, 168, 36, -62],
    [44, 130, 38, -36],
    [76, 106, 36, -14],
    [114, 84, 38, -28],
    [156, 60, 36, -8],
  ]
    .map(([x, y, w, r]) => artToSvg(LEAF, p, `translate(${x} ${y}) rotate(${r}) scale(${w! / LEAF.w}) translate(${-LEAF.w / 2} ${-LEAF.h / 2})`))
    .join("");
  const buds = [
    [88, 134, 17, 25],
    [160, 88, 16, 58],
  ]
    .map(([x, y, w, r]) => artToSvg(BUD, p, `translate(${x} ${y}) rotate(${r}) scale(${w! / BUD.w}) translate(${-BUD.w / 2} ${-BUD.h / 2})`))
    .join("");
  const roses = [
    [22, 146, 46, -10],
    [62, 98, 38, 12],
    [118, 66, 42, -6],
    [172, 36, 32, 8],
  ]
    .map(([x, y, w, r]) => artToSvg(ROSE, p, `translate(${x} ${y}) rotate(${r}) scale(${w! / ROSE.w}) translate(${-ROSE.w / 2} ${-ROSE.h / 2})`))
    .join("");
  const art = `${stem}${leaves}${buds}${roses}`;
  const body = flipped ? `<g transform="rotate(180 ${VINE_BOX / 2} ${VINE_BOX / 2})">${art}</g>` : art;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VINE_BOX} ${VINE_BOX}">${body}</svg>`;
}

function hedgeSvg(theme: Theme): string {
  const p = gardenPalette(theme);
  let d = "M0 40L0 22";
  for (let i = 0; i < 10; i++) d += `Q${i * 40 + 20} ${i % 2 ? 6 : 0} ${(i + 1) * 40} 22`;
  d += "L400 40Z";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 40" preserveAspectRatio="none"><path d="${d}" fill="${p.sage}" opacity="0.42"/></svg>`;
}

const uri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/** Pure: the section's background layers for a theme. */
export function gardenSectionBackground(theme: Theme): CSSProperties {
  const p = gardenPalette(theme);
  const vine = uri(vineSvg(theme));
  const flip = uri(vineSvg(theme, true));
  return {
    backgroundColor: theme.bg_color,
    backgroundImage: [
      `${vine}`,
      `${flip}`,
      uri(hedgeSvg(theme)),
      `radial-gradient(90% 40% at 12% 0%, ${withAlpha(p.sage, p.dark ? 0.16 : 0.2)}, transparent 70%)`,
      `radial-gradient(90% 40% at 90% 100%, ${withAlpha(p.rose, p.dark ? 0.14 : 0.22)}, transparent 70%)`,
    ].join(","),
    backgroundRepeat: "no-repeat",
    backgroundPosition: "left top, right bottom, center bottom, 0 0, 0 0",
    backgroundSize: "clamp(120px, 34vw, 210px) auto, clamp(120px, 34vw, 210px) auto, 100% 34px, 100% 100%, 100% 100%",
  };
}

import { mixHex } from "../../../chrome/gold";
import type { DividerProps } from "../../khmer/skin-ornament-types";
import { SakuraArtStyle } from "../SakuraArtStyle";
import { BlossomMark, FoilDef, useSvgId } from "./shared";

/** Gold hairline that swells into a branch with three blossoms and two buds in the middle. */
export function SakuraDivider({ color, width = 220 }: DividerProps) {
  const g = useSvgId("sd");
  const edge = mixHex(color, "#ffffff", 85);
  return (
    <>
      <SakuraArtStyle accent={color} />
      <svg width={width} height={(width * 30) / 220} viewBox="0 0 220 30" aria-hidden focusable="false" style={{ display: "block", margin: "0 auto", overflow: "visible" }}>
        <defs>
          <FoilDef id={g} />
        </defs>
        <g fill="none" stroke={`url(#${g})`} strokeLinecap="round">
          <path d="M6 15H80C88 15 92 12 97 10M214 15H140C132 15 128 12 123 10" strokeWidth="1" />
          <path d="M24 15H70M196 15H150" strokeWidth="2" opacity="0.5" />
          <path d="M80 15Q110 24 140 15" strokeWidth="1.1" />
        </g>
        <BlossomMark x={110} y={14} r={9} rot={12} fill={mixHex(color, "#ffffff", 42)} edge={edge} />
        <BlossomMark x={89} y={17} r={5} rot={-18} fill={mixHex(color, "#ffffff", 20)} edge={edge} />
        <BlossomMark x={131} y={17} r={5} rot={26} fill="#ffffff" edge={edge} />
        <path d="M72 14c2-4 5-4 7 0-2 3-5 3-7 0ZM141 14c2-4 5-4 7 0-2 3-5 3-7 0Z" fill={`url(#${g})`} />
        <circle cx="6" cy="15" r="1.8" fill={`url(#${g})`} />
        <circle cx="214" cy="15" r="1.8" fill={`url(#${g})`} />
      </svg>
    </>
  );
}

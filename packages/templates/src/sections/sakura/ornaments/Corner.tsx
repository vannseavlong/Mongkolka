import { mixHex } from "../../../chrome/gold";
import type { OrnamentProps } from "../../khmer/skin-ornament-types";
import { SakuraArtStyle } from "../SakuraArtStyle";
import { BlossomMark, FoilDef, useSvgId } from "./shared";

/** Top-left corner sprig: a gold double rule turning the corner, one open blossom, two buds and a leaf. */
export function SakuraCorner({ color, size = 64 }: OrnamentProps) {
  const g = useSvgId("sc");
  const fill = mixHex(color, "#ffffff", 45);
  const edge = mixHex(color, "#ffffff", 85);
  return (
    <>
      <SakuraArtStyle accent={color} />
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <FoilDef id={g} />
        </defs>
        <g fill="none" stroke={`url(#${g})`} strokeLinecap="round">
          <path d="M3 76V19Q3 3 19 3H76" strokeWidth="1.5" />
          <path d="M9 62V25Q9 9 25 9H62" strokeWidth="0.8" opacity="0.6" />
          <path d="M20 22C30 24 40 30 46 40" strokeWidth="1.1" />
          <path d="M22 20C24 30 30 40 40 46" strokeWidth="1.1" />
        </g>
        <path d="M44 14c9 2 13 8 12 16-8-1-13-7-12-16Z" fill="#b3c7a8" opacity=".9" />
        <BlossomMark x={20} y={20} r={13} rot={10} fill={fill} edge={edge} />
        <BlossomMark x={50} y={10} r={5.5} rot={30} fill={mixHex(color, "#ffffff", 22)} edge={edge} />
        <BlossomMark x={10} y={50} r={5.5} rot={-20} fill={mixHex(color, "#ffffff", 22)} edge={edge} />
        <circle cx="68" cy="3" r="1.4" fill={`url(#${g})`} />
        <circle cx="3" cy="68" r="1.4" fill={`url(#${g})`} />
      </svg>
    </>
  );
}

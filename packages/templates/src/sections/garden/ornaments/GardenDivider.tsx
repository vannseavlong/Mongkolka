import { useId } from "react";
import type { DividerProps } from "../../khmer/skin-ornament-types";
import { Art } from "../art/Botanicals";
import { LEAF, ROSE } from "../art/botanical-data";
import { lightPalette } from "./light-palette";

/** Original floral flourish: tapering gold rules ending in small scrolls, a rose between two leaf pairs. */
export function GardenDivider({ color, width = 240 }: DividerProps) {
  const p = lightPalette(color);
  const id = `gf${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const { mid } = p.gold;
  return (
    <svg width={width} height={(width * 36) / 240} viewBox="0 0 240 36" aria-hidden focusable="false" style={{ display: "block", margin: "0 auto", maxWidth: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="6" y1="0" x2="92" y2="0">
          <stop offset="0" stopColor={mid} stopOpacity="0" />
          <stop offset="1" stopColor={mid} />
        </linearGradient>
        <linearGradient id={`${id}r`} gradientUnits="userSpaceOnUse" x1="234" y1="0" x2="148" y2="0">
          <stop offset="0" stopColor={mid} stopOpacity="0" />
          <stop offset="1" stopColor={mid} />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinecap="round" strokeWidth="1.2">
        <path d="M6 18H92" stroke={`url(#${id})`} />
        <path d="M234 18H148" stroke={`url(#${id}r)`} />
        <path d="M84 18c-5 0-8-5-4.5-8" stroke={mid} strokeWidth="1" />
        <path d="M156 18c5 0 8-5 4.5-8" stroke={mid} strokeWidth="1" />
      </g>
      <g transform="translate(86 12) rotate(-12)"><Art def={LEAF} palette={p} width={20} /></g>
      <g transform="translate(134 12) rotate(192) scale(1 -1) translate(-20 -9)"><Art def={LEAF} palette={p} width={20} /></g>
      <g transform="translate(105 20) rotate(25)"><Art def={LEAF} palette={p} width={14} /></g>
      <g transform="translate(121 21) rotate(155)"><Art def={LEAF} palette={p} width={14} /></g>
      <g transform="translate(106 2)"><Art def={ROSE} palette={p} width={28} /></g>
      <circle cx="10" cy="18" r="1.6" fill={mid} />
      <circle cx="230" cy="18" r="1.6" fill={mid} />
    </svg>
  );
}

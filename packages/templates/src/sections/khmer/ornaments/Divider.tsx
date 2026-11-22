import { goldStops } from "../../../chrome/gold";
import type { DividerProps } from "../skin-ornament-types";
import { GoldGradientDef, useSvgId } from "./Corner";

/** Original lotus divider: five petals flanked by tapering rules ending in small scrolls and jewels. */
export function LotusDivider({ color, width = 220 }: DividerProps) {
  const g = useSvgId("kd");
  const f = useSvgId("kf");
  const { mid } = goldStops(color);
  return (
    <svg width={width} height={(width * 28) / 240} viewBox="0 0 240 28" aria-hidden focusable="false" style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}>
      <defs>
        <GoldGradientDef id={g} color={color} />
        <linearGradient id={f} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={mid} stopOpacity="0" />
          <stop offset="1" stopColor={mid} stopOpacity="1" />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinecap="round">
        <path d="M4 14H84" stroke={`url(#${f})`} strokeWidth="1.2" />
        <path d="M236 14H156" stroke={`url(#${f})`} strokeWidth="1.2" />
        <path d="M70 14c-6 0-9-6-5-9" stroke={`url(#${g})`} strokeWidth="1" />
        <path d="M170 14c6 0 9-6 5-9" stroke={`url(#${g})`} strokeWidth="1" />
      </g>
      <g fill={`url(#${g})`}>
        <path d="M120 3C114 9 114 17 120 24C126 17 126 9 120 3Z" />
        <path d="M120 24C108 22 102 14 103 8C111 10 117 16 120 24Z" />
        <path d="M120 24C132 22 138 14 137 8C129 10 123 16 120 24Z" />
        <path d="M120 24C104 26 94 20 90 13C100 14 114 18 120 24Z" opacity="0.85" />
        <path d="M120 24C136 26 146 20 150 13C140 14 126 18 120 24Z" opacity="0.85" />
        <path d="M4 14 8 11 12 14 8 17ZM236 14 232 11 228 14 232 17Z" />
        <circle cx="86" cy="14" r="1.6" />
        <circle cx="154" cy="14" r="1.6" />
      </g>
    </svg>
  );
}

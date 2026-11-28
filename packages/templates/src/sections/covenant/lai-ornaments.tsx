"use client";

import { useId, type ReactNode } from "react";
import { goldStops, withAlpha } from "../../chrome/gold";
import { LaiBadge, LaiCorner, LaiDivider, type LaiPaint } from "../../ornament/kbach/lai";
import { MOUL_FONT } from "../../chrome/fonts";
import type { CrestProps, DividerProps, OrnamentProps } from "../khmer/skin-ornament-types";
import { CROSS_PATH } from "./cross";
import { hasKhmer } from "./intro-logic";
import { PINK } from "./palette";

const SCRIPT = 'var(--font-script), "Great Vibes", cursive';
/** The cut lines inside a leaf, on the pale card surfaces these sit on. */
const CUT = "#fff8fa";

/** An svg whose foil is a gradient of the theme's accent. */
function Foil({ color, cut = CUT, viewBox, width, height, label, className, children }: { color: string; cut?: string; viewBox: string; width: number | string; height?: number; label?: string; className?: string; children: (paint: LaiPaint) => ReactNode }) {
  const id = `lai${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const { hi, mid, lo } = goldStops(color);
  return (
    <svg width={width} height={height} viewBox={viewBox} className={className} {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true, focusable: false })} style={{ display: "block", overflow: "visible", margin: "0 auto", maxWidth: "100%" }}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="-80" y1="-80" x2="120" y2="120" spreadMethod="reflect">
          <stop offset="0" stopColor={hi} />
          <stop offset="0.5" stopColor={mid} />
          <stop offset="1" stopColor={lo} />
        </linearGradient>
      </defs>
      {children({ fill: `url(#${id})`, cut })}
    </svg>
  );
}

export function CovenantCorner({ color, size = 60 }: OrnamentProps) {
  return (
    <Foil color={color} viewBox="2 2 152 152" width={size * 1.35} height={size * 1.35}>
      {(paint) => <LaiCorner paint={paint} />}
    </Foil>
  );
}

/** The plain kbach divider (letters). */
export function LaiRule({ color, width = 230 }: DividerProps) {
  return (
    <Foil color={color} viewBox="-103 -23 206 46" width={width} height={(width * 46) / 206}>
      {(paint) => <LaiDivider paint={paint} />}
    </Foil>
  );
}

/** The kbach divider with the cross at its heart. */
export function CrossDivider({ color, width = 240 }: DividerProps) {
  return (
    <Foil color={color} viewBox="-103 -23 206 46" width={width} height={(width * 46) / 206}>
      {(paint) => <LaiDivider paint={paint} center={<path d={CROSS_PATH} fill={paint.fill} transform="scale(.36) translate(-50 -70)" />} />}
    </Foil>
  );
}

/** The monogram badge: initials on a ringed disc held in a diamond of kbach leaves. */
export function KbachCrest({ color, ground, label, size = 104 }: CrestProps) {
  const khmer = hasKhmer(label);
  const long = Array.from(label).length > 5;
  return (
    <Foil color={color} cut={ground} viewBox="-88 -92 176 184" width={size * 1.3} height={size * 1.36} label={label}>
      {(paint) => (
        <>
          <LaiBadge paint={paint} />
          <circle r="35" fill={withAlpha(PINK.blush, 0.4)} />
          <text y={khmer ? 8 : 9} textAnchor="middle" fontSize={long ? 14 : khmer ? 21 : 28} fill={goldStops(color).lo} style={{ fontFamily: khmer ? MOUL_FONT : SCRIPT }}>
            {/* The "&" between initials keeps the flowing script, even beside Khmer letters. */}
            {label.split("&").map((part, i) => (
              <tspan key={i}>
                {i > 0 && <tspan style={{ fontFamily: SCRIPT }}>&amp;</tspan>}
                {part}
              </tspan>
            ))}
          </text>
        </>
      )}
    </Foil>
  );
}

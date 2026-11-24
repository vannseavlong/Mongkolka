import { useId } from "react";
import { goldStops, withAlpha } from "../../chrome/gold";
import type { MarkProps } from "../skinned/skin-ui-types";

/** A plain Latin cross in a 100 x 140 box. Original path; no crucifix, no figure. */
export const CROSS_PATH = "M43 4h14v34h27v14H57v84H43V52H16V38h27Z";

/** The cross as a CSS mask image (black on transparent), for revealing a photo through it. */
export const CROSS_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 140'><path d='${CROSS_PATH}' fill='black'/></svg>`,
)}")`;

function useGradientId(prefix: string): string {
  return `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}

export interface CrossProps {
  color: string;
  /** Rendered height in px; the width follows (5:7). */
  size?: number;
  /** Draw the outline first, then fill (CSS classes `cv-cross-draw` / `cv-cross-fill`, see covenant-styles). */
  draw?: boolean;
  /** Soft glow around it. */
  glow?: boolean;
}

/** Gold-foil cross. With `draw` it traces its outline, then fills in. */
export function Cross({ color, size = 96, draw = false, glow = false }: CrossProps) {
  const g = useGradientId("cx");
  const { hi, mid, lo } = goldStops(color);
  return (
    <svg
      width={(size * 5) / 7}
      height={size}
      viewBox="0 0 100 140"
      aria-hidden
      focusable="false"
      style={{ display: "block", overflow: "visible", filter: glow ? `drop-shadow(0 0 14px ${withAlpha(mid, 0.55)})` : undefined }}
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hi} />
          <stop offset="0.5" stopColor={mid} />
          <stop offset="1" stopColor={lo} />
        </linearGradient>
      </defs>
      <path d={CROSS_PATH} fill={`url(#${g})`} className={draw ? "cv-cross-fill" : undefined} />
      <path d={CROSS_PATH} fill="none" stroke={`url(#${g})`} strokeWidth="2" strokeLinejoin="round" pathLength={1} className={draw ? "cv-cross-draw" : undefined} />
      <path d="M50 12v108M24 45h52" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** The skin's signature mark for forms and the closing note: a small cross. */
export function CrossMark({ color, size = 48 }: MarkProps) {
  return <Cross color={color} size={size} />;
}

/** A tiny five-petal blossom, used for dividers and corners. Pure decoration. */
export function Blossom({ x, y, r, petal, centre }: { x: number; y: number; r: number; petal: string; centre: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r * 0.62} rx={r * 0.42} ry={r * 0.62} fill={petal} transform={`rotate(${a})`} stroke={withAlpha("#b85c7a", 0.35)} strokeWidth="0.4" />
      ))}
      <circle r={r * 0.25} fill={centre} />
    </g>
  );
}

"use client";

import type { ReactNode } from "react";
import { FLAME_PATH, petalPath } from "../../ornament/kbach/geometry";

/** One corner of the printed-card frame: two lines stepping in around a small notch. Drawn for the top left. */
const CORNER = ["M1 48V36Q1 29 8 28Q11 11 28 8Q29 1 36 1H48", "M7 48V38Q7 34 12 33Q16 16 33 12Q34 7 38 7H48"];
const CORNERS = [
  { place: "left-0 top-0", turn: "none" },
  { place: "right-0 top-0", turn: "scaleX(-1)" },
  { place: "bottom-0 left-0", turn: "scaleY(-1)" },
  { place: "bottom-0 right-0", turn: "scale(-1,-1)" },
] as const;

/** The double-line frame with notched corners, sized to whatever is inside it. */
export function LetterFrame({ color, children }: { color: string; children: ReactNode }) {
  const line = { backgroundColor: color };
  return (
    <div className="relative px-6 py-10 sm:px-12">
      {CORNERS.map(({ place, turn }) => (
        <svg key={place} aria-hidden className={`absolute size-12 ${place}`} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.6" style={{ transform: turn }}>
          {CORNER.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      ))}
      {/* Straight edges between the corners, on the same two offsets as the corner lines. */}
      {[0.5, 6.5].map((at) => (
        <span key={at} aria-hidden>
          <i className="absolute inset-x-12 h-px" style={{ ...line, top: at }} />
          <i className="absolute inset-x-12 h-px" style={{ ...line, bottom: at }} />
          <i className="absolute inset-y-12 w-px" style={{ ...line, left: at }} />
          <i className="absolute inset-y-12 w-px" style={{ ...line, right: at }} />
        </span>
      ))}
      {children}
    </div>
  );
}

/** Flame leaves running out to one side (the other is its mirror): [distance from centre, scale, lean]. */
const FLAMES = [
  [8, 0.52, 34],
  [24, 0.4, 58],
  [41, 0.3, 74],
] as const;

/**
 * The kbach under each letter heading: a lotus bud flanked by flame leaves (phni phleung) that curl away and taper
 * into a hairline with seed beads. Floral motifs only, drawn around the bud's foot at (0, 0).
 */
export function LetterOrnament({ color }: { color: string }) {
  return (
    <svg aria-hidden className="mx-auto my-3 block h-auto w-full max-w-[220px]" viewBox="-110 -34 220 46" fill={color}>
      {[1, -1].map((side) => (
        <g key={side} transform={`scale(${side} 1)`}>
          {FLAMES.map(([x, scale, lean]) => (
            <path key={x} d={FLAME_PATH} transform={`translate(${x} 4) rotate(${lean}) scale(${scale})`} />
          ))}
          <path d={petalPath(0, 3, 8, 21)} transform="rotate(36 0 3)" opacity="0.85" />
          <path d="M60 4Q78 2 100 4Q78 6 60 4Z" />
          <circle cx="64" cy="-3" r="1.6" />
          <circle cx="103.5" cy="4" r="1.8" />
        </g>
      ))}
      <path d={petalPath(0, 3, 13, 33)} />
      <path d={petalPath(0, -2, 5, 15)} fill="#fffaf7" />
      <path d="M-22 7Q0 15 22 7Q0 11 -22 7Z" />
      <circle cy="-31.5" r="1.4" />
    </svg>
  );
}

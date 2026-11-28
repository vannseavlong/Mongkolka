"use client";

import type { ReactNode } from "react";
import { LaiRule } from "./lai-ornaments";

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

/** The kbach divider under each letter heading. */
export function LetterOrnament({ color }: { color: string }) {
  return (
    <div className="my-3">
      <LaiRule color={color} />
    </div>
  );
}

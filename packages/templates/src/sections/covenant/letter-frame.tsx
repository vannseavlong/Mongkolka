"use client";

import type { ReactNode } from "react";

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

/** The small lotus under each letter heading. */
export function LetterLotus({ color }: { color: string }) {
  return (
    <svg aria-hidden className="mx-auto my-3 block" width="92" height="36" viewBox="0 0 92 36" fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round">
      <path d="M46 3C52 9 54 13 53 18C58 14 66 15 66 23C66 30 56 32 46 32C36 32 26 30 26 23C26 15 34 14 39 18C38 13 40 9 46 3Z" />
      <path d="M46 14C50 18 51 24 46 29C41 24 42 18 46 14Z" />
      <path d="M4 18Q14 12 22 19Q18 29 11 28Q5 26 4 18Z" />
      <path d="M88 18Q78 12 70 19Q74 29 81 28Q87 26 88 18Z" />
      <circle cx="14" cy="21" r="2" />
      <circle cx="78" cy="21" r="2" />
    </svg>
  );
}

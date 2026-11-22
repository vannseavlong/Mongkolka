import type { ReactNode } from "react";
import type { IconProps, IconSet } from "../../khmer/skin-ornament-types";

/**
 * Original ritual icons for the Royal Garden skin, 48 x 48 line art with a small leaf or blossom
 * accent on each so the set reads as garden stationery. Drawn from scratch.
 */
function Line({ color, size = 40, strokeWidth = 1.5, children }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false" style={{ display: "block" }}>
      {children}
    </svg>
  );
}

const Sprig = ({ x, y, r = 0 }: { x: number; y: number; r?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <path d="M0 0C3-4 8-4 11 0C8 4 3 4 0 0Z" />
    <path d="M1 0H9" opacity="0.6" />
  </g>
);

const Monk = (p: IconProps) => (
  <Line {...p}>
    <path d="M24 6C20 11 20 15 24 19C28 15 28 11 24 6Z" />
    <path d="M24 19C17 18 13 14 12 10C17 11 21 14 24 19ZM24 19C31 18 35 14 36 10C31 11 27 14 24 19Z" />
    <path d="M10 28H38C38 36 32 41 24 41C16 41 10 36 10 28Z" />
    <path d="M14 45H34" opacity="0.7" />
  </Line>
);
const Procession = (p: IconProps) => (
  <Line {...p}>
    <path d="M8 27H40L36 40H12Z" />
    <path d="M12 27C12 17 20 13 24 13C28 13 36 17 36 27" />
    <path d="M24 13V8" />
    <circle cx="24" cy="6.5" r="2.2" />
    <path d="M18 33H30" opacity="0.7" />
    <Sprig x={4} y={21} r={-30} />
  </Line>
);
const Scissors = (p: IconProps) => (
  <Line {...p}>
    <path d="M14 6 33 33M34 6 15 33" />
    <circle cx="12.5" cy="38" r="5" />
    <circle cx="35.5" cy="38" r="5" />
    <circle cx="24" cy="21" r="1.3" fill={p.color} />
    <Sprig x={36} y={8} r={-55} />
  </Line>
);
const Thread = (p: IconProps) => (
  <Line {...p}>
    <ellipse cx="24" cy="26" rx="15" ry="9" />
    <ellipse cx="24" cy="26" rx="10" ry="5.5" opacity="0.6" />
    <path d="M18 34C16 39 18 43 21 44M30 34C32 39 30 43 27 44" />
    <path d="M22 17C22 12 26 12 26 17" />
    <path d="M24 17V9" />
    <circle cx="24" cy="7" r="2" />
  </Line>
);
const Ring = (p: IconProps) => (
  <Line {...p}>
    <circle cx="18" cy="30" r="9" />
    <circle cx="30" cy="30" r="9" />
    <path d="M24 12 28 7 24 3 20 7Z" />
    <path d="M24 12 29 17 24 21 19 17Z" opacity="0.7" />
    <path d="M10 30H12M24 24V22" opacity="0" />
  </Line>
);
const Tea = (p: IconProps) => (
  <Line {...p}>
    <path d="M9 22H33V28C33 34 28 38 21 38C14 38 9 34 9 28Z" />
    <path d="M33 24H37C40 24 40 31 36 31H33" />
    <path d="M6 42H36" />
    <path d="M15 16C13 13 17 11 15 8M22 16C20 13 24 11 22 8" opacity="0.8" />
    <Sprig x={30} y={8} r={-35} />
  </Line>
);
const Dinner = (p: IconProps) => (
  <Line {...p}>
    <path d="M10 6H22L21 18C20 22 12 22 11 18Z" />
    <path d="M16 22V36M11 38H21" />
    <path d="M28 6H40L39 18C38 22 30 22 29 18Z" />
    <path d="M34 22V36M29 38H39" />
    <path d="M10 12H22M28 12H40" opacity="0.6" />
    <path d="M8 44H42" opacity="0.7" />
  </Line>
);
const Party = (p: IconProps) => (
  <Line {...p}>
    <path d="M6 14C14 22 34 22 42 14" />
    <path d="M10 18V24L8 28M24 21V28L22 33M38 18V24L40 28" />
    <path d="M8 28 6 31 10 31ZM22 33 20 36 24 36ZM40 28 38 31 42 31Z" />
    <path d="M17 6V10M31 6V10M24 3V8" opacity="0.8" />
    <circle cx="14" cy="40" r="2" />
    <circle cx="34" cy="41" r="1.6" />
    <path d="M22 43l2-3 2 3-2 2Z" />
  </Line>
);
const Cake = (p: IconProps) => (
  <Line {...p}>
    <path d="M24 5C21 9 22 12 24 13C26 12 27 9 24 5Z" />
    <path d="M24 13V19" />
    <rect x="13" y="19" width="22" height="9" rx="2" />
    <rect x="7" y="28" width="34" height="12" rx="2" />
    <path d="M7 34C11 37 15 31 19 34C23 37 27 31 31 34C35 37 38 33 41 34" opacity="0.8" />
    <path d="M5 44H43" opacity="0.7" />
  </Line>
);

export const GARDEN_ICONS: IconSet = {
  monk: Monk,
  procession: Procession,
  scissors: Scissors,
  thread: Thread,
  ring: Ring,
  tea: Tea,
  dinner: Dinner,
  party: Party,
  cake: Cake,
};

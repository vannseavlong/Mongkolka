import type { ReactNode } from "react";
import type { IconProps, IconSet } from "../../khmer/skin-ornament-types";

/** Original soft-line icons for the nine ritual icons, 48x48 grid, rounded joins, a small blossom accent where it fits. */
function Line({ color, size = 40, strokeWidth = 1.5, children }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false" style={{ display: "block" }}>
      {children}
    </svg>
  );
}

/** A tiny five-petal blossom outline centred on (x, y). */
const Bloom = ({ x, y, r = 3 }: { x: number; y: number; r?: number }) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx="0" cy={-r * 0.8} rx={r * 0.55} ry={r * 0.8} transform={`rotate(${a})`} />
    ))}
  </g>
);

const Monk = (p: IconProps) => (
  <Line {...p}>
    <path d="M15 12a9 9 0 0 1 18 0" opacity="0.55" />
    <circle cx="24" cy="14" r="4.6" />
    <path d="M24 19C15 20 10 28 9 38H39C38 28 33 20 24 19Z" />
    <path d="M24 19 21 38M24 19c4 6 6 12 7 19" opacity="0.7" />
    <path d="M18 33q6 4 12 0" />
    <path d="M5 42H43" />
    <Bloom x={24} y={44} r={2} />
  </Line>
);
const Procession = (p: IconProps) => (
  <Line {...p}>
    <path d="M11 29H37" />
    <path d="M13 29C13 20 35 20 35 29" />
    <path d="M24 20V15" />
    <Bloom x={24} y={12} r={3.2} />
    <path d="M15 29 17 41H31L33 29" />
    <path d="M19 35H29" opacity="0.7" />
    <path d="M7 41H41" />
  </Line>
);
const Scissors = (p: IconProps) => (
  <Line {...p}>
    <path d="M14 6 33 36M34 6 15 36" />
    <circle cx="13" cy="40" r="4.6" />
    <circle cx="35" cy="40" r="4.6" />
    <Bloom x={24} y={21} r={3.4} />
  </Line>
);
const Thread = (p: IconProps) => (
  <Line {...p}>
    <ellipse cx="24" cy="20" rx="15" ry="9.5" />
    <ellipse cx="24" cy="20" rx="10" ry="5.4" opacity="0.55" />
    <path d="M24 29.5V33" />
    <circle cx="24" cy="35" r="2.4" />
    <path d="M24 37.4C22 40 20 42 17 44M24 37.4V44M24 37.4C26 40 28 42 31 44" />
    <path d="M9 14c3-2 5-2 7 0M32 14c2-2 4-2 7 0" opacity="0.6" />
  </Line>
);
const Ring = (p: IconProps) => (
  <Line {...p}>
    <circle cx="18" cy="31" r="9" />
    <circle cx="30" cy="31" r="9" />
    <path d="M24 5l4.5 5.5L24 17l-4.5-6.5Z" />
    <path d="M19.5 10.5H28.5" opacity="0.6" />
    <path d="M24 1v2M33 4l-1.4 1.4M15 4l1.4 1.4" opacity="0.7" />
  </Line>
);
const Tea = (p: IconProps) => (
  <Line {...p}>
    <path d="M10 28C10 20 33 20 33 28 33 36 30 40 21.5 40 13 40 10 36 10 28Z" />
    <path d="M16 21H28M22 21V18" />
    <circle cx="22" cy="16" r="1.4" />
    <path d="M33 26C38 25 40 21 41 17" />
    <path d="M10 27C4 26 4 35 11 34" />
    <path d="M14 44H29" />
    <path d="M19 12c-2-3 2-4 0-7M25 12c-2-3 2-4 0-7" opacity="0.6" />
  </Line>
);
const Dinner = (p: IconProps) => (
  <Line {...p}>
    <path d="M8 33C8 21 40 21 40 33Z" />
    <circle cx="24" cy="18" r="2.3" />
    <path d="M5 37H43" />
    <path d="M9 41H39" opacity="0.6" />
    <path d="M14 27c1-3 4-5 8-5" opacity="0.5" />
    <path d="M38 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1ZM8 14l.7 1.3 1.3.7-1.3.7L8 18l-.7-1.3L6 16l1.3-.7Z" />
  </Line>
);
const Party = (p: IconProps) => (
  <Line {...p}>
    <g transform="rotate(-14 15 18)">
      <path d="M9 6H21L19.5 20C19 24 11 24 10.5 20Z" />
      <path d="M10 11H20" opacity="0.6" />
      <path d="M15 24V38M10 38H20" />
    </g>
    <g transform="rotate(14 33 18)">
      <path d="M27 6H39L37.5 20C37 24 29 24 28.5 20Z" />
      <path d="M28 11H38" opacity="0.6" />
      <path d="M33 24V38M28 38H38" />
    </g>
    <path d="M24 5v4M20.5 7h7" />
    <Bloom x={24} y={14} r={2.6} />
  </Line>
);
const Cake = (p: IconProps) => (
  <Line {...p}>
    <path d="M8 40V30H40V40Z" />
    <path d="M13 30V22H35V30" />
    <path d="M8 30q4 4.5 8 0 4 4.5 8 0 4 4.5 8 0 4 4.5 8 0" />
    <path d="M24 22V16" />
    <path d="M24 8c-2.4 3-2.4 5 0 7 2.4-2 2.4-4 0-7Z" />
    <path d="M4 44H44" />
    <Bloom x={14} y={36} r={2} />
    <Bloom x={34} y={36} r={2} />
  </Line>
);

export const SAKURA_ICONS: IconSet = {
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

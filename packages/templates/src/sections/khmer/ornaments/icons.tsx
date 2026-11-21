import type { ReactNode } from "react";
import type { AgendaIcon } from "../../../types";
import type { IconProps, IconSet } from "../skin-ornament-types";

/** Original single-colour line icons for the ritual agenda, 48x48 grid. Nothing here is traced from a reference. */
function Line({ color, size = 40, strokeWidth = 1.7, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      style={{ display: "block" }}
    >
      {children}
    </svg>
  );
}

const Monk = (p: IconProps) => (
  <Line {...p}>
    <circle cx="24" cy="10" r="5" />
    <path d="M24 16C16 18 12 26 12 34H36C36 26 32 18 24 16Z" />
    <path d="M20 27 24 21 28 27" />
    <path d="M7 38Q24 47 41 38" />
    <path d="M12 42H36" opacity="0.6" />
  </Line>
);
const Procession = (p: IconProps) => (
  <Line {...p}>
    <path d="M14 21C14 11 34 11 34 21" />
    <path d="M24 11V7M22 7H26" />
    <path d="M8 21H40" />
    <path d="M10 21C10 29 16 33 24 33C32 33 38 29 38 21" />
    <path d="M24 33V39M20 39H28M16 43H32" />
  </Line>
);
const Scissors = (p: IconProps) => (
  <Line {...p}>
    <path d="M14 5 34 36M34 5 14 36" />
    <circle cx="12" cy="40" r="5" />
    <circle cx="36" cy="40" r="5" />
    <circle cx="24" cy="21" r="1.4" fill={p.color} />
  </Line>
);
const Thread = (p: IconProps) => (
  <Line {...p}>
    <ellipse cx="24" cy="21" rx="15" ry="12" />
    <circle cx="24" cy="9" r="2.2" />
    <circle cx="24" cy="34" r="3" />
    <path d="M24 37C22 41 19 43 15 44M24 37C26 41 29 43 33 44" />
    <path d="M9 21H12M36 21H39" opacity="0.6" />
  </Line>
);
const Ring = (p: IconProps) => (
  <Line {...p}>
    <circle cx="18" cy="31" r="10" />
    <circle cx="31" cy="31" r="10" />
    <path d="M26 13 31 7 36 13 31 21Z" />
    <path d="M26 13H36" />
  </Line>
);
const Tea = (p: IconProps) => (
  <Line {...p}>
    <path d="M9 21H33V28C33 34 28 38 21 38C14 38 9 34 9 28Z" />
    <path d="M33 23H37C41 23 41 31 35 32" />
    <path d="M6 42H36" />
    <path d="M15 7C12 10 18 12 15 16M23 7C20 10 26 12 23 16" opacity="0.8" />
  </Line>
);
const Dinner = (p: IconProps) => (
  <Line {...p}>
    <circle cx="24" cy="24" r="11" />
    <circle cx="24" cy="24" r="6.5" opacity="0.6" />
    <path d="M7 7V16C7 19.5 11 19.5 11 16V7M9 19V42" />
    <path d="M41 7C37 11 37 21 41 26V42M41 7V26" />
  </Line>
);
const Party = (p: IconProps) => (
  <Line {...p}>
    <path d="M24 5 28 20 43 24 28 28 24 43 20 28 5 24 20 20Z" />
    <path d="M38 6V12M35 9H41M9 36V42M6 39H12" />
    <circle cx="39" cy="38" r="1.5" />
    <circle cx="9" cy="10" r="1.5" />
  </Line>
);
const Cake = (p: IconProps) => (
  <Line {...p}>
    <path d="M7 41H41V31H7Z" />
    <path d="M12 31V21H36V31" />
    <path d="M12 26Q15 29 18 26T24 26T30 26T36 26" opacity="0.8" />
    <path d="M24 21V14" />
    <path d="M24 5C21 8 22 12 24 12C26 12 27 8 24 5Z" />
  </Line>
);

export const DEFAULT_ICONS: IconSet = {
  monk: Monk,
  procession: Procession,
  scissors: Scissors,
  thread: Thread,
  ring: Ring,
  tea: Tea,
  dinner: Dinner,
  party: Party,
  cake: Cake,
} satisfies Record<AgendaIcon, (p: IconProps) => ReactNode>;

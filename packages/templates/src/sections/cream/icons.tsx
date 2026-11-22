import { useId, type ReactNode } from "react";
import type { IconProps, IconSet } from "../khmer/skin-ornament-types";
import { PIGMENT } from "./palette";

/**
 * Nine ritual icons for the Royal Cream agenda: each sits in a blush watercolour medallion ringed
 * with gold beads, with delicate line art inside. Drawn from scratch on a 48 grid; the inner art is
 * a 20-unit-radius drawing scaled into the medallion.
 */
function Medallion({ color, size = 44, strokeWidth = 1.4, children }: IconProps & { children: ReactNode }) {
  const g = `md${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={g} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor={PIGMENT.blush} stopOpacity="0.75" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill={`url(#${g})`} />
      <circle cx="24" cy="24" r="22.4" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.1 3.2" />
      <circle cx="24" cy="24" r="19.4" fill="none" stroke={color} strokeWidth="0.6" opacity="0.55" />
      <g transform="translate(24 24) scale(0.74) translate(-24 -24)" fill="none" stroke={color} strokeWidth={strokeWidth / 0.74} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

const Monk = (p: IconProps) => (
  <Medallion {...p}>
    {/* palm-leaf fan, the monk's ceremonial fan, on a lotus */}
    <path d="M10 22C10 9 38 9 38 22C38 31 31 35 24 35C17 35 10 31 10 22Z" />
    <path d="M24 12V35M16 14 19 33M32 14 29 33" opacity="0.7" />
    <path d="M24 35V41M18 41H30" />
    <path d="M14 44C18 40 21 42 24 44C27 42 30 40 34 44" opacity="0.8" />
  </Medallion>
);
const Procession = (p: IconProps) => (
  <Medallion {...p}>
    {/* tiered parasol over a gift tray */}
    <path d="M24 4V9M9 20Q24 6 39 20Z" />
    <path d="M24 9V20M16 12 18 20M32 12 30 20" opacity="0.7" />
    <path d="M24 20V30" />
    <path d="M10 33H38M12 33C12 41 36 41 36 33" />
    <circle cx="19" cy="30" r="2.2" />
    <circle cx="29" cy="30" r="2.2" />
  </Medallion>
);
const Scissors = (p: IconProps) => (
  <Medallion {...p}>
    <path d="M15 6 30 31M33 6 18 31" />
    <circle cx="14" cy="37" r="5" />
    <circle cx="34" cy="37" r="5" />
    <path d="M38 14c4-3 7 1 4 4" opacity="0.8" />
    <circle cx="24" cy="19" r="1.2" fill={p.color} />
  </Medallion>
);
const Thread = (p: IconProps) => (
  <Medallion {...p}>
    {/* a blessing thread tied in a bow around a wrist circle */}
    <circle cx="24" cy="28" r="12" strokeDasharray="1 3" />
    <path d="M24 16C17 6 12 12 19 16M24 16C31 6 36 12 29 16" />
    <path d="M24 16 19 25M24 16 29 25" />
    <circle cx="24" cy="16" r="1.6" fill={p.color} />
  </Medallion>
);
const Ring = (p: IconProps) => (
  <Medallion {...p}>
    <circle cx="18" cy="31" r="9" />
    <circle cx="30" cy="31" r="9" />
    <path d="M26 14 30 8 34 14 30 21Z" />
    <path d="M26 14H34M30 8V21" opacity="0.6" />
  </Medallion>
);
const Tea = (p: IconProps) => (
  <Medallion {...p}>
    {/* teapot */}
    <path d="M12 22C12 14 32 14 32 22V30C32 36 12 36 12 30Z" />
    <path d="M17 17C18 11 26 11 27 17M22 11V9" />
    <path d="M32 21C38 20 40 24 36 27L32 28" />
    <path d="M12 24C7 22 5 17 9 15" />
    <path d="M10 40H34" />
  </Medallion>
);
const Dinner = (p: IconProps) => (
  <Medallion {...p}>
    {/* two clinking goblets */}
    <g transform="rotate(-12 18 24)">
      <path d="M10 8H24C24 18 20 22 17 22C14 22 10 18 10 8Z" />
      <path d="M17 22V37M11 37H23" />
    </g>
    <g transform="rotate(12 30 24)">
      <path d="M24 8H38C38 18 34 22 31 22C28 22 24 18 24 8Z" />
      <path d="M31 22V37M25 37H37" />
    </g>
    <path d="M24 4V1M20 5 18 3M28 5 30 3" opacity="0.8" />
  </Medallion>
);
const Party = (p: IconProps) => (
  <Medallion {...p}>
    {/* party popper */}
    <path d="M8 40 16 14 34 32Z" />
    <path d="M12 30 22 36M15 22 27 33" opacity="0.7" />
    <path d="M26 12 31 5M33 19 41 16M22 6V1" />
    <circle cx="38" cy="8" r="1.6" fill={p.color} />
    <circle cx="40" cy="26" r="1.4" fill={p.color} />
    <circle cx="14" cy="6" r="1.4" fill={p.color} />
  </Medallion>
);
const Cake = (p: IconProps) => (
  <Medallion {...p}>
    <path d="M24 5C21 9 27 9 24 13C22 10 22 8 24 5Z" fill={p.color} />
    <path d="M24 13V18" />
    <rect x="14" y="18" width="20" height="8" rx="2" />
    <rect x="8" y="26" width="32" height="10" rx="2" />
    <path d="M8 31C12 34 16 28 20 31C24 34 28 28 32 31C35 33 38 30 40 31" opacity="0.8" />
    <path d="M6 40H42" />
  </Medallion>
);

export const CREAM_ICONS: IconSet = {
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

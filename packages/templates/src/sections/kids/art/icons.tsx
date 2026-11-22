import type { ReactNode } from "react";
import type { AgendaIcon } from "../../../types";
import type { IconProps, IconSet } from "../../khmer/skin-ornament-types";

/**
 * Nine friendly party icons for the agenda, replacing the ritual icons. They keep the contract's ids
 * (monk, procession, scissors, thread, ring, tea, dinner, party, cake) but draw kid-party things: a wand,
 * bunting, a party hat, a bow, a gift, a drink, a cupcake, balloons and a cake. Rounded strokes with a
 * soft fill; all original, on a 48x48 grid.
 */
function Soft({ color, size = 40, strokeWidth = 2.2, children }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false" style={{ display: "block" }}>
      {children}
    </svg>
  );
}

const Wand = (p: IconProps) => (
  <Soft {...p}>
    <path d="M9 40 29 20" />
    <path d="M29 20c1-5 4-8 9-9-1 5-4 8-9 9Z" fill={p.color} fillOpacity=".18" />
    <path d="M36 4v7M32.5 7.5h7M41 22v5M38.5 24.5h5M12 12v4M10 14h4" />
  </Soft>
);
const Bunting = (p: IconProps) => (
  <Soft {...p}>
    <path d="M4 9Q24 19 44 9" />
    <path d="M9 12.5 15 13.6 12.2 24Z" fill={p.color} fillOpacity=".18" />
    <path d="M20 15.5 27 16 23.4 28Z" fill={p.color} fillOpacity=".18" />
    <path d="M31 15.2 38 13.6 35.6 25Z" fill={p.color} fillOpacity=".18" />
    <circle cx="12" cy="38" r="2" />
    <circle cx="24" cy="40" r="2" />
    <circle cx="36" cy="38" r="2" />
  </Soft>
);
const PartyHat = (p: IconProps) => (
  <Soft {...p}>
    <path d="M24 8 11 40h26Z" fill={p.color} fillOpacity=".14" />
    <path d="M17.5 25h13M13.5 34h21" />
    <circle cx="24" cy="7" r="3.2" fill={p.color} fillOpacity=".4" />
    <path d="M8 40h32" />
  </Soft>
);
const Bow = (p: IconProps) => (
  <Soft {...p}>
    <path d="M24 22C16 11 6 12 7 21c1 8 11 5 17 1Z" fill={p.color} fillOpacity=".16" />
    <path d="M24 22c8-11 18-10 17-1-1 8-11 5-17 1Z" fill={p.color} fillOpacity=".16" />
    <circle cx="24" cy="22" r="4" fill={p.color} fillOpacity=".35" />
    <path d="M22 26 16 40M26 26 32 40" />
  </Soft>
);
const Gift = (p: IconProps) => (
  <Soft {...p}>
    <rect x="7" y="21" width="34" height="19" rx="3" fill={p.color} fillOpacity=".14" />
    <rect x="5" y="14" width="38" height="8" rx="3" fill={p.color} fillOpacity=".2" />
    <path d="M24 14v26" />
    <path d="M24 14c-3-8-12-8-11-3 .6 3 7 3 11 3Zm0 0c3-8 12-8 11-3-.6 3-7 3-11 3Z" />
  </Soft>
);
const Juice = (p: IconProps) => (
  <Soft {...p}>
    <path d="M10 16h28l-3.5 24h-21Z" fill={p.color} fillOpacity=".14" />
    <path d="M11.5 25h25" />
    <path d="M28 16 33 5h6" />
    <circle cx="17" cy="32" r="2" />
    <circle cx="26" cy="34" r="1.6" />
    <path d="M30 29c1.5 0 3 1 3 2.6" />
  </Soft>
);
const Cupcake = (p: IconProps) => (
  <Soft {...p}>
    <path d="M10 26h28l-3 15H13Z" fill={p.color} fillOpacity=".16" />
    <path d="M17 26 18 41M24 26v15M31 26l-1 15" opacity=".6" />
    <path d="M8 26c0-6 4-8 7-8 1-5 5-8 9-8s8 3 9 8c3 0 7 2 7 8Z" fill={p.color} fillOpacity=".1" />
    <circle cx="24" cy="8" r="2.4" fill={p.color} fillOpacity=".5" />
  </Soft>
);
const Balloons = (p: IconProps) => (
  <Soft {...p}>
    <ellipse cx="17" cy="16" rx="9" ry="11" fill={p.color} fillOpacity=".16" />
    <ellipse cx="31" cy="19" rx="9" ry="11" fill={p.color} fillOpacity=".26" />
    <path d="M17 27 18.5 30h-3Z" />
    <path d="M31 30l1.5 3h-3Z" />
    <path d="M17 30c0 6 5 6 7 10M31 33c0 5-4 4-7 7" />
    <path d="M13 11q1.5-3 4.5-3" />
  </Soft>
);
const BirthdayCake = (p: IconProps) => (
  <Soft {...p}>
    <rect x="6" y="31" width="36" height="10" rx="3" fill={p.color} fillOpacity=".18" />
    <rect x="11" y="21" width="26" height="10" rx="3" fill={p.color} fillOpacity=".1" />
    <path d="M6 33q4.5 4 9 0t9 0t9 0t9 0" />
    <path d="M24 21v-7M24 5c-2.6 3-2.4 6 0 6.6 2.4-.6 2.6-3.6 0-6.6Z" fill={p.color} fillOpacity=".4" />
    <path d="M17 21v-4M31 21v-4" />
  </Soft>
);

export const KIDS_ICONS: IconSet = {
  monk: Wand,
  procession: Bunting,
  scissors: PartyHat,
  thread: Bow,
  ring: Gift,
  tea: Juice,
  dinner: Cupcake,
  party: Balloons,
  cake: BirthdayCake,
} satisfies Record<AgendaIcon, (p: IconProps) => ReactNode>;

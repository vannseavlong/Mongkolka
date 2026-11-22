import type { ReactNode } from "react";
import { mixHex } from "../../../chrome/gold";
import type { CreamPalette } from "../palette";

/**
 * Original watercolour flowers for the Royal Cream skin, drawn from scratch as layered translucent
 * petals with radial gradients (pigment pooling at the petal edge) and one displacement filter that
 * roughens the edges like wet paper. Nothing here is traced from any reference.
 *
 * Each composition renders `<FlowerDefs id>` once and passes the same `id` to every flower, so the
 * gradient ids stay unique per SVG on the page.
 */

export const flowerIds = (id: string) => ({
  petal: `${id}-pt`,
  petalDeep: `${id}-pd`,
  petalCore: `${id}-pc`,
  rose: `${id}-rs`,
  leaf: `${id}-lf`,
  gold: `${id}-gd`,
  wash: `${id}-wc`,
});

export function FlowerDefs({ id, p }: { id: string; p: CreamPalette }) {
  const ids = flowerIds(id);
  const tip = mixHex(p.blush, "#ffffff", 55);
  return (
    <defs>
      {/* Petal pigment: deep at the base, pale toward the tip, a pooled darker rim. */}
      <radialGradient id={ids.petal} cx="0.5" cy="1" r="1.05">
        <stop offset="0" stopColor={p.blushDeep} stopOpacity="0.95" />
        <stop offset="0.55" stopColor={p.blush} stopOpacity="0.92" />
        <stop offset="1" stopColor={tip} stopOpacity="0.88" />
      </radialGradient>
      <radialGradient id={ids.petalDeep} cx="0.5" cy="1" r="1.05">
        <stop offset="0" stopColor={p.rose} stopOpacity="0.95" />
        <stop offset="0.6" stopColor={p.blushDeep} stopOpacity="0.95" />
        <stop offset="1" stopColor={p.blush} stopOpacity="0.9" />
      </radialGradient>
      <radialGradient id={ids.petalCore} cx="0.5" cy="1" r="1">
        <stop offset="0" stopColor={mixHex(p.rose, "#7a2a3c", 80)} stopOpacity="1" />
        <stop offset="1" stopColor={p.rose} stopOpacity="0.95" />
      </radialGradient>
      <radialGradient id={ids.rose} cx="0.42" cy="0.38" r="0.75">
        <stop offset="0" stopColor={mixHex(p.blush, "#ffffff", 60)} />
        <stop offset="0.6" stopColor={p.blushDeep} />
        <stop offset="1" stopColor={p.rose} />
      </radialGradient>
      <linearGradient id={ids.leaf} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={p.sageDeep} stopOpacity="0.95" />
        <stop offset="1" stopColor={p.sage} stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id={ids.gold} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={p.goldHi} />
        <stop offset="0.5" stopColor={p.gold} />
        <stop offset="1" stopColor={p.goldLo} />
      </linearGradient>
      <filter id={ids.wash} x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
      </filter>
    </defs>
  );
}

interface Place {
  x: number;
  y: number;
  /** Rotation in degrees. */
  r?: number;
  s?: number;
}

const at = ({ x, y, r = 0, s = 1 }: Place) => `translate(${x} ${y}) rotate(${r}) scale(${s})`;

const PETAL = "M0 0C-12 -6 -19 -22 -9 -33C-5 -38 5 -38 9 -33C19 -22 12 -6 0 0Z";
const FRILL = "M-9 -33C-4 -28 4 -28 9 -33";

function PetalRing({ n, scale, offset, fill, rim, opacity = 1 }: { n: number; scale: number; offset: number; fill: string; rim: string; opacity?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, k) => (
        <g key={k} transform={`rotate(${offset + (360 / n) * k}) scale(${scale})`} opacity={opacity}>
          <path d={PETAL} fill={`url(#${fill})`} stroke={rim} strokeOpacity="0.4" strokeWidth="0.7" />
          <path d={FRILL} fill="none" stroke={rim} strokeOpacity="0.35" strokeWidth="0.6" />
          <path d="M0 -4C0 -14 0 -22 0 -28" fill="none" stroke={rim} strokeOpacity="0.18" strokeWidth="0.5" />
        </g>
      ))}
    </>
  );
}

/** A peony: three rings of ruffled petals around a gold-dusted heart. Radius about 40 at scale 1. */
export function Peony({ id, p, ...place }: Place & { id: string; p: CreamPalette }) {
  const ids = flowerIds(id);
  return (
    <g transform={at(place)}>
      <PetalRing n={8} scale={1} offset={11} fill={ids.petal} rim={p.blushDeep} />
      <PetalRing n={7} scale={0.74} offset={30} fill={ids.petalDeep} rim={p.rose} />
      <PetalRing n={6} scale={0.5} offset={6} fill={ids.petalCore} rim={p.rose} />
      <circle r="3.4" fill={`url(#${ids.gold})`} />
      {Array.from({ length: 9 }, (_, k) => (
        <circle key={k} cx={Math.cos((k / 9) * 6.283) * 6} cy={Math.sin((k / 9) * 6.283) * 6} r="0.9" fill={p.goldHi} />
      ))}
    </g>
  );
}

/** A rose: five cupped outer petals and a swirl of inner ones. Radius about 24 at scale 1. */
export function Rose({ id, p, ...place }: Place & { id: string; p: CreamPalette }) {
  const ids = flowerIds(id);
  return (
    <g transform={at(place)}>
      {Array.from({ length: 5 }, (_, k) => (
        <path
          key={k}
          transform={`rotate(${k * 72 + 9})`}
          d="M0 0C-16 -4 -21 -21 -6 -26C0 -28 7 -27 12 -22C21 -13 12 -2 0 0Z"
          fill={`url(#${ids.rose})`}
          stroke={p.rose}
          strokeOpacity="0.4"
          strokeWidth="0.7"
        />
      ))}
      <circle r="12" fill={`url(#${ids.rose})`} opacity="0.9" />
      <path d="M0 -3C7 -3 9 -10 3 -11C-5 -12 -9 -4 -5 2C-1 7 8 6 10 -1" fill="none" stroke={p.rose} strokeOpacity="0.75" strokeWidth="1" strokeLinecap="round" />
      <path d="M-1 1C2 0 3 -3 0 -4C-3 -4 -4 -1 -2 1" fill="none" stroke={p.rose} strokeOpacity="0.8" strokeWidth="0.9" strokeLinecap="round" />
    </g>
  );
}

/** A closed bud on a short calyx. */
export function Bud({ id, p, ...place }: Place & { id: string; p: CreamPalette }) {
  const ids = flowerIds(id);
  return (
    <g transform={at(place)}>
      <path d="M0 0C-9 -6 -9 -18 0 -26C9 -18 9 -6 0 0Z" fill={`url(#${ids.petal})`} stroke={p.blushDeep} strokeOpacity="0.45" strokeWidth="0.7" />
      <path d="M0 -2C-4 -8 -3 -16 0 -22C3 -16 4 -8 0 -2Z" fill={p.blushDeep} fillOpacity="0.5" />
      <path d="M-6 2C-4 -4 4 -4 6 2C2 5 -2 5 -6 2Z" fill={`url(#${ids.leaf})`} />
    </g>
  );
}

/** One leaf pointing right from the origin; length about 34. */
export function Leaf({ id, p, ...place }: Place & { id: string; p: CreamPalette }) {
  const ids = flowerIds(id);
  return (
    <g transform={at(place)}>
      <path d="M0 0C6 -10 22 -12 34 0C22 12 6 10 0 0Z" fill={`url(#${ids.leaf})`} stroke={p.sageDeep} strokeOpacity="0.45" strokeWidth="0.6" />
      <path d="M2 0H30" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="0.6" />
      <path d="M10 0 16 -5M10 0 16 5M19 0 24 -4M19 0 24 4" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="0.5" fill="none" />
    </g>
  );
}

/** A curved stem with leaves alternating along it. `d` is the stem path; `leaves` are [t, side] positions. */
export function Sprig({
  id,
  p,
  d,
  leaves,
  children,
}: {
  id: string;
  p: CreamPalette;
  d: string;
  leaves: Array<{ x: number; y: number; r: number; s?: number }>;
  children?: ReactNode;
}) {
  return (
    <g>
      <path d={d} fill="none" stroke={p.sageDeep} strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" />
      {leaves.map((l, i) => (
        <Leaf key={i} id={id} p={p} x={l.x} y={l.y} r={l.r} s={l.s ?? 0.8} />
      ))}
      {children}
    </g>
  );
}

/** Tiny gold sparkle (four-point star) used as dust between flowers. */
export function Sparkle({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -5C0.6 -1.6 1.6 -0.6 5 0C1.6 0.6 0.6 1.6 0 5C-0.6 1.6 -1.6 0.6 -5 0C-1.6 -0.6 -0.6 -1.6 0 -5Z" fill={color} opacity="0.9" />;
}

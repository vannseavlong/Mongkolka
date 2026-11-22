import { mixHex } from "../../chrome/gold";
import type { Theme } from "../../types";

/** Pure helpers for the fairytale skin: colours, flower layout, polaroid tilt, opening timeline. No JSX. */

export const PINK = "#f4c2c9";
export const PINK_DEEP = "#e394a8";
export const LEAF = "#86b5a0";
export const LEAF_DEEP = "#5f9683";
export const MORPHO_DEEP = "#173f94";
export const MORPHO_LIGHT = "#6db5ff";

export interface FairytalePalette {
  sky: string;
  skyLight: string;
  royal: string;
  ink: string;
  white: string;
  /** Hydrangea petal colours, light to deep. */
  blooms: string[];
}

/** Hydrangea petal colours from the accent (royal) and the ground (sky), light to deep, with one pink. */
export function bloomsFor(royal: string, sky: string): string[] {
  return [mixHex(sky, "#ffffff", 40), mixHex(royal, "#ffffff", 38), mixHex(royal, sky, 55), PINK, mixHex(royal, "#ffffff", 62)];
}

/** Everything derives from the 4 theme keys (bg = sky, accent = royal blue, text = ink). */
export function fairytalePalette(theme: Theme): FairytalePalette {
  const royal = theme.accent_color;
  const sky = theme.bg_color;
  return {
    sky,
    skyLight: mixHex(sky, "#ffffff", 45),
    royal,
    ink: theme.text_color,
    white: "#ffffff",
    blooms: bloomsFor(royal, sky),
  };
}

export interface ClusterPoint {
  x: number;
  y: number;
  r: number;
  /** Index into the bloom colours. */
  tint: number;
  rotate: number;
}

/** Small deterministic hash so layouts are stable across renders and server/client (no Math.random). */
export function seeded(seed: number): () => number {
  let s = (seed >>> 0) || 1;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return (s % 10000) / 10000;
  };
}

/** Hydrangea head: florets on a golden-angle spiral inside a circle of `radius`, bigger at the rim. */
export function clusterPoints(count: number, radius: number, seed: number, tints: number): ClusterPoint[] {
  const rnd = seeded(seed);
  const out: ClusterPoint[] = [];
  const n = Math.max(1, Math.floor(count));
  for (let i = 0; i < n; i++) {
    const d = Math.sqrt((i + 0.5) / n) * radius;
    const a = i * 2.399963;
    const base = radius * 0.22;
    out.push({
      x: Math.round(Math.cos(a) * d * 100) / 100,
      y: Math.round(Math.sin(a) * d * 100) / 100,
      r: Math.round((base * (0.78 + 0.34 * (d / radius)) + rnd() * 0.6) * 100) / 100,
      tint: Math.floor(rnd() * Math.max(1, tints)),
      rotate: Math.floor(rnd() * 90),
    });
  }
  return out;
}

/** Polaroid tilt in degrees, alternating sides, 1.5 to 4.5 degrees, stable per index. */
export function polaroidTilt(index: number): number {
  const i = Math.max(0, Math.floor(index));
  const mag = 1.5 + ((i * 7) % 4) * 1;
  return i % 2 === 0 ? -mag : mag;
}

export type StickerKind = "rose" | "hydrangea" | "daisy";
const STICKERS: StickerKind[] = ["rose", "hydrangea", "daisy"];
export type StickerCorner = "tl" | "tr" | "bl" | "br";
const CORNERS: StickerCorner[] = ["tr", "bl", "tl", "br"];

export function stickerFor(index: number): { kind: StickerKind; corner: StickerCorner } {
  const i = Math.max(0, Math.floor(index));
  return { kind: STICKERS[i % STICKERS.length]!, corner: CORNERS[i % CORNERS.length]! };
}

export interface OpeningTimeline {
  /** Cover swing, ms. */
  coverMs: number;
  /** Castle pop-up delay after the swing starts, ms. */
  popAtMs: number;
  /** Start of the zoom into the castle door, ms. */
  zoomAtMs: number;
  zoomMs: number;
  /** When the gate calls onOpen, ms after the tap. */
  doneMs: number;
}

/** Reduced motion skips the 3D swing and the zoom: a short cross-fade, then onOpen. */
export function openingTimeline(reducedMotion: boolean): OpeningTimeline {
  if (reducedMotion) return { coverMs: 0, popAtMs: 0, zoomAtMs: 0, zoomMs: 0, doneMs: 350 };
  return { coverMs: 1300, popAtMs: 700, zoomAtMs: 1700, zoomMs: 1500, doneMs: 3300 };
}

/** Rotation of the cover as it opens (deg); stops short of 180 so the inner face never flattens to a line. */
export const COVER_OPEN_DEG = -168;

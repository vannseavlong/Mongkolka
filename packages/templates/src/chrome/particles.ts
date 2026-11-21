import type { ParticleDensity, ParticleKind } from "./config";

/**
 * Ambient particles as plain data. Deterministic (seeded) so tests are stable and a re-render never
 * reshuffles the field. Counts are capped by screen width, density and device power so low-end
 * phones stay smooth.
 */

export interface Particle {
  id: number;
  kind: ParticleKind;
  /** Horizontal start, percent of viewport width. */
  x: number;
  /** px */
  size: number;
  /** Seconds; negative so the field is already mid-flight on first paint. */
  delay: number;
  /** Seconds for one full pass. */
  duration: number;
  /** Horizontal drift over the pass, px. */
  drift: number;
  /** Total rotation over the pass, deg (petals). */
  rotate: number;
  /** Peak opacity 0..1. */
  opacity: number;
  /** Index into the layer's color list. */
  colorIndex: number;
  /** Mirror horizontally (butterflies). */
  flip: boolean;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE_COUNT: Record<ParticleKind, number> = { petals: 14, butterflies: 4, dust: 26, bokeh: 8 };
const DENSITY_FACTOR: Record<ParticleDensity, number> = { low: 0.55, normal: 1, high: 1.4 };
const HARD_MAX: Record<ParticleKind, number> = { petals: 24, butterflies: 6, dust: 40, bokeh: 12 };

export interface DeviceHints {
  hardwareConcurrency?: number;
  deviceMemory?: number;
}

/** Few cores or little RAM: halve the field. Unknown hints count as "capable". */
export function isLowPowerDevice(hints: DeviceHints = {}): boolean {
  if (hints.hardwareConcurrency !== undefined && hints.hardwareConcurrency <= 4) return true;
  if (hints.deviceMemory !== undefined && hints.deviceMemory <= 2) return true;
  return false;
}

export function particleCount(
  kind: ParticleKind,
  opts: { viewportWidth: number; density?: ParticleDensity; lowPower?: boolean },
): number {
  const narrow = opts.viewportWidth < 480 ? 0.6 : opts.viewportWidth < 900 ? 0.8 : 1;
  const power = opts.lowPower ? 0.5 : 1;
  const raw = BASE_COUNT[kind] * DENSITY_FACTOR[opts.density ?? "normal"] * narrow * power;
  return Math.min(HARD_MAX[kind], Math.max(1, Math.round(raw)));
}

const RANGE: Record<ParticleKind, { size: [number, number]; duration: [number, number]; drift: [number, number]; opacity: [number, number] }> = {
  petals: { size: [10, 18], duration: [12, 22], drift: [-90, 140], opacity: [0.55, 0.9] },
  butterflies: { size: [22, 34], duration: [18, 30], drift: [0, 0], opacity: [0.75, 0.95] },
  dust: { size: [2, 5], duration: [8, 16], drift: [-30, 30], opacity: [0.5, 1] },
  bokeh: { size: [48, 120], duration: [14, 26], drift: [-40, 40], opacity: [0.1, 0.28] },
};

const between = (rand: () => number, [lo, hi]: [number, number]) => lo + rand() * (hi - lo);

export function buildParticles(kind: ParticleKind, count: number, seed: number, colorCount = 1): Particle[] {
  const rand = mulberry32(seed);
  const r = RANGE[kind];
  return Array.from({ length: Math.max(0, count) }, (_, i) => {
    const duration = between(rand, r.duration);
    return {
      id: i,
      kind,
      x: Math.round(rand() * 1000) / 10,
      size: Math.round(between(rand, r.size) * 10) / 10,
      delay: -Math.round(rand() * duration * 10) / 10,
      duration: Math.round(duration * 10) / 10,
      drift: Math.round(between(rand, r.drift)),
      rotate: Math.round((rand() > 0.5 ? 1 : -1) * (180 + rand() * 360)),
      opacity: Math.round(between(rand, r.opacity) * 100) / 100,
      colorIndex: Math.floor(rand() * Math.max(1, colorCount)),
      flip: rand() > 0.5,
    };
  });
}

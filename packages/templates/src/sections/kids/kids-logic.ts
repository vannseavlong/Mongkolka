/**
 * Pure helpers for the kids skin: no JSX, no styling, deterministic (no Math.random, so server and
 * client markup match and tests are stable).
 */

/** Small deterministic generator (mulberry32) seeded from a string. */
export function seeded(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface BurstPiece {
  dx: number;
  dy: number;
  rot: number;
  size: number;
  delay: number;
  tone: number;
}

/** Pieces of the sparkle burst when the invitation is opened: spread evenly around a circle, with jitter. */
export function burstPieces(count: number, radius: number, seed = "kids-burst"): BurstPiece[] {
  const rnd = seeded(seed);
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (rnd() - 0.5) * 0.5;
    const dist = radius * (0.55 + rnd() * 0.6);
    return {
      dx: Math.round(Math.cos(angle) * dist),
      dy: Math.round(Math.sin(angle) * dist),
      rot: Math.round((rnd() - 0.5) * 360),
      size: Math.round(10 + rnd() * 16),
      delay: Math.round(rnd() * 120),
      tone: i % 4,
    };
  });
}

/** How long the opening plays its exit before `onOpen`; 0 when the guest prefers reduced motion. */
export const OPEN_EXIT_MS = 950;
export function exitDelay(reducedMotion: boolean): number {
  return reducedMotion ? 0 : OPEN_EXIT_MS;
}

export interface Sparkle {
  x: number;
  y: number;
  size: number;
  delay: number;
  tone: number;
}

/** Stable scatter of twinkling stars for a section: same id gives the same sky. x and y are percentages. */
export function scatterSparkles(seed: string, count: number): Sparkle[] {
  const rnd = seeded(seed);
  return Array.from({ length: count }, (_, i) => ({
    x: Math.round(rnd() * 96 + 2),
    y: Math.round(rnd() * 96 + 2),
    size: Math.round(9 + rnd() * 13),
    delay: Math.round(rnd() * 28) / 10,
    tone: i % 3,
  }));
}

/** The child's name in the viewer's language: the typed honoree name wins, then the couple's first name. */
export function honoreeName(
  language: "en" | "kh",
  invitationName: { nameKh?: string; nameEn?: string } | undefined,
  fallback: string | undefined,
): { name: string; other: string } {
  const kh = invitationName?.nameKh?.trim() ?? "";
  const en = invitationName?.nameEn?.trim() ?? "";
  const fb = fallback?.trim() ?? "";
  const own = language === "kh" ? kh || en : en || kh;
  const other = language === "kh" ? en : kh;
  const name = own || fb;
  return { name, other: other && other !== name ? other : "" };
}

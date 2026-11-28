/** The envelope hero's storyboard: one source of truth for the CSS delays and the tests. Times in ms from the start. */

export interface Stage {
  at: number;
  ms: number;
}

export const ENVELOPE_STAGES = {
  /** 01 Scene: the background and light fade in. */
  scene: { at: 0, ms: 600 },
  /** 02 Envelope entrance: fade, 20px rise, 0.97 to 1. */
  envelope: { at: 500, ms: 700 },
  /** The seal lets go just before the flap moves. */
  seal: { at: 1100, ms: 280 },
  /** 03 Flap opens. */
  flap: { at: 1200, ms: 1000 },
  /** 04 Card rises out of the envelope and comes forward. */
  card: { at: 1800, ms: 1200 },
  /** 05 Typography, one line at a time (see TYPE_ORDER). */
  type: { at: 2500, ms: 700 },
  /** 06 Final composition: shadows relax. */
  settle: { at: 3500, ms: 1000 },
  /** 07 The card pushes toward the viewer and opens into the full banner photo with the names. */
  banner: { at: 4400, ms: 1400 },
  /** The scroll cue appears last, over the banner. */
  cue: { at: 5400, ms: 600 },
} as const satisfies Record<string, Stage>;

/** Reading order of the card text; names carry the most weight. */
export const TYPE_ORDER = ["label", "names", "divider", "date", "support"] as const;
export type TypeKey = (typeof TYPE_ORDER)[number];

/** Gap between consecutive text elements. */
export const TYPE_STAGGER_MS = 150;

/** When the n-th text element starts. */
export function typeStart(index: number): number {
  return ENVELOPE_STAGES.type.at + Math.max(0, index) * TYPE_STAGGER_MS;
}

/** When the whole sequence has finished. */
export function sequenceEnd(): number {
  const last = typeStart(TYPE_ORDER.length - 1) + ENVELOPE_STAGES.type.ms;
  return Math.max(last, ...Object.values(ENVELOPE_STAGES).map((s) => s.at + s.ms));
}

/** The first letter of a name (the whole first code point, so a Khmer consonant stays one piece), upper-cased for Latin. */
export function initialOf(name: string | undefined): string {
  const ch = Array.from((name ?? "").trim())[0];
  return ch ? ch.toLocaleUpperCase() : "";
}

/** The seal's monogram: both partners' initials joined by "&" ("V&S", "វ&ស"); one initial when there is one name. */
export function sealMonogram(first: string, second?: string): string {
  const a = initialOf(first);
  const b = initialOf(second);
  return a && b ? `${a}&${b}` : a || b;
}

export const SEAL_TEXT_MAX = 8;

const color = (v: string | undefined): string | undefined => (v && /^#[0-9a-f]{6}$/i.test(v.trim()) ? v.trim().toLowerCase() : undefined);

/** The seal badge: the couple's own text and colors, each falling back to automatic (`undefined` color). */
export function sealBadge(content: { sealText?: string; sealColor?: string; sealTextColor?: string } | undefined, first: string, second?: string) {
  const own = Array.from(content?.sealText?.trim() ?? "").slice(0, SEAL_TEXT_MAX).join("");
  return { text: own || sealMonogram(first, second), color: color(content?.sealColor), textColor: color(content?.sealTextColor) };
}

import { MOUL_FONT } from "../../chrome/fonts";

const KHMER = /[ក-៿]/;
export const SCRIPT_FONT = 'var(--font-script), "Great Vibes", cursive';

/** The calligraphic script has no Khmer glyphs, so Khmer names fall back to Moul. Decided per text, not per language. */
export function nameFamily(text: string): string {
  return KHMER.test(text) ? MOUL_FONT : SCRIPT_FONT;
}

export function isKhmerText(text: string): boolean {
  return KHMER.test(text);
}

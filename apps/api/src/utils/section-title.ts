export const SECTION_TITLE_MAX = 80;

export interface SectionTitle {
  kh?: string;
  en?: string;
}

/**
 * Validates a section's own heading. Accepts null (clears it) or an object with `kh` and/or `en` strings; values are
 * trimmed, empty ones dropped, and an object with nothing left becomes null (use the template's wording). Throws an
 * Error with a message the controller maps to a 400.
 */
export function validateSectionTitle(value: unknown): SectionTitle | null {
  if (value === null) return null;
  if (typeof value !== "object" || Array.isArray(value)) throw new Error("title must be an object with kh and en");
  const source = value as Record<string, unknown>;
  const out: SectionTitle = {};
  for (const key of ["kh", "en"] as const) {
    const raw = source[key];
    if (raw === undefined || raw === null) continue;
    if (typeof raw !== "string") throw new Error(`title.${key} must be a string`);
    const trimmed = raw.trim();
    if (trimmed.length > SECTION_TITLE_MAX) throw new Error(`title.${key} must be at most ${SECTION_TITLE_MAX} characters`);
    if (trimmed) out[key] = trimmed;
  }
  return out.kh || out.en ? out : null;
}

/** Pure helpers for the skinned sections. No JSX, no styling. */

/** The love story split into paragraphs on blank lines; empty or whitespace-only text gives []. */
export function paragraphsOf(text: string | undefined | null): string[] {
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

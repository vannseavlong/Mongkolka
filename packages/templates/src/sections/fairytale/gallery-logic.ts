/** Pure photo-list helpers for the polaroid gallery. */

/** Trimmed, de-duplicated, non-empty strings, in order. Anything else is dropped. */
export function cleanPhotos(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of raw) {
    if (typeof v !== "string") continue;
    const s = v.trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

/** Grid columns by photo count: a lone photo stays centred and narrow, pairs sit side by side. */
export function gridClasses(total: number): { cols: string; width: string } {
  if (total <= 1) return { cols: "grid-cols-1", width: "max-w-[15rem]" };
  if (total === 2) return { cols: "grid-cols-2", width: "max-w-xl" };
  return { cols: "grid-cols-2 sm:grid-cols-3", width: "max-w-4xl" };
}

/** Vertical stagger so the wall does not look like a table (full class literals for Tailwind). */
export function staggerClass(i: number, total: number): string {
  if (total <= 1) return "";
  return i % 2 === 1 ? "mt-6 sm:mt-0" : "";
}

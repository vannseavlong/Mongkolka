/** Pure photo-list and layout helpers for the skin-aware gallery and guestbook wall. */

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

/**
 * Per-tile layout classes (full literals for Tailwind): every second tile drops a little so the
 * wall does not read as a table, and an odd last tile centres under the pair on phones.
 */
export function tileClass(i: number, total: number): string {
  if (total <= 1) return "";
  if (total === 2) return i % 2 === 1 ? "mt-6" : "";
  if (total % 2 === 1 && i === total - 1) return "col-span-2 mx-auto w-[calc(50%-0.625rem)] sm:col-span-1 sm:mx-0 sm:w-full";
  const phone = i % 2 === 1 ? "mt-6 sm:mt-0" : "";
  const desk = i % 3 === 1 ? "sm:mt-10" : "";
  return `${phone} ${desk}`.trim();
}

/** Remove failed sources from the list (they are hidden, not shown as broken tiles). */
export function visiblePhotos(all: readonly string[], failed: ReadonlySet<string>, keep?: string | null): string[] {
  return all.filter((s) => !failed.has(s) || s === keep);
}

/** Fill `{n}` / `{total}` style placeholders (pure). */
export function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

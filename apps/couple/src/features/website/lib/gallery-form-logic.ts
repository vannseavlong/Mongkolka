/** Pure rules for the gallery form: file names for the photo list and the layout stack's form <-> content mapping. No React. */

export const HOME_PHOTOS_MIN = 3;
export const HOME_PHOTOS_MAX = 24;

/** Layouts a gallery can stack (mirrors the templates package's STACKABLE_LAYOUTS). */
export const STACK_LAYOUTS = [
  { id: "gallery_grid", label: "Grid" },
  { id: "gallery_masonry", label: "Masonry" },
  { id: "gallery_carousel", label: "Carousel" },
] as const;

export interface StackFormBlock {
  layout: string;
  /** Text of the number box; empty means "the rest". */
  count: string;
}

/** The file name a couple recognises, from a stored path or a full address (query and folders dropped). */
export function photoName(url: string): string {
  const clean = url.split(/[?#]/)[0] ?? "";
  const last = clean.split("/").filter(Boolean).pop() ?? "";
  try {
    return decodeURIComponent(last) || url;
  } catch {
    return last || url;
  }
}

/** Saved `stack` -> form rows. Anything that is not a known layout is ignored. */
export function stackToForm(stack: unknown): StackFormBlock[] {
  if (!Array.isArray(stack)) return [];
  return stack.flatMap((b) => {
    const layout = (b as { layout?: unknown })?.layout;
    if (typeof layout !== "string" || !STACK_LAYOUTS.some((l) => l.id === layout)) return [];
    const count = (b as { count?: unknown }).count;
    return [{ layout, count: typeof count === "number" && count > 0 ? String(count) : "" }];
  });
}

/** Form rows -> saved `stack` (undefined when empty, so the section goes back to its single layout). */
export function stackFromForm(rows: readonly StackFormBlock[]): { layout: string; count?: number }[] | undefined {
  if (rows.length === 0) return undefined;
  return rows.map((r) => {
    const n = Number(r.count.trim());
    return r.count.trim() !== "" && Number.isInteger(n) && n > 0 ? { layout: r.layout, count: n } : { layout: r.layout };
  });
}

export const isWholeCount = (v: string) => v.trim() === "" || (/^\d+$/.test(v.trim()) && Number(v) > 0);

/** A photo link the site can show: an https address or one of our own paths. */
export const isPhotoLink = (v: string) => /^https:\/\/\S+$/i.test(v) || /^\/(uploads|media)\/\S+$/.test(v);

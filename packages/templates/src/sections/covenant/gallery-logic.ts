/** Pure layout rules for the Covenant gallery mosaic. No React. */

/** Photos shown before "show all". A multiple of the 2-col and 4-col rows so the grid ends flush. */
export const GALLERY_PREVIEW = 9;

/** How many tiles are visible now. */
export function visibleCount(total: number, expanded: boolean, preview = GALLERY_PREVIEW): number {
  return expanded ? total : Math.min(total, preview);
}

/** Photos still hidden behind the button (0 when none). */
export function hiddenCount(total: number, expanded: boolean, preview = GALLERY_PREVIEW): number {
  return total - visibleCount(total, expanded, preview);
}

/**
 * Grid shape. Four or fewer photos stay a calm 2-column grid; more become a mosaic where the first photo is
 * a large feature tile and every seventh one after it is wide. Cell classes are full literals (Tailwind).
 */
export function mosaicGrid(total: number): string {
  if (total <= 1) return "grid-cols-1 max-w-[18rem]";
  if (total <= 4) return "grid-cols-2 max-w-xl";
  return "grid-cols-2 sm:grid-cols-4 max-w-4xl [grid-auto-flow:dense]";
}

export function mosaicCell(i: number, total: number): string {
  if (total <= 4) return "aspect-[4/5]";
  if (i === 0) return "col-span-2 row-span-2";
  if (i % 7 === 0) return "col-span-2";
  return "";
}

/** Fewest and most photos the couple can ask the home page to show (the rest sit behind "show all"). */
export const MIN_HOME_PHOTOS = 3;
export const MAX_HOME_PHOTOS = 24;

/** How many photos the invitation page shows: the couple's own `maxPhotos` (whole number, clamped), else `fallback`. */
export function homeLimit(maxPhotos: unknown, fallback = GALLERY_PREVIEW): number {
  const n = typeof maxPhotos === "number" ? maxPhotos : typeof maxPhotos === "string" ? Number(maxPhotos) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.min(MAX_HOME_PHOTOS, Math.max(MIN_HOME_PHOTOS, Math.floor(n)));
}

/** The photos grouped in columns of `size` (the last may be shorter). Used by the sideways masonry. */
export function inColumns<T>(items: readonly T[], size = 2): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** Ratios for a two-photo column: tall over short, then short over tall, so neighbouring columns do not line up. Equal total height. */
export function columnRatios(columnIndex: number, count: number): string[] {
  if (count <= 1) return ["4 / 5"];
  return columnIndex % 2 === 0 ? ["3 / 4", "1 / 1"] : ["1 / 1", "3 / 4"];
}

/** The index of the column nearest the left edge of a scroller, from its scroll offset and column pitch. */
export function activeColumn(scrollLeft: number, pitch: number, columns: number): number {
  if (pitch <= 0 || columns <= 0) return 0;
  return Math.min(columns - 1, Math.max(0, Math.round(scrollLeft / pitch)));
}

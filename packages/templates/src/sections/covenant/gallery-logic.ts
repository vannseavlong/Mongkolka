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

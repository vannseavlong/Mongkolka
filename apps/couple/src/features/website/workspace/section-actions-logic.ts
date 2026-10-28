import type { WebsiteSection } from "../data/schema";

/** Pure helpers behind useSectionActions, kept free of React/SWR so they can be unit tested. */

/** Applies `data` to one section, leaving the rest untouched. */
export function applyPatch(sections: WebsiteSection[], sectionId: string, data: Partial<WebsiteSection>) {
  return sections.map((s) => (s.section_id === sectionId ? { ...s, ...data } : s));
}

/**
 * Undoes a failed patch by restoring only the fields it touched, taken from
 * `before`, so edits made to other sections/fields in the meantime survive.
 */
export function rollbackFields(
  sections: WebsiteSection[],
  before: WebsiteSection,
  touched: (keyof WebsiteSection)[],
) {
  const restore = Object.fromEntries(touched.map((k) => [k, before[k]])) as Partial<WebsiteSection>;
  return applyPatch(sections, before.section_id, restore);
}

/** Moves the section at `index` by `direction`; null when it would leave the list. */
export function reorderSections(sections: WebsiteSection[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (index < 0 || index >= sections.length || target < 0 || target >= sections.length) return null;
  const reordered = [...sections];
  const [moved] = reordered.splice(index, 1);
  reordered.splice(target, 0, moved);
  return {
    optimistic: reordered.map((s, i) => ({ ...s, display_order: i })),
    sectionIds: reordered.map((s) => s.section_id),
    position: target + 1,
  };
}

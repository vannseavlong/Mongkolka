import type { SectionKey } from "../../types";
import { SKIN_IDS, type SkinId } from "../skins";

/**
 * Which skin a template is, read from its default opening/hero component ids
 * (`opening_emerald`, `hero_garden`, ...). No database field is needed: the seeds already name the
 * skin through those ids. Returns null for any other template, which then gets the default set.
 */
export function skinFromComponents(defaults: Partial<Record<SectionKey, string>> | undefined): SkinId | null {
  for (const key of ["opening", "hero"] as const) {
    const id = defaults?.[key];
    const m = id ? /^(?:opening|hero)_([a-z]+)$/.exec(id) : null;
    const skin = m?.[1] as SkinId | undefined;
    if (skin && (SKIN_IDS as readonly string[]).includes(skin)) return skin;
  }
  return null;
}

/** Who a component belongs to, read from its id: `hero_emerald` -> "emerald", `gallery_skin` / `details_khmer` -> shared, anything else -> null (not a skin component). */
export type ComponentOwner = SkinId | "skin" | "khmer" | null;

export function componentOwner(componentId: string): ComponentOwner {
  const suffix = /_([a-z]+)$/.exec(componentId)?.[1];
  if (!suffix) return null;
  if ((SKIN_IDS as readonly string[]).includes(suffix)) return suffix as SkinId;
  return suffix === "skin" || suffix === "khmer" ? suffix : null;
}

/**
 * The style choices that fit a template, so a couple cannot mix one skin's ornaments into another.
 * - Plain templates (skin null): only components that are not skin components.
 * - Skin templates: their own components, the shared `_skin` ones, and plain ones; the shared `_khmer`
 *   ones (wedding wording) are dropped in a section where the skin has its own variant (kids invitation).
 * Needs `section` on each row, as the catalog rows have.
 */
export function variantsForSkin<T extends { component_id: string; section: string }>(rows: readonly T[], skin: SkinId | null): T[] {
  const ownSections = new Set(rows.filter((r) => skin && componentOwner(r.component_id) === skin).map((r) => r.section));
  return rows.filter((r) => {
    const owner = componentOwner(r.component_id);
    if (owner === null) return true;
    if (!skin) return false;
    if (owner === skin || owner === "skin") return true;
    return owner === "khmer" && !ownSections.has(r.section);
  });
}

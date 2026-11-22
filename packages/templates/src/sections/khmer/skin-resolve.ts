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

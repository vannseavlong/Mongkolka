import { sectionRegistry, skinFromComponents, variantsForSkin } from "@mongkolka/templates";
import type { SectionComponent, WebsiteSection, WebsiteSectionKey } from "../data/schema";

/** Display stand-in for a registered style that has no catalog row: "opening_card_covenant" -> "Card covenant". */
export function fallbackVariant(sectionKey: WebsiteSectionKey, componentId: string): Omit<SectionComponent, "status"> {
  const words = componentId.replace(new RegExp(`^${sectionKey}_?`), "").split("_").filter(Boolean).join(" ");
  const name = words ? words.charAt(0).toUpperCase() + words.slice(1) : componentId;
  return { component_id: componentId, section: sectionKey, name, preview_bg_color: null, preview_text_color: null, preview_accent_color: null, font_style: null };
}

/**
 * Every style the couple can pick for one section: the active catalog rows that have a component and fit the template's
 * skin, plus the style in use and the template's own default (so the couple can always go back).
 */
export function listStyleVariants(
  section: Pick<WebsiteSection, "section_key" | "component_id">,
  components: SectionComponent[],
  templateComponents: Partial<Record<string, string>>,
): { variants: SectionComponent[]; currentId: string; defaultId: string | null } {
  const registered = sectionRegistry[section.section_key];
  const defaultId = templateComponents[section.section_key] ?? null;
  const currentId =
    (section.component_id && registered[section.component_id] && section.component_id) ||
    (defaultId && registered[defaultId] && defaultId) ||
    Object.keys(registered)[0];
  const keep = [defaultId, currentId].filter((id, i, all): id is string => !!id && !!registered[id] && all.indexOf(id) === i);
  const candidates = components.filter(
    (c) => c.section === section.section_key && registered[c.component_id] && (c.status === "active" || keep.includes(c.component_id)),
  );
  const fits = new Set(variantsForSkin(candidates, skinFromComponents(templateComponents)).map((c) => c.component_id));
  const listed = candidates.filter((c) => fits.has(c.component_id) || keep.includes(c.component_id));
  const missing: SectionComponent[] = keep
    .filter((id) => !listed.some((c) => c.component_id === id))
    .map((id) => ({ ...fallbackVariant(section.section_key, id), status: "active" as const }));
  return { variants: [...missing, ...listed], currentId, defaultId };
}

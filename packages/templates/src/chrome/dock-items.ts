/**
 * Which buttons the bottom dock shows. Pure: takes the page's sections, returns the buttons.
 * Section keys are plain strings here (not SectionKey) so sections added later, such as
 * `invitation` and `agenda`, work without a change in this file.
 */

export type DockIconName = "invitation" | "agenda" | "map" | "gallery" | "gift" | "wishes" | "rsvp";
export type DockLabelKey = `dock.${DockIconName}`;

export interface DockTarget {
  icon: DockIconName;
  labelKey: DockLabelKey;
}

export const DOCK_TARGETS: Readonly<Record<string, DockTarget>> = {
  invitation: { icon: "invitation", labelKey: "dock.invitation" },
  agenda: { icon: "agenda", labelKey: "dock.agenda" },
  details: { icon: "map", labelKey: "dock.map" },
  gallery: { icon: "gallery", labelKey: "dock.gallery" },
  registry: { icon: "gift", labelKey: "dock.gift" },
  guestbook: { icon: "wishes", labelKey: "dock.wishes" },
  rsvp: { icon: "rsvp", labelKey: "dock.rsvp" },
};

export const DEFAULT_DOCK_KEYS = ["invitation", "agenda", "details", "gallery", "registry", "guestbook"] as const;

/** Six buttons is the most that stays comfortably tappable at 360px. */
export const MAX_DOCK_ITEMS = 6;

export interface DockItem extends DockTarget {
  key: string;
}

export interface DockSectionInput {
  section_key: string;
  enabled: boolean;
  display_order: number;
}

/** Anchor id of a section wrapper; the dock scrolls to it and the scroll-spy watches it. */
export const sectionAnchorId = (sectionKey: string) => `mk-sec-${sectionKey}`;

export function buildDockItems(
  sections: readonly DockSectionInput[],
  include: readonly string[] = DEFAULT_DOCK_KEYS,
  max = MAX_DOCK_ITEMS,
): DockItem[] {
  const wanted = new Set(include);
  const seen = new Set<string>();
  const items: DockItem[] = [];
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.display_order - b.display_order);
  for (const s of ordered) {
    const target = DOCK_TARGETS[s.section_key];
    if (!target || !wanted.has(s.section_key) || seen.has(s.section_key)) continue;
    seen.add(s.section_key);
    items.push({ key: s.section_key, ...target });
  }
  return items.slice(0, Math.max(0, max));
}

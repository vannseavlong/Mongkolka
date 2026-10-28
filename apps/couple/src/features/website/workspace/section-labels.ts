import type { WebsiteSectionKey } from "../data/schema";

/** Couple-facing names for section keys. */
export const SECTION_LABELS: Record<WebsiteSectionKey, string> = {
  opening: "Opening",
  hero: "Hero",
  story: "Our story",
  gallery: "Gallery",
  details: "Event details",
  rsvp: "RSVP",
  registry: "Registry",
  timeline: "Timeline",
  music: "Music",
};

export const sectionLabel = (key: WebsiteSectionKey) => SECTION_LABELS[key] ?? key;

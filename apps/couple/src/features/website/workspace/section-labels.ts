import type { WebsiteSectionKey } from "../data/schema";

/** Couple-facing names for section keys. */
export const SECTION_LABELS: Record<WebsiteSectionKey, string> = {
  opening: "Opening",
  hero: "Hero",
  verse: "Verse",
  story: "Our story",
  gallery: "Gallery",
  details: "Event details",
  rsvp: "RSVP",
  registry: "Registry",
  timeline: "Timeline",
  music: "Music",
  guestbook: "Guestbook",
  footer: "Footer",
};

export const sectionLabel = (key: WebsiteSectionKey) => SECTION_LABELS[key] ?? key;

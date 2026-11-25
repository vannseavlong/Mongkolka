import type { WebsiteSectionKey } from "../data/schema";

/** Couple-facing names for section keys. */
export const SECTION_LABELS: Record<WebsiteSectionKey, string> = {
  cover: "Cover",
  opening: "Opening",
  hero: "Hero",
  invitation: "Invitation",
  verse: "Verse",
  story: "Our story",
  agenda: "Agenda",
  gallery: "Gallery",
  video: "Video",
  details: "Event details",
  rsvp: "RSVP",
  registry: "Gift & QR",
  timeline: "Timeline",
  music: "Music",
  guestbook: "Guestbook",
  letters: "Thank-you letters",
  footer: "Footer",
};

export const sectionLabel = (key: WebsiteSectionKey) => SECTION_LABELS[key] ?? key;

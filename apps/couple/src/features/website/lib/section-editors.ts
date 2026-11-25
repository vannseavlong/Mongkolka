import type { WebsiteSectionKey } from "../data/schema";
import { isProfileSection } from "./profile-section-fields";

/** Sections whose content lives in website_sections.content, edited by SectionContentDialog.
 * See docs/tasks/template.md's "Where each section's content comes from" table. */
export const CONTENT_EDITABLE_SECTIONS: WebsiteSectionKey[] = [
  "cover",
  "opening",
  "gallery",
  "video",
  "registry",
  "timeline",
  "rsvp",
  "music",
  "verse",
  "footer",
  "invitation",
  "agenda",
  "letters",
];

/** True when the builder has an Edit dialog for this section (content or profile backed). */
export const canEditSection = (key: WebsiteSectionKey) =>
  CONTENT_EDITABLE_SECTIONS.includes(key) || isProfileSection(key);

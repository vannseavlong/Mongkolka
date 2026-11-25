import type { WebsiteSectionKey } from "../data/schema";
import type { PreviewProfile } from "./build-content";

/**
 * Sections whose content is the couple's profile, not website_sections.content
 * (see build-content.ts). The builder edits them in a dialog that saves through
 * the profile PATCH, so the couple never has to leave the builder.
 */
export const PROFILE_SECTION_FIELDS = {
  hero: ["partner1_name", "partner2_name", "wedding_date"],
  details: [
    "ceremony_time",
    "ceremony_venue",
    "ceremony_address",
    "reception_time",
    "reception_venue",
    "reception_address",
    "dress_code",
    "map_url",
    "venue_image_url",
  ],
} as const;

export type ProfileSectionKey = keyof typeof PROFILE_SECTION_FIELDS;
export type ProfileFieldName = (typeof PROFILE_SECTION_FIELDS)[ProfileSectionKey][number];
export type ProfileSectionValues = Record<string, string>;

/** Fields that end up as an href/src on the public site: https only (the server checks again). */
const HTTPS_FIELDS: readonly string[] = ["map_url", "venue_image_url"];
export const HTTPS_ERROR = "Must start with https://";

export const isProfileSection = (key: WebsiteSectionKey): key is ProfileSectionKey =>
  Object.prototype.hasOwnProperty.call(PROFILE_SECTION_FIELDS, key);

/** Form values for a section: every field as a string ("" when empty). */
export function profileSectionValues(key: ProfileSectionKey, profile: PreviewProfile): ProfileSectionValues {
  const source = profile as unknown as Record<string, string | null | undefined>;
  return Object.fromEntries(PROFILE_SECTION_FIELDS[key].map((field) => [field, source[field] ?? ""]));
}

/** Field name -> error message for values the server would reject. Empty is always fine. */
export function profileSectionErrors(key: ProfileSectionKey, values: ProfileSectionValues): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of PROFILE_SECTION_FIELDS[key]) {
    const value = (values[field] ?? "").trim();
    if (value && HTTPS_FIELDS.includes(field) && !/^https:\/\//i.test(value)) errors[field] = HTTPS_ERROR;
  }
  return errors;
}

/** PATCH body: only this section's fields, trimmed, "" sent as null so a cleared field is cleared. */
export function profileSectionPayload(key: ProfileSectionKey, values: ProfileSectionValues): Record<string, string | null> {
  return Object.fromEntries(
    PROFILE_SECTION_FIELDS[key].map((field) => [field, (values[field] ?? "").trim() || null]),
  );
}

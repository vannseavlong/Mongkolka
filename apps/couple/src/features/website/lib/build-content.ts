import type { SectionKey } from "@mongkolka/templates";

/**
 * Canonical couple-profile fields hero/story/details are derived from — shared
 * between the full-page preview (website-preview.tsx) and the per-row preview
 * (section-preview.tsx) so the mapping only lives in one place.
 */
export interface PreviewProfile {
  partner1_name: string | null;
  partner2_name: string | null;
  wedding_date: string | null;
  love_story: string | null;
  cover_photo_url: string | null;
  ceremony_time: string | null;
  ceremony_venue: string | null;
  ceremony_address: string | null;
  reception_time: string | null;
  reception_venue: string | null;
  reception_address: string | null;
  dress_code: string | null;
}

/**
 * Maps the couple's canonical profile fields into each section's content
 * shape. Only hero/story/details have a canonical home outside
 * website_sections.content — everything else falls through to `{}` here so
 * SiteRenderer uses that section's own stored `content` instead (see
 * packages/templates/src/site-renderer.tsx).
 */
export function buildPreviewContent(sectionKey: SectionKey, profile: PreviewProfile) {
  switch (sectionKey) {
    case "hero":
      return { coverPhotoUrl: profile.cover_photo_url ?? undefined };
    case "story":
      return { loveStory: profile.love_story ?? undefined };
    case "details":
      return {
        ceremonyTime: profile.ceremony_time ?? undefined,
        ceremonyVenue: profile.ceremony_venue ?? undefined,
        ceremonyAddress: profile.ceremony_address ?? undefined,
        receptionTime: profile.reception_time ?? undefined,
        receptionVenue: profile.reception_venue ?? undefined,
        receptionAddress: profile.reception_address ?? undefined,
        dressCode: profile.dress_code ?? undefined,
      };
    default:
      return {};
  }
}

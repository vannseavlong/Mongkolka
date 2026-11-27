import { z } from "zod";
import type { CoupleProfile } from "../data/schema";

const nullableText = z.string().nullable();
const httpsOnly = z
  .string()
  .nullable()
  .refine((v) => !v || /^https:\/\//i.test(v.trim()), "Must start with https://");

export const profileFormSchema = z.object({
  partner1_name: nullableText,
  partner2_name: nullableText,
  partner2_email: nullableText,
  wedding_date: nullableText,
  love_story: nullableText,
  // Picked from the image library, never typed, so no format rule here. The API validates the venue photo (own
  // file or https); it stores the cover as given, so only library URLs should ever reach it.
  cover_photo_url: nullableText,
  venue_image_url: nullableText,
  ceremony_time: nullableText,
  ceremony_venue: nullableText,
  ceremony_address: nullableText,
  reception_time: nullableText,
  reception_venue: nullableText,
  reception_address: nullableText,
  dress_code: nullableText,
  map_url: httpsOnly,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

/** API profile to form values. Fields the API leaves out (optional columns) become null, never undefined. */
export function toFormValues(p: CoupleProfile): ProfileFormValues {
  return {
    partner1_name: p.partner1_name,
    partner2_name: p.partner2_name,
    partner2_email: p.partner2_email,
    wedding_date: p.wedding_date,
    love_story: p.love_story,
    cover_photo_url: p.cover_photo_url,
    venue_image_url: p.venue_image_url ?? null,
    ceremony_time: p.ceremony_time,
    ceremony_venue: p.ceremony_venue,
    ceremony_address: p.ceremony_address,
    reception_time: p.reception_time,
    reception_venue: p.reception_venue,
    reception_address: p.reception_address,
    dress_code: p.dress_code,
    map_url: p.map_url ?? null,
  };
}

/** What the PATCH sends. A removed photo goes as "" (the way the builder clears one); everything else is as typed. */
export function toPayload(values: ProfileFormValues): ProfileFormValues {
  return {
    ...values,
    cover_photo_url: values.cover_photo_url ?? "",
    venue_image_url: values.venue_image_url ?? "",
  };
}

/** Left-hand navigation: one entry per section card, in page order. */
export const PROFILE_SECTIONS = [
  { id: "couple", label: "The couple" },
  { id: "photos", label: "Photos" },
  { id: "story", label: "Your story" },
  { id: "events", label: "Ceremony & reception" },
  { id: "venue", label: "Map & dress code" },
  { id: "members", label: "People with access" },
  { id: "help", label: "Help from Mongkolka" },
] as const;

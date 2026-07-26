import { z } from "zod";

export const WEBSITE_SECTIONS = [
  "opening",
  "hero",
  "story",
  "gallery",
  "details",
  "rsvp",
  "registry",
  "timeline",
  "music",
] as const;

export const websiteSectionSchema = z.enum(WEBSITE_SECTIONS);
export type WebsiteSection = z.infer<typeof websiteSectionSchema>;

export const sectionComponentSchema = z.object({
  component_id: z.string(),
  section: websiteSectionSchema,
  name: z.string(),
  preview_bg_color: z.string().nullable(),
  preview_text_color: z.string().nullable(),
  preview_accent_color: z.string().nullable(),
  font_style: z.string().nullable(),
  status: z.enum(["active", "inactive"]),
});

export type SectionComponent = z.infer<typeof sectionComponentSchema>;

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

export type WebsiteSectionKey = (typeof WEBSITE_SECTIONS)[number];

export const themeSchema = z.object({
  bg_color: z.string(),
  text_color: z.string(),
  accent_color: z.string(),
  font_style: z.string(),
});

export type Theme = z.infer<typeof themeSchema>;

export const siteTemplateSchema = z.object({
  template_id: z.string(),
  name: z.string(),
  default_theme: themeSchema,
  default_components: z.record(z.string(), z.string()),
  status: z.enum(["active", "inactive"]),
});

export type SiteTemplate = Omit<z.infer<typeof siteTemplateSchema>, "default_components"> & {
  default_components: Partial<Record<WebsiteSectionKey, string>>;
};

export const sectionComponentSchema = z.object({
  component_id: z.string(),
  section: z.enum(WEBSITE_SECTIONS),
  name: z.string(),
  preview_bg_color: z.string().nullable(),
  preview_text_color: z.string().nullable(),
  preview_accent_color: z.string().nullable(),
  font_style: z.string().nullable(),
  status: z.enum(["active", "inactive"]),
});

export type SectionComponent = z.infer<typeof sectionComponentSchema>;

export const websiteSectionSchema = z.object({
  section_id: z.string(),
  section_key: z.enum(WEBSITE_SECTIONS),
  component_id: z.string().nullable(),
  color_override: themeSchema.partial().nullable(),
  display_order: z.number(),
  enabled: z.boolean(),
  content: z.unknown().nullable(),
});

export type WebsiteSection = z.infer<typeof websiteSectionSchema>;

export const websiteSettingsSchema = z.object({
  slug: z.string().nullable(),
  website_status: z.enum(["draft", "published"]),
  site_template_id: z.string().nullable(),
  theme_override: themeSchema.partial().nullable(),
});

export type WebsiteSettings = z.infer<typeof websiteSettingsSchema>;

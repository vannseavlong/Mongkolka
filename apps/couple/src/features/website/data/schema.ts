import { z } from "zod";

export const WEBSITE_SECTIONS = [
  "cover",
  "opening",
  "hero",
  "invitation",
  "verse",
  "story",
  "agenda",
  "gallery",
  "video",
  "details",
  "rsvp",
  "registry",
  "timeline",
  "music",
  "guestbook",
  "letters",
  "note",
  "map",
  "footer",
] as const;

export type WebsiteSectionKey = (typeof WEBSITE_SECTIONS)[number];

export const themeSchema = z.object({
  bg_color: z.string(),
  text_color: z.string(),
  accent_color: z.string(),
  font_style: z.string(),
  font_kh_heading: z.string().optional(),
  font_kh_body: z.string().optional(),
  font_en_heading: z.string().optional(),
  font_en_script: z.string().optional(),
});

export type Theme = z.infer<typeof themeSchema>;

export const siteTemplateSchema = z.object({
  template_id: z.string(),
  name: z.string(),
  slug: z.string().nullish(),
  description: z.string().nullish(),
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
  /** The section's own heading per language; null/absent = the template's wording. */
  title: z.object({ kh: z.string().nullish(), en: z.string().nullish() }).nullish(),
});

export type WebsiteSection = z.infer<typeof websiteSectionSchema>;

export type SiteLanguage = "en" | "kh";

export const websiteSettingsSchema = z.object({
  slug: z.string().nullable(),
  website_status: z.enum(["draft", "published"]),
  site_template_id: z.string().nullable(),
  theme_override: themeSchema.partial().nullable(),
  /** Language the public site opens in. Khmer unless the couple chose English. */
  default_language: z.enum(["en", "kh"]),
});

export type WebsiteSettings = z.infer<typeof websiteSettingsSchema>;

import { z } from "zod";
import type { WebsiteSection } from "@/features/section-components/data/schema";

export const themeSchema = z.object({
  bg_color: z.string(),
  text_color: z.string(),
  accent_color: z.string(),
  font_style: z.string(),
});

export type Theme = z.infer<typeof themeSchema>;

// A plain string-keyed record, not one requiring every WebsiteSection key — not
// every template necessarily has an explicit default for every section yet.
export const siteTemplateSchema = z.object({
  template_id: z.string(),
  name: z.string(),
  default_theme: themeSchema,
  default_components: z.record(z.string(), z.string()),
  status: z.enum(["active", "inactive"]),
});

export type SiteTemplate = Omit<z.infer<typeof siteTemplateSchema>, "default_components"> & {
  default_components: Partial<Record<WebsiteSection, string>>;
};
export type { WebsiteSection };

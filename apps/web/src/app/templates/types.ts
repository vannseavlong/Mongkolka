import type { SectionKey, Theme } from "@mongkolka/templates";

export interface SiteTemplateSummary {
  template_id: string;
  name: string;
  slug?: string;
  description?: string;
  default_theme: Theme;
  default_components: Partial<Record<SectionKey, string>>;
  /** Not in the public API payload yet; when present the preview uses its order and on/off flags. */
  default_sections?: { section_key: SectionKey; enabled: boolean }[] | null;
  status: string;
}

export interface SiteTemplatesResponse {
  templates: SiteTemplateSummary[];
}

export interface SiteTemplateBySlugResponse {
  template: SiteTemplateSummary;
}

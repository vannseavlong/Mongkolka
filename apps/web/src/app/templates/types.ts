import type { SectionKey, Theme } from "@mongkolka/templates";

export interface SiteTemplateSummary {
  template_id: string;
  name: string;
  default_theme: Theme;
  default_components: Partial<Record<SectionKey, string>>;
  status: string;
}

export interface SiteTemplatesResponse {
  templates: SiteTemplateSummary[];
}

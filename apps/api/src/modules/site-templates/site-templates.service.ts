import { SiteTemplatesModel } from "./site-templates.model.js";
import { PublicSiteCache } from "../public-site/public-site.cache.js";

export interface Theme {
  bg_color?: string;
  text_color?: string;
  accent_color?: string;
  font_style?: string;
}

export interface CreateSiteTemplateInput {
  template_id: string;
  name: string;
  default_theme: Theme;
  default_components: Record<string, string>;
}

export interface UpdateSiteTemplateInput {
  name?: string;
  default_theme?: Theme;
  default_components?: Record<string, string>;
  status?: string;
}

export const SiteTemplatesService = {
  list(status?: string) {
    return SiteTemplatesModel.findMany(status ? { status } : undefined);
  },

  create(input: CreateSiteTemplateInput) {
    return SiteTemplatesModel.create({ ...input, status: "active" });
  },

  async update(templateId: string, input: UpdateSiteTemplateInput) {
    await SiteTemplatesModel.update(templateId, { ...input });
    PublicSiteCache.invalidateAll();
    return SiteTemplatesModel.findById(templateId);
  },

  async delete(templateId: string) {
    const result = await SiteTemplatesModel.delete(templateId);
    PublicSiteCache.invalidateAll();
    return result;
  },
};

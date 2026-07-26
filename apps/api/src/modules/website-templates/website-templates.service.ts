import { WebsiteTemplatesModel } from "./website-templates.model.js";

export const WEBSITE_SECTIONS = [
  "hero",
  "story",
  "gallery",
  "details",
  "rsvp",
  "registry",
  "timeline",
  "music",
] as const;

export interface CreateWebsiteTemplateInput {
  template_id: string;
  section: string;
  name: string;
  preview_bg_color?: string;
  preview_text_color?: string;
  preview_accent_color?: string;
  font_style?: string;
}

export interface UpdateWebsiteTemplateInput {
  name?: string;
  preview_bg_color?: string;
  preview_text_color?: string;
  preview_accent_color?: string;
  font_style?: string;
  status?: string;
}

export const WebsiteTemplatesService = {
  list(section?: string, status?: string) {
    const where = { ...(section ? { section } : {}), ...(status ? { status } : {}) };
    return WebsiteTemplatesModel.findMany(Object.keys(where).length ? where : undefined);
  },

  create(input: CreateWebsiteTemplateInput) {
    return WebsiteTemplatesModel.create({ ...input, status: "active" });
  },

  async update(templateId: string, input: UpdateWebsiteTemplateInput) {
    await WebsiteTemplatesModel.update(templateId, { ...input });
    return WebsiteTemplatesModel.findById(templateId);
  },

  delete(templateId: string) {
    return WebsiteTemplatesModel.delete(templateId);
  },
};

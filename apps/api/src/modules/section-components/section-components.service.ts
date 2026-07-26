import { SectionComponentsModel } from "./section-components.model.js";

export const SECTIONS = [
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

export interface CreateSectionComponentInput {
  component_id: string;
  section: string;
  name: string;
  preview_bg_color?: string;
  preview_text_color?: string;
  preview_accent_color?: string;
  font_style?: string;
}

export interface UpdateSectionComponentInput {
  name?: string;
  preview_bg_color?: string;
  preview_text_color?: string;
  preview_accent_color?: string;
  font_style?: string;
  status?: string;
}

export const SectionComponentsService = {
  list(section?: string, status?: string) {
    const where = { ...(section ? { section } : {}), ...(status ? { status } : {}) };
    return SectionComponentsModel.findMany(Object.keys(where).length ? where : undefined);
  },

  create(input: CreateSectionComponentInput) {
    return SectionComponentsModel.create({ ...input, status: "active" });
  },

  async update(componentId: string, input: UpdateSectionComponentInput) {
    await SectionComponentsModel.update(componentId, { ...input });
    return SectionComponentsModel.findById(componentId);
  },

  delete(componentId: string) {
    return SectionComponentsModel.delete(componentId);
  },
};

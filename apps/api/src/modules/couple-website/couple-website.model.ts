import { adminContext, coupleContext } from "../../config/database.js";

export const CoupleWebsiteModel = {
  findTemplates() {
    return adminContext()
      .table("site_templates")
      .findMany({ where: { status: "active" } });
  },

  findTemplateById(templateId: string) {
    return adminContext().table("site_templates").findOne({ where: { template_id: templateId } });
  },

  findComponents() {
    return adminContext()
      .table("section_components")
      .findMany({ where: { status: "active" } });
  },

  findCoupleById(coupleId: string) {
    return adminContext().table("couples").findOne({ where: { couple_id: coupleId } });
  },

  updateWebsiteStatus(coupleId: string, website_status: string) {
    return adminContext()
      .table("couples")
      .update({ where: { couple_id: coupleId }, data: { website_status } });
  },

  findProfile(actorSheetId: string) {
    return coupleContext(actorSheetId).table("couple_profile").findOne();
  },

  createProfile(actorSheetId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId).table("couple_profile").create(data);
  },

  updateProfile(actorSheetId: string, profileId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId)
      .table("couple_profile")
      .update({ where: { profile_id: profileId }, data });
  },

  findSections(actorSheetId: string) {
    return coupleContext(actorSheetId)
      .table("website_sections")
      .findMany({ orderBy: "display_order", order: "asc" });
  },

  findSectionById(actorSheetId: string, sectionId: string) {
    return coupleContext(actorSheetId)
      .table("website_sections")
      .findOne({ where: { section_id: sectionId } });
  },

  createSection(actorSheetId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId).table("website_sections").create(data);
  },

  updateSection(actorSheetId: string, sectionId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId)
      .table("website_sections")
      .update({ where: { section_id: sectionId }, data });
  },

  deleteSection(actorSheetId: string, sectionId: string) {
    return coupleContext(actorSheetId)
      .table("website_sections")
      .delete({ where: { section_id: sectionId } });
  },
};

import { adminContext, coupleContext } from "../../config/database.js";

export const PublicSiteModel = {
  findCoupleBySlug(slug: string) {
    return adminContext().table("couples").findOne({ where: { slug } });
  },

  findProfile(actorSheetId: string) {
    return coupleContext(actorSheetId).table("couple_profile").findOne();
  },

  findSections(actorSheetId: string) {
    return coupleContext(actorSheetId)
      .table("website_sections")
      .findMany({ orderBy: "display_order", order: "asc" });
  },

  findTemplateById(templateId: string) {
    return adminContext().table("site_templates").findOne({ where: { template_id: templateId } });
  },
};

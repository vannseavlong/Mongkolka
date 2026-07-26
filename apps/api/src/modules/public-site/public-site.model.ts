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

  findGuestByName(actorSheetId: string, name: string) {
    return coupleContext(actorSheetId).table("guests").findOne({ where: { name } });
  },

  createGuest(actorSheetId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId).table("guests").create(data);
  },

  updateGuest(actorSheetId: string, guestId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId)
      .table("guests")
      .update({ where: { guest_id: guestId }, data });
  },
};

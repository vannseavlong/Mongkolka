import { adminContext } from "../../config/database.js";

export const SiteTemplatesModel = {
  findMany(where?: Record<string, unknown>) {
    return adminContext().table("site_templates").findMany({ where });
  },

  findById(templateId: string) {
    return adminContext()
      .table("site_templates")
      .findOne({ where: { template_id: templateId } });
  },

  findBySlug(slug: string) {
    return adminContext().table("site_templates").findOne({ where: { slug } });
  },

  /** Used to keep template slugs from colliding with a couple's site slug. */
  findCoupleBySlug(slug: string) {
    return adminContext().table("couples").findOne({ where: { slug } });
  },

  create(data: Record<string, unknown>) {
    return adminContext().table("site_templates").create(data);
  },

  update(templateId: string, data: Record<string, unknown>) {
    return adminContext()
      .table("site_templates")
      .update({ where: { template_id: templateId }, data });
  },

  delete(templateId: string) {
    return adminContext()
      .table("site_templates")
      .delete({ where: { template_id: templateId } });
  },
};

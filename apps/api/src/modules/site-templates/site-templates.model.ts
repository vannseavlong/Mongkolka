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

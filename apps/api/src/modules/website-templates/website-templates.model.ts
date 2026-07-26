import { adminContext } from "../../config/database.js";

export const WebsiteTemplatesModel = {
  findMany(where?: Record<string, unknown>) {
    return adminContext().table("website_templates").findMany({ where });
  },

  findById(templateId: string) {
    return adminContext()
      .table("website_templates")
      .findOne({ where: { template_id: templateId } });
  },

  create(data: Record<string, unknown>) {
    return adminContext().table("website_templates").create(data);
  },

  update(templateId: string, data: Record<string, unknown>) {
    return adminContext()
      .table("website_templates")
      .update({ where: { template_id: templateId }, data });
  },

  delete(templateId: string) {
    return adminContext()
      .table("website_templates")
      .delete({ where: { template_id: templateId } });
  },
};

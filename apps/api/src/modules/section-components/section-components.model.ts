import { adminContext } from "../../config/database.js";

export const SectionComponentsModel = {
  findMany(where?: Record<string, unknown>) {
    return adminContext().table("section_components").findMany({ where });
  },

  findById(componentId: string) {
    return adminContext()
      .table("section_components")
      .findOne({ where: { component_id: componentId } });
  },

  create(data: Record<string, unknown>) {
    return adminContext().table("section_components").create(data);
  },

  update(componentId: string, data: Record<string, unknown>) {
    return adminContext()
      .table("section_components")
      .update({ where: { component_id: componentId }, data });
  },

  delete(componentId: string) {
    return adminContext()
      .table("section_components")
      .delete({ where: { component_id: componentId } });
  },
};

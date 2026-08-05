import { adminContext } from "../../config/database.js";

export const ThemesModel = {
  findMany(where?: Record<string, unknown>) {
    return adminContext().table("themes").findMany({ where });
  },

  findById(themeId: string) {
    return adminContext()
      .table("themes")
      .findOne({ where: { theme_id: themeId } });
  },

  create(data: Record<string, unknown>) {
    return adminContext().table("themes").create(data);
  },

  update(themeId: string, data: Record<string, unknown>) {
    return adminContext()
      .table("themes")
      .update({ where: { theme_id: themeId }, data });
  },

  delete(themeId: string) {
    return adminContext()
      .table("themes")
      .delete({ where: { theme_id: themeId } });
  },
};

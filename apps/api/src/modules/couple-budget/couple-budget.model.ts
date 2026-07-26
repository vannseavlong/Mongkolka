import { coupleContext } from "../../config/database.js";

export const CoupleBudgetModel = {
  findMany(actorSheetId: string) {
    return coupleContext(actorSheetId).table("budget_categories").findMany();
  },

  findById(actorSheetId: string, categoryId: string) {
    return coupleContext(actorSheetId)
      .table("budget_categories")
      .findOne({ where: { category_id: categoryId } });
  },

  create(actorSheetId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId).table("budget_categories").create(data);
  },

  update(actorSheetId: string, categoryId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId)
      .table("budget_categories")
      .update({ where: { category_id: categoryId }, data });
  },

  delete(actorSheetId: string, categoryId: string) {
    return coupleContext(actorSheetId)
      .table("budget_categories")
      .delete({ where: { category_id: categoryId } });
  },
};

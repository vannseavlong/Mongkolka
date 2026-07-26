import { coupleContext } from "../../config/database.js";

export const CoupleChecklistModel = {
  findMany(actorSheetId: string) {
    return coupleContext(actorSheetId).table("checklist_items").findMany();
  },

  findById(actorSheetId: string, itemId: string) {
    return coupleContext(actorSheetId)
      .table("checklist_items")
      .findOne({ where: { item_id: itemId } });
  },

  create(actorSheetId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId).table("checklist_items").create(data);
  },

  update(actorSheetId: string, itemId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId)
      .table("checklist_items")
      .update({ where: { item_id: itemId }, data });
  },

  delete(actorSheetId: string, itemId: string) {
    return coupleContext(actorSheetId)
      .table("checklist_items")
      .delete({ where: { item_id: itemId } });
  },
};

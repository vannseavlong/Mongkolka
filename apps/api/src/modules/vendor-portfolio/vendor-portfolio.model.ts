import { vendorContext } from "../../config/database.js";

export const VendorPortfolioModel = {
  findMany(actorSheetId: string) {
    return vendorContext(actorSheetId)
      .table("portfolio_items")
      .findMany({ orderBy: "display_order", order: "asc" });
  },

  findById(actorSheetId: string, itemId: string) {
    return vendorContext(actorSheetId)
      .table("portfolio_items")
      .findOne({ where: { item_id: itemId } });
  },

  create(actorSheetId: string, data: Record<string, unknown>) {
    return vendorContext(actorSheetId).table("portfolio_items").create(data);
  },

  update(actorSheetId: string, itemId: string, data: Record<string, unknown>) {
    return vendorContext(actorSheetId)
      .table("portfolio_items")
      .update({ where: { item_id: itemId }, data });
  },

  delete(actorSheetId: string, itemId: string) {
    return vendorContext(actorSheetId)
      .table("portfolio_items")
      .delete({ where: { item_id: itemId } });
  },
};

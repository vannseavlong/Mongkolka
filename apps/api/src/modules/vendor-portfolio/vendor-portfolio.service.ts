import { randomUUID } from "node:crypto";
import { VendorPortfolioModel } from "./vendor-portfolio.model.js";

export interface CreatePortfolioItemInput {
  image_url: string;
  caption?: string;
  display_order?: number;
}

export interface UpdatePortfolioItemInput {
  image_url?: string;
  caption?: string;
  display_order?: number;
}

export const VendorPortfolioService = {
  list(actorSheetId: string) {
    return VendorPortfolioModel.findMany(actorSheetId);
  },

  create(actorSheetId: string, input: CreatePortfolioItemInput) {
    return VendorPortfolioModel.create(actorSheetId, {
      item_id: randomUUID(),
      display_order: 0,
      ...input,
    });
  },

  async update(actorSheetId: string, itemId: string, input: UpdatePortfolioItemInput) {
    await VendorPortfolioModel.update(actorSheetId, itemId, { ...input });
    return VendorPortfolioModel.findById(actorSheetId, itemId);
  },

  delete(actorSheetId: string, itemId: string) {
    return VendorPortfolioModel.delete(actorSheetId, itemId);
  },
};

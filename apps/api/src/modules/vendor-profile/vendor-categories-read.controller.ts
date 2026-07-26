import type { Request, Response } from "express";
import { VendorCategoriesModel } from "../vendor-categories/vendor-categories.model.js";

export const VendorCategoriesReadController = {
  async list(_req: Request, res: Response) {
    const categories = await VendorCategoriesModel.findMany();
    res.json({ categories: categories.filter((c) => c.active) });
  },
};

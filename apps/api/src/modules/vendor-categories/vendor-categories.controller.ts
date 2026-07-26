import type { Request, Response } from "express";
import { VendorCategoriesService, type UpdateVendorCategoryInput } from "./vendor-categories.service.js";

export const VendorCategoriesController = {
  async list(_req: Request, res: Response) {
    const categories = await VendorCategoriesService.list();
    res.json({ categories });
  },

  async create(req: Request, res: Response) {
    const { key, label_en, label_kh, icon } = req.body ?? {};
    if (typeof key !== "string" || typeof label_en !== "string") {
      res.status(400).json({ error: "key and label_en are required" });
      return;
    }
    const category = await VendorCategoriesService.create({ key, label_en, label_kh, icon });
    res.status(201).json({ category });
  },

  async update(req: Request, res: Response) {
    const { label_en, label_kh, icon, active } = req.body ?? {};
    const input: UpdateVendorCategoryInput = {};
    if (label_en !== undefined) input.label_en = label_en;
    if (label_kh !== undefined) input.label_kh = label_kh;
    if (icon !== undefined) input.icon = icon;
    if (active !== undefined) input.active = active;

    const updated = await VendorCategoriesService.update(req.params.categoryId as string, input);
    if (!updated) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json({ category: updated });
  },

  async remove(req: Request, res: Response) {
    await VendorCategoriesService.delete(req.params.categoryId as string);
    res.status(204).end();
  },
};

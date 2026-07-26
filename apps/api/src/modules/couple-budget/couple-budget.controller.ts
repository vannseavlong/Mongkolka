import type { Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import { CoupleBudgetService } from "./couple-budget.service.js";

export const CoupleBudgetController = {
  async list(req: CoupleRequest, res: Response) {
    const categories = await CoupleBudgetService.list(req.coupleActorSheetId as string);
    res.json({ categories });
  },

  async create(req: CoupleRequest, res: Response) {
    const { name } = req.body ?? {};
    if (typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const category = await CoupleBudgetService.create(req.coupleActorSheetId as string, req.body);
    res.status(201).json({ category });
  },

  async update(req: CoupleRequest, res: Response) {
    const category = await CoupleBudgetService.update(
      req.coupleActorSheetId as string,
      req.params.categoryId as string,
      req.body ?? {},
    );
    if (!category) {
      res.status(404).json({ error: "Budget category not found" });
      return;
    }
    res.json({ category });
  },

  async remove(req: CoupleRequest, res: Response) {
    await CoupleBudgetService.delete(
      req.coupleActorSheetId as string,
      req.params.categoryId as string,
    );
    res.status(204).end();
  },
};

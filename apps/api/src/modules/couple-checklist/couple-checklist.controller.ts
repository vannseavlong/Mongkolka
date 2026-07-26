import type { Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import { CoupleChecklistService } from "./couple-checklist.service.js";

export const CoupleChecklistController = {
  async list(req: CoupleRequest, res: Response) {
    const items = await CoupleChecklistService.list(req.coupleActorSheetId as string);
    res.json({ items });
  },

  async create(req: CoupleRequest, res: Response) {
    const { text } = req.body ?? {};
    if (typeof text !== "string" || !text.trim()) {
      res.status(400).json({ error: "text is required" });
      return;
    }
    const item = await CoupleChecklistService.create(req.coupleActorSheetId as string, req.body);
    res.status(201).json({ item });
  },

  async update(req: CoupleRequest, res: Response) {
    const item = await CoupleChecklistService.update(
      req.coupleActorSheetId as string,
      req.params.itemId as string,
      req.body ?? {},
    );
    if (!item) {
      res.status(404).json({ error: "Checklist item not found" });
      return;
    }
    res.json({ item });
  },

  async remove(req: CoupleRequest, res: Response) {
    await CoupleChecklistService.delete(req.coupleActorSheetId as string, req.params.itemId as string);
    res.status(204).end();
  },
};

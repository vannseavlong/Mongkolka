import type { Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import { CoupleGuestsService } from "./couple-guests.service.js";

export const CoupleGuestsController = {
  async list(req: CoupleRequest, res: Response) {
    const guests = await CoupleGuestsService.list(req.coupleActorSheetId as string);
    res.json({ guests });
  },

  async create(req: CoupleRequest, res: Response) {
    const { name } = req.body ?? {};
    if (typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const guest = await CoupleGuestsService.create(req.coupleActorSheetId as string, req.body);
    res.status(201).json({ guest });
  },

  async update(req: CoupleRequest, res: Response) {
    const guest = await CoupleGuestsService.update(
      req.coupleActorSheetId as string,
      req.params.guestId as string,
      req.body ?? {},
    );
    if (!guest) {
      res.status(404).json({ error: "Guest not found" });
      return;
    }
    res.json({ guest });
  },

  async remove(req: CoupleRequest, res: Response) {
    await CoupleGuestsService.delete(req.coupleActorSheetId as string, req.params.guestId as string);
    res.status(204).end();
  },
};

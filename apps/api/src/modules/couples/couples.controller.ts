import type { Request, Response } from "express";
import { CouplesService } from "./couples.service.js";

export const CouplesController = {
  async list(req: Request, res: Response) {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const couples = await CouplesService.listCouples(status);
    res.json({ couples });
  },

  async suspend(req: Request, res: Response) {
    const updated = await CouplesService.suspend(req.params.coupleId as string);
    if (!updated) {
      res.status(404).json({ error: "Couple not found" });
      return;
    }
    res.json({ couple: updated });
  },

  async reactivate(req: Request, res: Response) {
    const updated = await CouplesService.reactivate(req.params.coupleId as string);
    if (!updated) {
      res.status(404).json({ error: "Couple not found" });
      return;
    }
    res.json({ couple: updated });
  },
};

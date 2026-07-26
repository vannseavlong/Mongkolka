import type { Request, Response } from "express";
import { OverviewService } from "./overview.service.js";

export const OverviewController = {
  async get(_req: Request, res: Response) {
    const stats = await OverviewService.getStats();
    res.json(stats);
  },
};

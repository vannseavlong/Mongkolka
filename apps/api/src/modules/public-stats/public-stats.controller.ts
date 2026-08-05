import type { Request, Response } from "express";
import { PublicStatsService } from "./public-stats.service.js";

export const PublicStatsController = {
  async list(_req: Request, res: Response) {
    const stats = await PublicStatsService.list();
    res.json({ stats });
  },
};

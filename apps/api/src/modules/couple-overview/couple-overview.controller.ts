import type { Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import { CoupleOverviewService } from "./couple-overview.service.js";

export const CoupleOverviewController = {
  async get(req: CoupleRequest, res: Response) {
    const stats = await CoupleOverviewService.getStats(
      req.coupleId as string,
      req.coupleActorSheetId as string,
    );
    res.json(stats);
  },
};

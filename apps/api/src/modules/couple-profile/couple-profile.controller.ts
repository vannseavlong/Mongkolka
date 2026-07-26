import type { Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import { CoupleProfileService } from "./couple-profile.service.js";

export const CoupleProfileController = {
  async get(req: CoupleRequest, res: Response) {
    const profile = await CoupleProfileService.get(
      req.coupleId as string,
      req.coupleActorSheetId as string,
    );
    res.json({ profile });
  },

  async update(req: CoupleRequest, res: Response) {
    const profile = await CoupleProfileService.update(
      req.coupleId as string,
      req.coupleActorSheetId as string,
      req.body ?? {},
    );
    res.json({ profile });
  },
};

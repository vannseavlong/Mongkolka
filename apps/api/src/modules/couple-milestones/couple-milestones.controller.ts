import type { Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import { CoupleMilestonesService } from "./couple-milestones.service.js";

export const CoupleMilestonesController = {
  async list(req: CoupleRequest, res: Response) {
    const milestones = await CoupleMilestonesService.list(req.coupleActorSheetId as string);
    res.json({ milestones });
  },

  async create(req: CoupleRequest, res: Response) {
    const { title, months_before } = req.body ?? {};
    if (typeof title !== "string" || !title.trim() || typeof months_before !== "number") {
      res.status(400).json({ error: "title and months_before are required" });
      return;
    }
    const milestone = await CoupleMilestonesService.create(req.coupleActorSheetId as string, req.body);
    res.status(201).json({ milestone });
  },

  async update(req: CoupleRequest, res: Response) {
    const milestone = await CoupleMilestonesService.update(
      req.coupleActorSheetId as string,
      req.params.milestoneId as string,
      req.body ?? {},
    );
    if (!milestone) {
      res.status(404).json({ error: "Milestone not found" });
      return;
    }
    res.json({ milestone });
  },

  async remove(req: CoupleRequest, res: Response) {
    await CoupleMilestonesService.delete(
      req.coupleActorSheetId as string,
      req.params.milestoneId as string,
    );
    res.status(204).end();
  },
};

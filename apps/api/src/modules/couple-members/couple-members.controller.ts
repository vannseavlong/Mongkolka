import type { Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import { CoupleMembersService } from "./couple-members.service.js";

export const CoupleMembersController = {
  async list(req: CoupleRequest, res: Response) {
    const members = await CoupleMembersService.list(req.coupleId as string);
    res.json({ members });
  },

  async invite(req: CoupleRequest, res: Response) {
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
    if (!email) {
      res.status(400).json({ error: "email is required" });
      return;
    }
    try {
      const member = await CoupleMembersService.invite(
        req.coupleId as string,
        req.coupleActorSheetId as string,
        req.user?.user_id as string,
        email,
      );
      res.status(201).json({ member });
    } catch (err) {
      res.status(409).json({ error: (err as Error).message });
    }
  },

  async remove(req: CoupleRequest, res: Response) {
    try {
      const removed = await CoupleMembersService.remove(
        req.coupleId as string,
        req.params.memberId as string,
      );
      if (!removed) {
        res.status(404).json({ error: "Member not found" });
        return;
      }
      res.status(204).end();
    } catch (err) {
      res.status(409).json({ error: (err as Error).message });
    }
  },
};

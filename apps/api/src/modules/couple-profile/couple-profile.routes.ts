import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { CoupleProfileController } from "./couple-profile.controller.js";

export const coupleProfileRouter = Router();

coupleProfileRouter.use(requireAuth(), requireRole("couple"), requireActiveCouple);
coupleProfileRouter.get("/profile", CoupleProfileController.get);
coupleProfileRouter.patch("/profile", CoupleProfileController.update);

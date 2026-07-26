import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { CoupleOverviewController } from "./couple-overview.controller.js";

export const coupleOverviewRouter = Router();

coupleOverviewRouter.use(requireAuth(), requireRole("couple"), requireActiveCouple);
coupleOverviewRouter.get("/overview", CoupleOverviewController.get);

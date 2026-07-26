import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { CoupleChecklistController } from "./couple-checklist.controller.js";

export const coupleChecklistRouter = Router();

coupleChecklistRouter.use(requireAuth(), requireRole("couple"), requireActiveCouple);
coupleChecklistRouter.get("/checklist-items", CoupleChecklistController.list);
coupleChecklistRouter.post("/checklist-items", CoupleChecklistController.create);
coupleChecklistRouter.patch("/checklist-items/:itemId", CoupleChecklistController.update);
coupleChecklistRouter.delete("/checklist-items/:itemId", CoupleChecklistController.remove);

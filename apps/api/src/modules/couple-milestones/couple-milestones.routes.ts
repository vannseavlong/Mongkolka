import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { CoupleMilestonesController } from "./couple-milestones.controller.js";

export const coupleMilestonesRouter = Router();

coupleMilestonesRouter.use(requireAuth(), requireRole("couple"), requireActiveCouple);
coupleMilestonesRouter.get("/milestones", CoupleMilestonesController.list);
coupleMilestonesRouter.post("/milestones", CoupleMilestonesController.create);
coupleMilestonesRouter.patch("/milestones/:milestoneId", CoupleMilestonesController.update);
coupleMilestonesRouter.delete("/milestones/:milestoneId", CoupleMilestonesController.remove);

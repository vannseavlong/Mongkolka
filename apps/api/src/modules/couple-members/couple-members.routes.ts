import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { CoupleMembersController } from "./couple-members.controller.js";

export const coupleMembersRouter = Router();

coupleMembersRouter.use(requireAuth(), requireRole("couple"), requireActiveCouple);
coupleMembersRouter.get("/members", CoupleMembersController.list);
coupleMembersRouter.post("/members/invite", CoupleMembersController.invite);
coupleMembersRouter.delete("/members/:memberId", CoupleMembersController.remove);

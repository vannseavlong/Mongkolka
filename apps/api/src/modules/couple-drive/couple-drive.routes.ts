import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { CoupleDriveController } from "./couple-drive.controller.js";

/** Mounted under /couple/api. */
export const coupleDriveRouter = Router();

// Google's redirect carries no session, so it is registered before the authenticated routes.
coupleDriveRouter.get("/drive/callback", CoupleDriveController.callback);

const guard = [requireAuth(), requireRole("couple"), requireActiveCouple];
coupleDriveRouter.get("/drive", ...guard, CoupleDriveController.status);
coupleDriveRouter.post("/drive/connect", ...guard, CoupleDriveController.connect);
coupleDriveRouter.delete("/drive", ...guard, CoupleDriveController.disconnect);

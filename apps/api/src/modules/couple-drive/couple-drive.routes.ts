import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { CoupleDriveController } from "./couple-drive.controller.js";

/**
 * Google's redirect back carries no session (the signed `state` identifies the couple), so this route must be
 * reachable without a login token. It is mounted on its own, FIRST in routes/couple-api.routes.ts: the other couple
 * routers apply their login check to every request that passes through them, so a public route mounted after them
 * is answered with "Missing bearer token" before it is reached.
 */
export const coupleDriveCallbackRouter = Router();
coupleDriveCallbackRouter.get("/drive/callback", CoupleDriveController.callback);

/** Mounted under /couple/api, after the public callback. */
export const coupleDriveRouter = Router();

const guard = [requireAuth({ allowAssist: true }), requireRole("couple"), requireActiveCouple];
coupleDriveRouter.get("/drive", ...guard, CoupleDriveController.status);
coupleDriveRouter.post("/drive/connect", ...guard, CoupleDriveController.connect);
coupleDriveRouter.delete("/drive", ...guard, CoupleDriveController.disconnect);

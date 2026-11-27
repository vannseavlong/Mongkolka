import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveAdmin } from "../../middlewares/admin-context.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { AdminAssistController, CoupleAssistController } from "./assist.controller.js";
import { createAssistRateLimit, requirePartner } from "./assist.guard.js";

/** Mounted under /couple/api. */
export const coupleAssistRouter = Router();
coupleAssistRouter.use("/assist", requireAuth(), requireRole("couple"), requireActiveCouple, createAssistRateLimit());
coupleAssistRouter.get("/assist", CoupleAssistController.get);
// Asking for an admin to edit the whole site is a partner's decision; any member may take access away.
coupleAssistRouter.post("/assist", requirePartner, CoupleAssistController.create);
coupleAssistRouter.post("/assist/cancel", requirePartner, CoupleAssistController.cancel);
coupleAssistRouter.post("/assist/revoke", CoupleAssistController.revoke);

/** Mounted under /admin/api, after the admin role check in routes/admin-api.routes.ts. */
export const adminAssistRouter = Router();
const adminGuard = [requireActiveAdmin, createAssistRateLimit()];
adminAssistRouter.get("/assist-requests", ...adminGuard, AdminAssistController.list);
adminAssistRouter.post("/assist-requests/:requestId/accept", ...adminGuard, AdminAssistController.accept);
adminAssistRouter.post("/assist-requests/:requestId/decline", ...adminGuard, AdminAssistController.decline);
adminAssistRouter.post("/assist-requests/:requestId/revoke", ...adminGuard, AdminAssistController.revoke);

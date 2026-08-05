import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { SessionController } from "../auth/session.controller.js";

// Mounted separately from the rest of couple-api's modules — every other
// module chains requireActiveCouple, which 403s a pending account. This one
// exists specifically so a pending account's dashboard can ask "am I active
// yet?" without hitting that wall.
export const coupleSessionRouter = Router();

coupleSessionRouter.use(requireAuth(), requireRole("couple"));
coupleSessionRouter.get("/session", SessionController.get);

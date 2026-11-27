import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { SessionController } from "../auth/session.controller.js";

// Mounted separately from the rest of couple-api's modules — every other
// module chains requireActiveCouple, which 403s a pending account. This one
// exists specifically so a pending account's dashboard can ask "am I active
// yet?" without hitting that wall.
export const coupleSessionRouter = Router();

// An assisted token may read its own status here (the couple app asks it for the account status). It returns only
// that status, and this route deliberately skips requireActiveCouple so a pending account can reach it.
coupleSessionRouter.use(requireAuth({ allowAssist: true }), requireRole("couple"));
coupleSessionRouter.get("/session", SessionController.get);

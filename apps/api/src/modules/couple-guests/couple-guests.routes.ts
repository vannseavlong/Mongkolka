import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { CoupleGuestsController } from "./couple-guests.controller.js";

export const coupleGuestsRouter = Router();

coupleGuestsRouter.use(requireAuth(), requireRole("couple"), requireActiveCouple);
coupleGuestsRouter.get("/guests", CoupleGuestsController.list);
coupleGuestsRouter.post("/guests", CoupleGuestsController.create);
coupleGuestsRouter.patch("/guests/:guestId", CoupleGuestsController.update);
coupleGuestsRouter.delete("/guests/:guestId", CoupleGuestsController.remove);

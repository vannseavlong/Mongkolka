import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { CoupleGuestWishesController, PublicGuestWishesController } from "./guest-wishes.controller.js";

export const publicGuestWishesRouter = Router();
publicGuestWishesRouter.get("/site/:slug/wishes", PublicGuestWishesController.list);
publicGuestWishesRouter.post("/site/:slug/wishes", PublicGuestWishesController.submit);

export const coupleGuestWishesRouter = Router();
coupleGuestWishesRouter.use(requireAuth(), requireRole("couple"), requireActiveCouple);
coupleGuestWishesRouter.get("/wishes", CoupleGuestWishesController.list);
coupleGuestWishesRouter.patch("/wishes/:wishId", CoupleGuestWishesController.setStatus);
coupleGuestWishesRouter.delete("/wishes/:wishId", CoupleGuestWishesController.remove);
coupleGuestWishesRouter.post("/wishes/:wishId/record-gift", CoupleGuestWishesController.recordGift);

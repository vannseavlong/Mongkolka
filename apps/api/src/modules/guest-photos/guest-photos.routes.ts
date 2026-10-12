import express, { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { CoupleGuestPhotosController, PublicGuestPhotosController } from "./guest-photos.controller.js";
import { PHOTO_CEILINGS } from "./guest-photos.limits.js";

/** Mounted under /public/api. Body is the raw image bytes, not multipart/JSON. */
export const publicGuestPhotosRouter = Router();
publicGuestPhotosRouter.get("/site/:slug/photos", PublicGuestPhotosController.list);
publicGuestPhotosRouter.post(
  "/site/:slug/photos",
  express.raw({
    type: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    // Hard ceiling at the parser; the couple's own (lower) size limit is enforced in the service.
    limit: `${PHOTO_CEILINGS.maxSizeMb}mb`,
  }),
  PublicGuestPhotosController.upload,
);

/** Mounted under /couple/api. */
export const coupleGuestPhotosRouter = Router();
coupleGuestPhotosRouter.use(requireAuth(), requireRole("couple"), requireActiveCouple);
coupleGuestPhotosRouter.get("/photos", CoupleGuestPhotosController.list);
coupleGuestPhotosRouter.post("/photos/bulk-delete", CoupleGuestPhotosController.removeMany);
coupleGuestPhotosRouter.patch("/photos/:photoId", CoupleGuestPhotosController.setStatus);
coupleGuestPhotosRouter.delete("/photos/:photoId", CoupleGuestPhotosController.remove);

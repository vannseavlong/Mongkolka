import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { singleFileUpload } from "../../middlewares/multipart-upload.middleware.js";
import { WebsiteAssetsController } from "./website-assets.controller.js";
import { ASSET_LIMITS } from "./website-assets.limits.js";

/** Mounted under /couple/api. */
export const websiteAssetsRouter = Router();
websiteAssetsRouter.use("/website/assets", requireAuth(), requireRole("couple"), requireActiveCouple);
websiteAssetsRouter.get("/website/assets", WebsiteAssetsController.list);
websiteAssetsRouter.post(
  "/website/assets",
  singleFileUpload("file", ASSET_LIMITS.maxBytes),
  WebsiteAssetsController.upload,
);
websiteAssetsRouter.get("/website/assets/:id/usage", WebsiteAssetsController.usage);
websiteAssetsRouter.delete("/website/assets/:id", WebsiteAssetsController.remove);

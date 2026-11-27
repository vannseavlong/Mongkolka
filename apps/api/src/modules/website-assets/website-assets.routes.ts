import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { singleFileUpload } from "../../middlewares/multipart-upload.middleware.js";
import { WebsiteAssetsController } from "./website-assets.controller.js";
import { PlatformSettingsService } from "../platform-settings/platform-settings.service.js";

/** Mounted under /couple/api. */
export const websiteAssetsRouter = Router();
websiteAssetsRouter.use("/website/assets", requireAuth({ allowAssist: true }), requireRole("couple"), requireActiveCouple);
websiteAssetsRouter.get("/website/assets/limits", WebsiteAssetsController.limits);
websiteAssetsRouter.get("/website/assets", WebsiteAssetsController.list);
websiteAssetsRouter.post(
  "/website/assets",
  singleFileUpload("file", async () => (await PlatformSettingsService.getAssetLimits()).maxBytes),
  WebsiteAssetsController.upload,
);
websiteAssetsRouter.get("/website/assets/:id/usage", WebsiteAssetsController.usage);
websiteAssetsRouter.delete("/website/assets/:id", WebsiteAssetsController.remove);

import { Router } from "express";
import { PlatformSettingsController } from "./platform-settings.controller.js";

/** Mounted under /admin/api (admin auth is applied by the parent router). */
export const platformSettingsRouter = Router();

platformSettingsRouter.get("/settings/uploads", PlatformSettingsController.getUploads);
platformSettingsRouter.patch("/settings/uploads", PlatformSettingsController.updateUploads);

import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { CoupleWebsiteController } from "./couple-website.controller.js";

export const coupleWebsiteRouter = Router();

coupleWebsiteRouter.use(requireAuth(), requireRole("couple"), requireActiveCouple);
coupleWebsiteRouter.get("/website/catalog", CoupleWebsiteController.getCatalog);
coupleWebsiteRouter.get("/website/settings", CoupleWebsiteController.getSettings);
coupleWebsiteRouter.patch("/website/slug", CoupleWebsiteController.updateSlug);
coupleWebsiteRouter.post("/website/template", CoupleWebsiteController.selectTemplate);
coupleWebsiteRouter.patch("/website/theme", CoupleWebsiteController.updateTheme);
coupleWebsiteRouter.get("/website/sections", CoupleWebsiteController.listSections);
coupleWebsiteRouter.patch("/website/sections/:sectionId", CoupleWebsiteController.updateSection);
coupleWebsiteRouter.post("/website/sections/reorder", CoupleWebsiteController.reorderSections);
coupleWebsiteRouter.post("/website/publish", CoupleWebsiteController.publish);
coupleWebsiteRouter.post("/website/unpublish", CoupleWebsiteController.unpublish);

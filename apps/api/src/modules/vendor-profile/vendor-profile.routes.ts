import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveVendor } from "../../middlewares/vendor-context.middleware.js";
import { VendorProfileController } from "./vendor-profile.controller.js";
import { VendorCategoriesReadController } from "./vendor-categories-read.controller.js";

export const vendorProfileRouter = Router();

vendorProfileRouter.use(requireAuth(), requireRole("vendor"), requireActiveVendor);
vendorProfileRouter.get("/profile", VendorProfileController.get);
vendorProfileRouter.patch("/profile", VendorProfileController.update);
vendorProfileRouter.get("/categories", VendorCategoriesReadController.list);

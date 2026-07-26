import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveVendor } from "../../middlewares/vendor-context.middleware.js";
import { VendorPortfolioController } from "./vendor-portfolio.controller.js";

export const vendorPortfolioRouter = Router();

vendorPortfolioRouter.use(requireAuth(), requireRole("vendor"), requireActiveVendor);
vendorPortfolioRouter.get("/portfolio", VendorPortfolioController.list);
vendorPortfolioRouter.post("/portfolio", VendorPortfolioController.create);
vendorPortfolioRouter.patch("/portfolio/:itemId", VendorPortfolioController.update);
vendorPortfolioRouter.delete("/portfolio/:itemId", VendorPortfolioController.remove);

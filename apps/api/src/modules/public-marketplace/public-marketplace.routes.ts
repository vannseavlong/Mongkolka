import { Router } from "express";
import { PublicMarketplaceController } from "./public-marketplace.controller.js";

export const publicMarketplaceRouter = Router();

publicMarketplaceRouter.get("/vendor-categories", PublicMarketplaceController.listCategories);
publicMarketplaceRouter.get("/vendors", PublicMarketplaceController.listVendors);
publicMarketplaceRouter.get("/vendors/:vendorId", PublicMarketplaceController.getVendor);
publicMarketplaceRouter.get("/site-templates", PublicMarketplaceController.listTemplates);

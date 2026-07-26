import { Router } from "express";
import { vendorProfileRouter } from "../modules/vendor-profile/vendor-profile.routes.js";
import { vendorPortfolioRouter } from "../modules/vendor-portfolio/vendor-portfolio.routes.js";
import { vendorServicesRouter } from "../modules/vendor-services/vendor-services.routes.js";
import { vendorBookingsRouter } from "../modules/vendor-bookings/vendor-bookings.routes.js";

export const vendorApiRouter = Router();

vendorApiRouter.use(vendorProfileRouter);
vendorApiRouter.use(vendorPortfolioRouter);
vendorApiRouter.use(vendorServicesRouter);
vendorApiRouter.use(vendorBookingsRouter);

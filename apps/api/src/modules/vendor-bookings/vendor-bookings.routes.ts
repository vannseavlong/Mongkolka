import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveVendor } from "../../middlewares/vendor-context.middleware.js";
import { VendorBookingsController } from "./vendor-bookings.controller.js";

export const vendorBookingsRouter = Router();

vendorBookingsRouter.use(requireAuth(), requireRole("vendor"), requireActiveVendor);
vendorBookingsRouter.get("/bookings", VendorBookingsController.list);

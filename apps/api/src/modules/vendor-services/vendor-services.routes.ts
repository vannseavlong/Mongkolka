import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveVendor } from "../../middlewares/vendor-context.middleware.js";
import { VendorServicesController } from "./vendor-services.controller.js";

export const vendorServicesRouter = Router();

vendorServicesRouter.use(requireAuth(), requireRole("vendor"), requireActiveVendor);
vendorServicesRouter.get("/services", VendorServicesController.list);
vendorServicesRouter.post("/services", VendorServicesController.create);
vendorServicesRouter.patch("/services/:serviceId", VendorServicesController.update);
vendorServicesRouter.delete("/services/:serviceId", VendorServicesController.remove);

import { Router } from "express";
import { VendorsController } from "./vendors.controller.js";

export const vendorsRouter = Router();

vendorsRouter.get("/vendors", VendorsController.list);
vendorsRouter.post("/vendors/:vendorId/suspend", VendorsController.suspend);
vendorsRouter.post("/vendors/:vendorId/reactivate", VendorsController.reactivate);

import { Router } from "express";
import { VendorCategoriesController } from "./vendor-categories.controller.js";

export const vendorCategoriesRouter = Router();

vendorCategoriesRouter.get("/vendor-categories", VendorCategoriesController.list);
vendorCategoriesRouter.post("/vendor-categories", VendorCategoriesController.create);
vendorCategoriesRouter.patch("/vendor-categories/:categoryId", VendorCategoriesController.update);
vendorCategoriesRouter.delete("/vendor-categories/:categoryId", VendorCategoriesController.remove);

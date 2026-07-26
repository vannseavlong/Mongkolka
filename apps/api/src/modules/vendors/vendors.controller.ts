import type { Request, Response } from "express";
import { VendorsService } from "./vendors.service.js";

export const VendorsController = {
  async list(req: Request, res: Response) {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const categoryId = typeof req.query.category_id === "string" ? req.query.category_id : undefined;
    const vendors = await VendorsService.listVendors(status, categoryId);
    res.json({ vendors });
  },

  async suspend(req: Request, res: Response) {
    const updated = await VendorsService.suspend(req.params.vendorId as string);
    if (!updated) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }
    res.json({ vendor: updated });
  },

  async reactivate(req: Request, res: Response) {
    const updated = await VendorsService.reactivate(req.params.vendorId as string);
    if (!updated) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }
    res.json({ vendor: updated });
  },
};

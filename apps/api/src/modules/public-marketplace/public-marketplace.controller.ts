import type { Request, Response } from "express";
import { PublicMarketplaceService } from "./public-marketplace.service.js";

function parsePage(value: unknown, fallback: number, max: number) {
  const n = typeof value === "string" ? parseInt(value, 10) : NaN;
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, max);
}

export const PublicMarketplaceController = {
  async listCategories(_req: Request, res: Response) {
    const categories = await PublicMarketplaceService.listCategories();
    res.json({ categories });
  },

  async listVendors(req: Request, res: Response) {
    const categoryId = typeof req.query.category === "string" ? req.query.category : undefined;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const page = parsePage(req.query.page, 1, 1000);
    const pageSize = parsePage(req.query.pageSize, 12, 48);

    const result = await PublicMarketplaceService.listVendors({ categoryId, search, page, pageSize });
    res.json(result);
  },

  async getVendor(req: Request, res: Response) {
    const result = await PublicMarketplaceService.getVendor(req.params.vendorId as string);
    if (!result) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }
    res.json(result);
  },

  async listTemplates(_req: Request, res: Response) {
    const templates = await PublicMarketplaceService.listTemplates();
    res.json({ templates });
  },
};

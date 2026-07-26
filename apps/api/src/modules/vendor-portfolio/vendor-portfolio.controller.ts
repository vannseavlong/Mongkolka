import type { Response } from "express";
import type { VendorRequest } from "../../middlewares/vendor-context.middleware.js";
import { VendorPortfolioService } from "./vendor-portfolio.service.js";

export const VendorPortfolioController = {
  async list(req: VendorRequest, res: Response) {
    const items = await VendorPortfolioService.list(req.vendorActorSheetId as string);
    res.json({ items });
  },

  async create(req: VendorRequest, res: Response) {
    const { image_url, caption, display_order } = req.body ?? {};
    if (typeof image_url !== "string") {
      res.status(400).json({ error: "image_url is required" });
      return;
    }
    const item = await VendorPortfolioService.create(req.vendorActorSheetId as string, {
      image_url,
      caption,
      display_order,
    });
    res.status(201).json({ item });
  },

  async update(req: VendorRequest, res: Response) {
    const { image_url, caption, display_order } = req.body ?? {};
    const input: Record<string, unknown> = {};
    if (image_url !== undefined) input.image_url = image_url;
    if (caption !== undefined) input.caption = caption;
    if (display_order !== undefined) input.display_order = display_order;

    const item = await VendorPortfolioService.update(
      req.vendorActorSheetId as string,
      req.params.itemId as string,
      input,
    );
    if (!item) {
      res.status(404).json({ error: "Portfolio item not found" });
      return;
    }
    res.json({ item });
  },

  async remove(req: VendorRequest, res: Response) {
    await VendorPortfolioService.delete(req.vendorActorSheetId as string, req.params.itemId as string);
    res.status(204).end();
  },
};

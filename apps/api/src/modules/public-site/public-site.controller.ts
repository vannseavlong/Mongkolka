import type { Request, Response } from "express";
import { PublicSiteService } from "./public-site.service.js";

export const PublicSiteController = {
  async get(req: Request, res: Response) {
    const site = await PublicSiteService.getSite(req.params.slug as string);
    if (!site) {
      res.status(404).json({ error: "Site not found" });
      return;
    }
    res.json(site);
  },
};

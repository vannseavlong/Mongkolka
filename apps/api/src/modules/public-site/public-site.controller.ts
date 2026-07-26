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

  async submitRsvp(req: Request, res: Response) {
    const { name, attending, plusOne, message } = req.body ?? {};
    if (typeof name !== "string" || !name.trim() || typeof attending !== "boolean") {
      res.status(400).json({ error: "name and attending are required" });
      return;
    }
    const ok = await PublicSiteService.submitRsvp(req.params.slug as string, {
      name,
      attending,
      plusOne: Boolean(plusOne),
      message: typeof message === "string" ? message : undefined,
    });
    if (!ok) {
      res.status(404).json({ error: "Site not found" });
      return;
    }
    res.status(201).json({ ok: true });
  },
};

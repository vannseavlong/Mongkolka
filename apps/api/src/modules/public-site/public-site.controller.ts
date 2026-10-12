import type { Request, Response } from "express";
import { RateLimiter } from "../../utils/rate-limit.js";
import { PublicSiteService } from "./public-site.service.js";

// Per slug+IP. Generous enough for a family sharing one phone/Wi-Fi, tight enough that a
// script can't flood a couple's guest list or burn their Sheets write quota.
const RSVP_PER_IP_PER_HOUR = 20;
const rsvpLimiter = new RateLimiter(60 * 60 * 1000);

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
    if (!rsvpLimiter.hit(`${req.params.slug}:${req.ip}`, RSVP_PER_IP_PER_HOUR)) {
      res.status(429).json({ error: "rate_limited" });
      return;
    }
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

import type { Request, Response } from "express";
import { RateLimiter } from "../../utils/rate-limit.js";
import { PublicSiteService } from "./public-site.service.js";

// Per slug+IP. Generous enough for a family sharing one phone/Wi-Fi, tight enough that a
// script can't flood a couple's guest list or burn their Sheets write quota.
const RSVP_PER_IP_PER_HOUR = 20;
const rsvpLimiter = new RateLimiter(60 * 60 * 1000);
// Domain lookups: a browser asks once per page load on a custom domain.
const DOMAIN_LOOKUPS_PER_IP_PER_MINUTE = 60;
const domainLimiter = new RateLimiter(60 * 1000);
// Lower-case DNS hostname: dot-separated labels of 1-63 chars, no leading/trailing hyphen.
const HOSTNAME_PATTERN = /^(?=.{4,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

export const PublicSiteController = {
  async get(req: Request, res: Response) {
    const site = await PublicSiteService.getSite(req.params.slug as string);
    if (!site) {
      res.status(404).json({ error: "Site not found" });
      return;
    }
    res.json(site);
  },

  async byDomain(req: Request, res: Response) {
    if (!domainLimiter.hit(req.ip ?? "unknown", DOMAIN_LOOKUPS_PER_IP_PER_MINUTE)) {
      res.status(429).json({ error: "rate_limited" });
      return;
    }
    const domain = String(req.params.domain ?? "").trim().toLowerCase().replace(/\.$/, "");
    // Hostname shape only; never look up arbitrary strings.
    if (!HOSTNAME_PATTERN.test(domain)) {
      res.status(404).json({ error: "Site not found" });
      return;
    }
    const slug = await PublicSiteService.slugForDomain(domain);
    if (!slug) {
      res.status(404).json({ error: "Site not found" });
      return;
    }
    res.json({ slug });
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

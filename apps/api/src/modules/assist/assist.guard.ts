import type { NextFunction, Request, Response } from "express";
import { RateLimiter } from "../../utils/rate-limit.js";

/**
 * Kept free of database imports so the rules can be unit-tested. The couple's `memberRole` is set by
 * requireActiveCouple, which must run first.
 */

/** Only a partner may ask for help or cancel the ask. A collaborator can still revoke (that only removes access). */
export function requirePartner(req: Request & { memberRole?: string }, res: Response, next: NextFunction) {
  if (req.memberRole !== "partner") {
    res.status(403).json({ error: "Only a partner can do this" });
    return;
  }
  next();
}

export const ASSIST_CALLS_PER_MINUTE = 30;

/** Per user, so one signed-in account looping on these routes cannot use up the shared Sheets read quota. */
export function createAssistRateLimit(limit = ASSIST_CALLS_PER_MINUTE, windowMs = 60_000) {
  const limiter = new RateLimiter(windowMs);
  return (req: Request & { user?: Record<string, unknown> }, res: Response, next: NextFunction) => {
    const key = String(req.user?.user_id ?? req.ip ?? "anonymous");
    if (!limiter.hit(key, limit)) {
      res.status(429).json({ error: "Too many requests. Slow down." });
      return;
    }
    next();
  };
}

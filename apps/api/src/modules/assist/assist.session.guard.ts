import type { Request, Response } from "express";
import { RateLimiter } from "../../utils/rate-limit.js";
import { assistPolicy, cleanPath, isMutating, readClaim, type AssistClaim } from "./assist.session.core.js";
import type { createAssistSessionService } from "./assist.session.service.js";

type Session = ReturnType<typeof createAssistSessionService>;
type Req = Request & { user?: Record<string, unknown>; assist?: AssistClaim };

/** An admin reading the same area again within this time is one `view` row, not one per request. */
export const VIEW_THROTTLE_MS = 5 * 60_000;
const MAX_THROTTLE_KEYS = 5_000;

export const ASSIST_TRAFFIC_PER_MINUTE = 120;

/**
 * A cheap in-memory limit on assisted traffic, keyed by request. It runs at the top of requireActiveCouple, before
 * any sheet read, so a looping client is stopped before it costs quota. Several routers run that guard for one
 * request, so each request is counted once. Returns false after answering 429.
 */
export function createAssistTrafficLimit(limit = ASSIST_TRAFFIC_PER_MINUTE, windowMs = 60_000) {
  const limiter = new RateLimiter(windowMs);
  const counted = new WeakSet<object>();
  return function limitAssistTraffic(req: Req, res: Response): boolean {
    const read = readClaim(req.user);
    if (read.kind === "none" || counted.has(req)) return true;
    counted.add(req);
    const key = read.kind === "claim" ? read.claim.request_id : `invalid:${String(req.user?.user_id ?? "")}`;
    if (limiter.hit(key, limit)) return true;
    res.status(429).json({ error: "Too many requests. Slow down." });
    return false;
  };
}

/**
 * Extra checks for assisted-editing tokens (an admin acting as the couple), run from requireActiveCouple once the
 * couple is known. Returns false after answering 403 or 500, true when the request may go on. Several routers run
 * that guard in turn for one request, so a request already cleared (`req.assist`) is not checked or logged again.
 *
 * Audit: a change is logged before it runs; a read of an area is logged once per VIEW_THROTTLE_MS; a refused
 * attempt is logged once per path in the same window (best effort, it never hides the 403). A row that must be
 * written and cannot be makes the request fail, so nothing happens that the couple cannot see.
 *
 * Kept free of database imports so it can be tested with an in-memory session and a fixed clock.
 */
export function createCheckAssist(
  session: Pick<Session, "checkAccess" | "recordEdit" | "recordView" | "recordBlocked">,
  clock: () => Date = () => new Date(),
) {
  const seen = new Map<string, number>();
  /** True when this key was already logged inside the window; marks it as logged otherwise. */
  const throttled = (key: string, now: Date, mark: boolean) => {
    const last = seen.get(key);
    if (last !== undefined && now.getTime() - last < VIEW_THROTTLE_MS) return true;
    if (mark) {
      if (seen.size >= MAX_THROTTLE_KEYS) seen.clear();
      seen.set(key, now.getTime());
    }
    return false;
  };

  return async function checkAssist(req: Req, res: Response, ctx: { coupleId: string; coupleStatus: unknown }): Promise<boolean> {
    const read = readClaim(req.user);
    if (read.kind === "none" || req.assist) return true;
    const deny = (message: string) => {
      res.status(403).json({ error: message });
      return false;
    };
    if (read.kind === "invalid") return deny("Assist access ended");

    const now = clock();
    const access = await session.checkAccess(read.claim, ctx, now);
    if (!access.ok) return deny("Assist access ended");

    const url = req.originalUrl;
    if (assistPolicy(req.method, url) === "deny") {
      const key = `${read.claim.request_id}|blocked|${req.method}|${cleanPath(url)}`;
      if (!throttled(key, now, true)) await session.recordBlocked(read.claim, req.method, url, now).catch(() => undefined);
      return deny("Not available while Mongkolka is helping");
    }

    try {
      if (isMutating(req.method)) {
        // Before the action, so a change is never made that the couple could not see. If it cannot be written, refuse.
        await session.recordEdit(read.claim, req.method, url, now);
      } else {
        const area = cleanPath(url).split("/")[3] ?? "";
        const key = `${read.claim.request_id}|view|${area}`;
        if (!throttled(key, now, false)) {
          await session.recordView(read.claim, url, now);
          throttled(key, now, true); // marked only once the row is written, so a failure is retried next time
        }
      }
    } catch {
      res.status(500).json({ error: "Could not record this access" });
      return false;
    }
    req.assist = read.claim;
    return true;
  };
}

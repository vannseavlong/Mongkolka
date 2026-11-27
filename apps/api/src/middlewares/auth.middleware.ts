import jwt from "jsonwebtoken";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { env } from "../config/env.js";

export interface AuthedRequest extends Request {
  user?: Record<string, unknown>;
}

/**
 * `allowAssist` lets an admin's assisted-editing token through. Off by default, so a route added later that only
 * checks the role is not reachable with one; the couple routers turn it on because they also run requireActiveCouple,
 * which re-checks the request on every call.
 */
export function requireAuth(opts: { allowAssist?: boolean } = {}): RequestHandler {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;
    if (!token) {
      res.status(401).json({ error: "Missing bearer token" });
      return;
    }
    try {
      const user = jwt.verify(token, env.JWT_SECRET) as Record<string, unknown>;
      if (user.assist !== undefined && !opts.allowAssist) {
        res.status(403).json({ error: "Not available while Mongkolka is helping" });
        return;
      }
      req.user = user;
      next();
    } catch {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}

export function requireRole(role: string): RequestHandler {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}

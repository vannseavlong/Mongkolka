import jwt from "jsonwebtoken";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { env } from "../env.js";

export interface AuthedRequest extends Request {
  user?: Record<string, unknown>;
}

export function requireAuth(): RequestHandler {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;
    if (!token) {
      res.status(401).json({ error: "Missing bearer token" });
      return;
    }
    try {
      req.user = jwt.verify(token, env.JWT_SECRET) as Record<string, unknown>;
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

import type { NextFunction, Response } from "express";
import { adminContext } from "../config/database.js";
import type { AuthedRequest } from "./auth.middleware.js";

/**
 * Confirms the calling admin still exists and is active, from fresh DB state rather than the JWT claim, which
 * stays valid until it expires. Mirrors requireActiveCouple / requireActiveVendor. For routes where an admin
 * decides something about a couple, so a demoted or suspended admin loses that power at once.
 */
export async function requireActiveAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const userId = req.user?.user_id as string | undefined;
  if (!userId) {
    res.status(401).json({ error: "Missing user" });
    return;
  }
  const user = await adminContext().table("users").findOne({ where: { user_id: userId } });
  if (!user || user.role !== "admin" || user.status !== "active") {
    res.status(403).json({ error: "Admin account is not active" });
    return;
  }
  next();
}

import type { NextFunction, Response } from "express";
import { adminContext } from "../config/database.js";
import type { AuthedRequest } from "./auth.middleware.js";

export interface VendorRequest extends AuthedRequest {
  vendorActorSheetId?: string;
  vendorId?: string;
}

/**
 * Resolves the calling vendor's own actor sheet from fresh DB state rather than
 * trusting the JWT payload — the JWT is only re-issued at login, so a vendor
 * approved after their last login would otherwise carry a stale/missing
 * actor_sheet_id until they sign in again.
 */
export async function requireActiveVendor(req: VendorRequest, res: Response, next: NextFunction) {
  const userId = req.user?.user_id as string | undefined;
  if (!userId) {
    res.status(401).json({ error: "Missing user" });
    return;
  }

  const user = await adminContext().table("users").findOne({ where: { user_id: userId } });
  if (!user || user.role !== "vendor" || user.status !== "active" || !user.actor_sheet_id) {
    res.status(403).json({ error: "Vendor account is not active" });
    return;
  }

  const vendor = await adminContext()
    .table("vendors")
    .findOne({ where: { actor_sheet_id: user.actor_sheet_id } });
  if (!vendor) {
    res.status(404).json({ error: "Vendor record not found" });
    return;
  }

  req.vendorActorSheetId = user.actor_sheet_id as string;
  req.vendorId = vendor.vendor_id as string;
  next();
}

import type { NextFunction, Response } from "express";
import { adminContext } from "../config/database.js";
import type { AuthedRequest } from "./auth.middleware.js";

export interface CoupleRequest extends AuthedRequest {
  coupleActorSheetId?: string;
  coupleId?: string;
  memberId?: string;
  memberRole?: string;
}

/**
 * Resolves the calling user's couple tenant from fresh DB state rather than
 * trusting the JWT payload — mirrors requireActiveVendor. A couple tenant can
 * have two login identities (couple_members rows) sharing one actor_sheet_id.
 */
export async function requireActiveCouple(req: CoupleRequest, res: Response, next: NextFunction) {
  const userId = req.user?.user_id as string | undefined;
  if (!userId) {
    res.status(401).json({ error: "Missing user" });
    return;
  }

  const user = await adminContext().table("users").findOne({ where: { user_id: userId } });
  if (!user || user.role !== "couple" || user.status !== "active" || !user.actor_sheet_id) {
    res.status(403).json({ error: "Couple account is not active" });
    return;
  }

  const member = await adminContext()
    .table("couple_members")
    .findOne({ where: { user_id: userId } });
  if (!member) {
    res.status(404).json({ error: "Couple membership not found" });
    return;
  }

  const couple = await adminContext()
    .table("couples")
    .findOne({ where: { couple_id: member.couple_id as string } });
  if (!couple) {
    res.status(404).json({ error: "Couple record not found" });
    return;
  }

  req.coupleActorSheetId = couple.actor_sheet_id as string;
  req.coupleId = couple.couple_id as string;
  req.memberId = member.member_id as string;
  req.memberRole = member.member_role as string;
  next();
}

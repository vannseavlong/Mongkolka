import { randomUUID } from "node:crypto";
import type { GoogleProfile, SheetAdapter } from "longcelot-sheet-db";
import { env } from "../env.js";

export function selfRegisterOnUser(role: "couple" | "vendor") {
  return async (profile: GoogleProfile, adapter: SheetAdapter) => {
    const ctx = adapter.withContext({
      userId: "auth",
      actor: "admin",
      actorSheetId: env.ADMIN_SHEET_ID,
    });
    const existing = await ctx.table("users").findOne({
      where: { email: profile.email, role },
    });
    if (existing) return existing;

    return ctx.table("users").create({
      user_id: randomUUID(),
      role,
      email: profile.email,
      status: "pending",
    });
  };
}

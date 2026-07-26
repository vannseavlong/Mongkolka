import { randomUUID } from "node:crypto";
import type { GoogleProfile, SheetAdapter } from "longcelot-sheet-db";
import { env } from "../../config/env.js";

/** login-only: admin must already exist as an active admin user, no self-signup. */
export async function adminOnUser(profile: GoogleProfile, adapter: SheetAdapter) {
  const ctx = adapter.withContext({
    userId: "auth",
    actor: "admin",
    actorSheetId: env.ADMIN_SHEET_ID,
  });
  return ctx.table("users").findOne({
    where: { email: profile.email, role: "admin", status: "active" },
  });
}

/** open registration: couple/vendor self-register into a 'pending' user row. */
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

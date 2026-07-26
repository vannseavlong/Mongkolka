import { createAuthRouter } from "longcelot-sheet-db";
import { adapter } from "../db/adapter.js";
import { env } from "../env.js";

export const adminAuth = createAuthRouter({
  adapter,
  jwtSecret: env.JWT_SECRET,
  frontendUrl: env.ADMIN_FRONTEND_URL,
  basePath: "/admin",
  registrationPolicy: "login-only",
  oauthConfig: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.ADMIN_GOOGLE_REDIRECT_URI,
  },
  async onUser(profile, adapter) {
    const ctx = adapter.withContext({
      userId: "auth",
      actor: "admin",
      actorSheetId: env.ADMIN_SHEET_ID,
    });
    return ctx.table("users").findOne({
      where: { email: profile.email, role: "admin", status: "active" },
    });
  },
});

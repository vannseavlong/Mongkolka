import { createAuthRouter } from "longcelot-sheet-db";
import { adapter } from "../../config/database.js";
import { env } from "../../config/env.js";
import { adminOnUser } from "./auth.service.js";

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
  onUser: adminOnUser,
});

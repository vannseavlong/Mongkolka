import { createAuthRouter } from "longcelot-sheet-db";
import { adapter } from "../../config/database.js";
import { env } from "../../config/env.js";
import { PORTAL_LOGIN_SCOPES, selfRegisterOnUser } from "./auth.service.js";

export const vendorAuth = createAuthRouter({
  adapter,
  jwtSecret: env.JWT_SECRET,
  frontendUrl: env.VENDOR_FRONTEND_URL,
  basePath: "/vendor",
  registrationPolicy: "open",
  scopes: PORTAL_LOGIN_SCOPES,
  oauthConfig: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.VENDOR_GOOGLE_REDIRECT_URI,
  },
  onUser: selfRegisterOnUser("vendor"),
});

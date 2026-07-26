import { createAuthRouter } from "longcelot-sheet-db";
import { adapter } from "../db/adapter.js";
import { env } from "../env.js";
import { selfRegisterOnUser } from "./registration.js";

export const vendorAuth = createAuthRouter({
  adapter,
  jwtSecret: env.JWT_SECRET,
  frontendUrl: env.VENDOR_FRONTEND_URL,
  basePath: "/vendor",
  registrationPolicy: "open",
  oauthConfig: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.VENDOR_GOOGLE_REDIRECT_URI,
  },
  onUser: selfRegisterOnUser("vendor"),
});

import { createAuthRouter } from "longcelot-sheet-db";
import { adapter } from "../db/adapter.js";
import { env } from "../env.js";
import { selfRegisterOnUser } from "./registration.js";

export const coupleAuth = createAuthRouter({
  adapter,
  jwtSecret: env.JWT_SECRET,
  frontendUrl: env.COUPLE_FRONTEND_URL,
  basePath: "/couple",
  registrationPolicy: "open",
  oauthConfig: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.COUPLE_GOOGLE_REDIRECT_URI,
  },
  onUser: selfRegisterOnUser("couple"),
});

import { Router } from "express";
import { PasswordAuthController } from "./password-auth.controller.js";

/** Sibling to each role's `createAuthRouter` (GET /:role/auth/google) — the
 * email/password counterpart, mounted the same way in src/index.ts. */
export function passwordAuthRouter(role: "admin" | "couple" | "vendor") {
  const router = Router();
  router.post(`/${role}/auth/login`, PasswordAuthController.login(role));
  return router;
}

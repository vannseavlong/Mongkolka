import type { Request, RequestHandler, Response } from "express";
import { PasswordAuthService } from "./password-auth.service.js";

// `error` carries the human-readable message, matching every other controller
// in this API (e.g. public-contact, couples, vendors) — `code` is additive,
// only for the frontend to branch on the specific "no password set, this is a
// Google-only account" case without string-matching the message.
const ERROR_MESSAGES = {
  invalid_credentials: "Incorrect email or password.",
  google_only: "This user is authenticated with Google login.",
} as const;

export const PasswordAuthController = {
  login(role: "admin" | "couple" | "vendor"): RequestHandler {
    return async (req: Request, res: Response) => {
      const { email, password } = (req.body ?? {}) as { email?: unknown; password?: unknown };
      if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
        res.status(400).json({ error: "Email and password are required." });
        return;
      }

      const result = await PasswordAuthService.login(email.trim().toLowerCase(), password, role);
      if (!result.ok) {
        res.status(401).json({ error: ERROR_MESSAGES[result.error], code: result.error });
        return;
      }
      res.json({ token: result.token });
    };
  },
};

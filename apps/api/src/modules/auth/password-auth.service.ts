import jwt from "jsonwebtoken";
import { comparePassword } from "longcelot-sheet-db";
import { env } from "../../config/env.js";
import { UsersModel } from "../users/users.model.js";
import { CredentialsModel } from "./credentials.model.js";

export type PasswordLoginResult =
  | { ok: true; token: string }
  | { ok: false; error: "invalid_credentials" }
  | { ok: false; error: "google_only" };

/**
 * Email/password login, parallel to the Google OAuth flow wired by
 * `createAuthRouter` (admin/couple/vendor-auth.router.ts). Issues the same
 * JWT shape (the raw `users` row) so the frontend's `decodeSessionUser()`
 * works identically regardless of which flow authenticated the session.
 */
export const PasswordAuthService = {
  async login(email: string, password: string, role: string): Promise<PasswordLoginResult> {
    const user = await UsersModel.findByEmail(email);
    // Role-scoped: a real account under a different portal's role should look
    // the same as "no such account" here, not leak which role owns the email.
    if (!user || user.role !== role) {
      return { ok: false, error: "invalid_credentials" };
    }

    const credential = await CredentialsModel.findByUserId(user.user_id as string);
    if (!credential || !credential.password_hash) {
      return { ok: false, error: "google_only" };
    }

    const valid = await comparePassword(password, credential.password_hash as string);
    if (!valid) {
      return { ok: false, error: "invalid_credentials" };
    }

    const token = jwt.sign(user, env.JWT_SECRET);
    return { ok: true, token };
  },
};

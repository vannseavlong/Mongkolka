import type { Response } from "express";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
import { UsersModel } from "../users/users.model.js";

/**
 * Fresh-from-the-DB session status — deliberately *not* gated by
 * requireActiveCouple/requireActiveVendor (which 403 non-active accounts).
 * The JWT's own `status` claim is a snapshot from login time and goes stale
 * the moment an admin approves the account; the frontend polls this instead
 * of decoding the token so a pending user's dashboard updates without
 * needing to sign out and back in.
 */
export const SessionController = {
  async get(req: AuthedRequest, res: Response) {
    const userId = req.user?.user_id as string | undefined;
    if (!userId) {
      res.status(401).json({ error: "Missing user" });
      return;
    }

    const user = await UsersModel.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ status: user.status });
  },
};

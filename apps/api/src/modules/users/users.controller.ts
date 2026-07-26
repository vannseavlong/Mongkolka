import type { Response } from "express";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
import { UsersService } from "./users.service.js";

export const UsersController = {
  async list(req: AuthedRequest, res: Response) {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const role = typeof req.query.role === "string" ? req.query.role : undefined;
    const users = await UsersService.listUsers(status, role);
    res.json({ users });
  },

  async approve(req: AuthedRequest, res: Response) {
    const approvingAdminUserId = req.user?.user_id as string;
    const updated = await UsersService.approve(req.params.userId as string, approvingAdminUserId);
    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ user: updated });
  },

  async reject(req: AuthedRequest, res: Response) {
    const updated = await UsersService.reject(req.params.userId as string);
    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ user: updated });
  },
};

import { adapter, adminContext } from "../../config/database.js";

export const UsersModel = {
  findMany(where?: Record<string, unknown>) {
    return adminContext().table("users").findMany({ where });
  },

  findById(userId: string) {
    return adminContext().table("users").findOne({ where: { user_id: userId } });
  },

  updateStatus(userId: string, status: string, extra?: Record<string, unknown>) {
    return adminContext()
      .table("users")
      .update({ where: { user_id: userId }, data: { status, ...extra } });
  },

  createActorSheet(userId: string, role: string, email: string) {
    return adapter.createUserSheet(userId, role, email);
  },
};

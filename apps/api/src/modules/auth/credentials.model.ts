import { adminContext } from "../../config/database.js";

export const CredentialsModel = {
  findByUserId(userId: string) {
    return adminContext().table("credentials").findOne({ where: { user_id: userId } });
  },

  create(data: Record<string, unknown>) {
    return adminContext().table("credentials").create(data);
  },
};

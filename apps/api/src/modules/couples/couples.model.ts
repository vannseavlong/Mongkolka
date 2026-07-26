import { adminContext } from "../../config/database.js";

export const CouplesModel = {
  findMany(where?: Record<string, unknown>) {
    return adminContext().table("couples").findMany({ where });
  },

  findById(coupleId: string) {
    return adminContext().table("couples").findOne({ where: { couple_id: coupleId } });
  },

  create(data: Record<string, unknown>) {
    return adminContext().table("couples").create(data);
  },

  updateStatus(coupleId: string, status: string) {
    return adminContext()
      .table("couples")
      .update({ where: { couple_id: coupleId }, data: { status } });
  },

  addMember(data: Record<string, unknown>) {
    return adminContext().table("couple_members").create(data);
  },
};

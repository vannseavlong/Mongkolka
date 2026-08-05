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

  /** The row a couple registered for themselves, still awaiting admin approval
   * (no `actor_sheet_id` yet — see `CouplesService.registerCouple`). */
  findPendingByEmail(email: string) {
    return adminContext()
      .table("couples")
      .findOne({ where: { partner1_email: email, status: "pending" } });
  },

  update(coupleId: string, data: Record<string, unknown>) {
    return adminContext()
      .table("couples")
      .update({ where: { couple_id: coupleId }, data });
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

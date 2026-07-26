import { coupleContext } from "../../config/database.js";

export const CoupleMilestonesModel = {
  findMany(actorSheetId: string) {
    return coupleContext(actorSheetId)
      .table("milestones")
      .findMany({ orderBy: "months_before", order: "desc" });
  },

  findById(actorSheetId: string, milestoneId: string) {
    return coupleContext(actorSheetId)
      .table("milestones")
      .findOne({ where: { milestone_id: milestoneId } });
  },

  create(actorSheetId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId).table("milestones").create(data);
  },

  update(actorSheetId: string, milestoneId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId)
      .table("milestones")
      .update({ where: { milestone_id: milestoneId }, data });
  },

  delete(actorSheetId: string, milestoneId: string) {
    return coupleContext(actorSheetId)
      .table("milestones")
      .delete({ where: { milestone_id: milestoneId } });
  },
};

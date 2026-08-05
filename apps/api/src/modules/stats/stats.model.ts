import { adminContext } from "../../config/database.js";

export const StatsModel = {
  findMany(where?: Record<string, unknown>) {
    return adminContext().table("stats").findMany({ where });
  },

  findById(statId: string) {
    return adminContext()
      .table("stats")
      .findOne({ where: { stat_id: statId } });
  },

  create(data: Record<string, unknown>) {
    return adminContext().table("stats").create(data);
  },

  update(statId: string, data: Record<string, unknown>) {
    return adminContext()
      .table("stats")
      .update({ where: { stat_id: statId }, data });
  },

  delete(statId: string) {
    return adminContext()
      .table("stats")
      .delete({ where: { stat_id: statId } });
  },
};

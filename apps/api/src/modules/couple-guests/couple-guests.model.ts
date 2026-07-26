import { coupleContext } from "../../config/database.js";

export const CoupleGuestsModel = {
  findMany(actorSheetId: string) {
    return coupleContext(actorSheetId).table("guests").findMany();
  },

  findById(actorSheetId: string, guestId: string) {
    return coupleContext(actorSheetId).table("guests").findOne({ where: { guest_id: guestId } });
  },

  create(actorSheetId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId).table("guests").create(data);
  },

  update(actorSheetId: string, guestId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId)
      .table("guests")
      .update({ where: { guest_id: guestId }, data });
  },

  delete(actorSheetId: string, guestId: string) {
    return coupleContext(actorSheetId)
      .table("guests")
      .delete({ where: { guest_id: guestId } });
  },
};

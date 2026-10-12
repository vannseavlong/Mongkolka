import { coupleContext } from "../../config/database.js";

export const GuestWishesModel = {
  findMany(actorSheetId: string) {
    return coupleContext(actorSheetId).table("guest_wishes").findMany();
  },

  findById(actorSheetId: string, wishId: string) {
    return coupleContext(actorSheetId)
      .table("guest_wishes")
      .findOne({ where: { wish_id: wishId } });
  },

  createMany(actorSheetId: string, rows: Record<string, unknown>[]) {
    return coupleContext(actorSheetId).table("guest_wishes").createMany(rows);
  },

  update(actorSheetId: string, wishId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId)
      .table("guest_wishes")
      .update({ where: { wish_id: wishId }, data });
  },

  delete(actorSheetId: string, wishId: string) {
    return coupleContext(actorSheetId)
      .table("guest_wishes")
      .delete({ where: { wish_id: wishId } });
  },

  // guests table — used to record a confirmed gift against the matching guest.
  findGuestByName(actorSheetId: string, name: string) {
    return coupleContext(actorSheetId).table("guests").findOne({ where: { name } });
  },

  createGuest(actorSheetId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId).table("guests").create(data);
  },

  updateGuest(actorSheetId: string, guestId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId)
      .table("guests")
      .update({ where: { guest_id: guestId }, data });
  },
};

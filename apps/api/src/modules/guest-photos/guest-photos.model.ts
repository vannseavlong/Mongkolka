import { coupleContext } from "../../config/database.js";

export const GuestPhotosModel = {
  findMany(actorSheetId: string) {
    return coupleContext(actorSheetId).table("guest_photos").findMany();
  },

  findById(actorSheetId: string, photoId: string) {
    return coupleContext(actorSheetId)
      .table("guest_photos")
      .findOne({ where: { photo_id: photoId } });
  },

  createMany(actorSheetId: string, rows: Record<string, unknown>[]) {
    return coupleContext(actorSheetId).table("guest_photos").createMany(rows);
  },

  update(actorSheetId: string, photoId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId)
      .table("guest_photos")
      .update({ where: { photo_id: photoId }, data });
  },

  delete(actorSheetId: string, photoId: string) {
    return coupleContext(actorSheetId)
      .table("guest_photos")
      .delete({ where: { photo_id: photoId } });
  },
};

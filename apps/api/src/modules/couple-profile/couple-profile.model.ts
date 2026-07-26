import { adminContext, coupleContext } from "../../config/database.js";

export const CoupleProfileModel = {
  findCatalogById(coupleId: string) {
    return adminContext().table("couples").findOne({ where: { couple_id: coupleId } });
  },

  updateCatalog(coupleId: string, data: Record<string, unknown>) {
    return adminContext()
      .table("couples")
      .update({ where: { couple_id: coupleId }, data });
  },

  findOwnProfile(actorSheetId: string) {
    return coupleContext(actorSheetId).table("couple_profile").findOne();
  },

  createOwnProfile(actorSheetId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId).table("couple_profile").create(data);
  },

  updateOwnProfile(actorSheetId: string, profileId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId)
      .table("couple_profile")
      .update({ where: { profile_id: profileId }, data });
  },
};

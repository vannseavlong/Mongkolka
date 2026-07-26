import { adminContext, vendorContext } from "../../config/database.js";

export const VendorProfileModel = {
  findCatalogById(vendorId: string) {
    return adminContext().table("vendors").findOne({ where: { vendor_id: vendorId } });
  },

  updateCatalog(vendorId: string, data: Record<string, unknown>) {
    return adminContext()
      .table("vendors")
      .update({ where: { vendor_id: vendorId }, data });
  },

  findOwnProfile(actorSheetId: string) {
    return vendorContext(actorSheetId).table("vendor_profile").findOne();
  },

  createOwnProfile(actorSheetId: string, data: Record<string, unknown>) {
    return vendorContext(actorSheetId).table("vendor_profile").create(data);
  },

  updateOwnProfile(actorSheetId: string, profileId: string, data: Record<string, unknown>) {
    return vendorContext(actorSheetId)
      .table("vendor_profile")
      .update({ where: { profile_id: profileId }, data });
  },
};

import { adminContext } from "../../config/database.js";

export const VendorsModel = {
  findMany(where?: Record<string, unknown>) {
    return adminContext().table("vendors").findMany({ where });
  },

  findById(vendorId: string) {
    return adminContext().table("vendors").findOne({ where: { vendor_id: vendorId } });
  },

  create(data: Record<string, unknown>) {
    return adminContext().table("vendors").create(data);
  },

  /** The row a vendor registered for themselves, still awaiting admin approval
   * (no `actor_sheet_id` yet — see `VendorsService.registerVendor`). */
  findPendingByEmail(email: string) {
    return adminContext()
      .table("vendors")
      .findOne({ where: { owner_email: email, status: "pending" } });
  },

  update(vendorId: string, data: Record<string, unknown>) {
    return adminContext()
      .table("vendors")
      .update({ where: { vendor_id: vendorId }, data });
  },

  updateStatus(vendorId: string, status: string) {
    return adminContext()
      .table("vendors")
      .update({ where: { vendor_id: vendorId }, data: { status } });
  },
};

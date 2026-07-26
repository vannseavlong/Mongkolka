import { randomUUID } from "node:crypto";
import { VendorsModel } from "./vendors.model.js";

export const VendorsService = {
  listVendors(status?: string, categoryId?: string) {
    const where = { ...(status ? { status } : {}), ...(categoryId ? { category_id: categoryId } : {}) };
    return VendorsModel.findMany(Object.keys(where).length ? where : undefined);
  },

  /**
   * Creates the vendors catalog row for a newly approved vendor. Business details
   * (name/category/description) aren't collected at registration yet — the vendor
   * fills those in later from their own portal's Profile page.
   */
  async provisionVendor(user: Record<string, unknown>, actorSheetId: string, approvedByUserId: string) {
    const vendorId = randomUUID();

    await VendorsModel.create({
      vendor_id: vendorId,
      actor_sheet_id: actorSheetId,
      owner_email: user.email as string,
      status: "active",
      approved_at: new Date().toISOString(),
      approved_by: approvedByUserId,
    });

    return vendorId;
  },

  async suspend(vendorId: string) {
    await VendorsModel.updateStatus(vendorId, "inactive");
    return VendorsModel.findById(vendorId);
  },

  async reactivate(vendorId: string) {
    await VendorsModel.updateStatus(vendorId, "active");
    return VendorsModel.findById(vendorId);
  },
};

import { randomUUID } from "node:crypto";
import { hashPassword } from "longcelot-sheet-db";
import { UsersModel } from "../users/users.model.js";
import { CredentialsModel } from "../auth/credentials.model.js";
import { VendorsModel } from "./vendors.model.js";

export interface RegisterVendorInput {
  email: string;
  password: string;
  businessName: string;
  categoryId?: string;
  location?: string;
  description?: string;
}

export type RegisterVendorResult = { ok: true; userId: string } | { ok: false; error: "email_taken" };

export const VendorsService = {
  listVendors(status?: string, categoryId?: string) {
    const where = { ...(status ? { status } : {}), ...(categoryId ? { category_id: categoryId } : {}) };
    return VendorsModel.findMany(Object.keys(where).length ? where : undefined);
  },

  /**
   * Self-registration entry point (`POST /vendor/auth/register`) — parallel to
   * `selfRegisterOnUser` (the Google-only path), but collects the vendor's own
   * business details up front instead of leaving the `vendors` row to be filled
   * in later. Creates the login identity + a *pending* `vendors` row in one go;
   * both stay pending (no `actor_sheet_id`) until an admin approves, at which
   * point `provisionVendor` finds and activates this same row rather than
   * creating a second one.
   */
  async registerVendor(input: RegisterVendorInput): Promise<RegisterVendorResult> {
    const existing = await UsersModel.findByEmail(input.email);
    if (existing) return { ok: false, error: "email_taken" };

    const userId = randomUUID();
    await UsersModel.create({ user_id: userId, role: "vendor", email: input.email, status: "pending" });

    const passwordHash = await hashPassword(input.password);
    await CredentialsModel.create({ user_id: userId, password_hash: passwordHash, provider: "local" });

    await VendorsModel.create({
      vendor_id: randomUUID(),
      business_name: input.businessName,
      owner_email: input.email,
      category_id: input.categoryId,
      location: input.location,
      description: input.description,
      status: "pending",
      submitted_at: new Date().toISOString(),
    });

    return { ok: true, userId };
  },

  /**
   * Creates the vendors catalog row for a newly approved vendor.
   *
   * Prefers reusing the pending row `registerVendor` already created (filled in
   * with the vendor's own business details); falls back to a bare create for
   * accounts that came in through the Google self-register path instead, which
   * never collects those details up front.
   */
  async provisionVendor(user: Record<string, unknown>, actorSheetId: string, approvedByUserId: string) {
    const email = user.email as string;
    const pending = await VendorsModel.findPendingByEmail(email);

    if (pending) {
      const vendorId = pending.vendor_id as string;
      await VendorsModel.update(vendorId, {
        actor_sheet_id: actorSheetId,
        status: "active",
        approved_at: new Date().toISOString(),
        approved_by: approvedByUserId,
      });
      return vendorId;
    }

    const vendorId = randomUUID();
    await VendorsModel.create({
      vendor_id: vendorId,
      actor_sheet_id: actorSheetId,
      owner_email: email,
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

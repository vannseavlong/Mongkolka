import { randomUUID } from "node:crypto";
import { VendorProfileModel } from "./vendor-profile.model.js";

export interface VendorProfileUpdateInput {
  business_name?: string;
  category_id?: string;
  location?: string;
  description?: string;
  bio?: string;
  service_area?: string;
}

export const VendorProfileService = {
  async get(vendorId: string, actorSheetId: string) {
    const [catalog, profile] = await Promise.all([
      VendorProfileModel.findCatalogById(vendorId),
      VendorProfileModel.findOwnProfile(actorSheetId),
    ]);
    return {
      ...catalog,
      bio: profile?.bio ?? null,
      service_area: profile?.service_area ?? null,
    };
  },

  async update(vendorId: string, actorSheetId: string, input: VendorProfileUpdateInput) {
    const catalogFields: Record<string, unknown> = {};
    if (input.business_name !== undefined) catalogFields.business_name = input.business_name;
    if (input.category_id !== undefined) catalogFields.category_id = input.category_id;
    if (input.location !== undefined) catalogFields.location = input.location;
    if (input.description !== undefined) catalogFields.description = input.description;
    if (Object.keys(catalogFields).length > 0) {
      await VendorProfileModel.updateCatalog(vendorId, catalogFields);
    }

    const profileFields: Record<string, unknown> = {};
    if (input.bio !== undefined) profileFields.bio = input.bio;
    if (input.service_area !== undefined) profileFields.service_area = input.service_area;
    if (Object.keys(profileFields).length > 0) {
      const existing = await VendorProfileModel.findOwnProfile(actorSheetId);
      if (existing) {
        await VendorProfileModel.updateOwnProfile(
          actorSheetId,
          existing.profile_id as string,
          profileFields,
        );
      } else {
        await VendorProfileModel.createOwnProfile(actorSheetId, {
          profile_id: randomUUID(),
          ...profileFields,
        });
      }
    }

    return VendorProfileService.get(vendorId, actorSheetId);
  },
};

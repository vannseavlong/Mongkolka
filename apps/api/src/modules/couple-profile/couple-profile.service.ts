import { randomUUID } from "node:crypto";
import { CoupleProfileModel } from "./couple-profile.model.js";

export interface CoupleProfileUpdateInput {
  partner1_name?: string;
  partner2_name?: string;
  partner2_email?: string;
  wedding_date?: string;
  love_story?: string;
  cover_photo_url?: string;
  ceremony_time?: string;
  ceremony_venue?: string;
  ceremony_address?: string;
  reception_time?: string;
  reception_venue?: string;
  reception_address?: string;
  dress_code?: string;
}

export const CoupleProfileService = {
  async get(coupleId: string, actorSheetId: string) {
    const [catalog, profile] = await Promise.all([
      CoupleProfileModel.findCatalogById(coupleId),
      CoupleProfileModel.findOwnProfile(actorSheetId),
    ]);
    return { ...catalog, ...profile };
  },

  async update(coupleId: string, actorSheetId: string, input: CoupleProfileUpdateInput) {
    const catalogFields: Record<string, unknown> = {};
    if (input.partner1_name !== undefined) catalogFields.partner1_name = input.partner1_name;
    if (input.partner2_name !== undefined) catalogFields.partner2_name = input.partner2_name;
    if (input.partner2_email !== undefined) catalogFields.partner2_email = input.partner2_email;
    if (input.wedding_date !== undefined) catalogFields.wedding_date = input.wedding_date;
    if (Object.keys(catalogFields).length > 0) {
      await CoupleProfileModel.updateCatalog(coupleId, catalogFields);
    }

    const profileFields: Record<string, unknown> = {};
    if (input.love_story !== undefined) profileFields.love_story = input.love_story;
    if (input.cover_photo_url !== undefined) profileFields.cover_photo_url = input.cover_photo_url;
    if (input.ceremony_time !== undefined) profileFields.ceremony_time = input.ceremony_time;
    if (input.ceremony_venue !== undefined) profileFields.ceremony_venue = input.ceremony_venue;
    if (input.ceremony_address !== undefined) profileFields.ceremony_address = input.ceremony_address;
    if (input.reception_time !== undefined) profileFields.reception_time = input.reception_time;
    if (input.reception_venue !== undefined) profileFields.reception_venue = input.reception_venue;
    if (input.reception_address !== undefined)
      profileFields.reception_address = input.reception_address;
    if (input.dress_code !== undefined) profileFields.dress_code = input.dress_code;

    if (Object.keys(profileFields).length > 0) {
      const existing = await CoupleProfileModel.findOwnProfile(actorSheetId);
      if (existing) {
        await CoupleProfileModel.updateOwnProfile(
          actorSheetId,
          existing.profile_id as string,
          profileFields,
        );
      } else {
        await CoupleProfileModel.createOwnProfile(actorSheetId, {
          profile_id: randomUUID(),
          ...profileFields,
        });
      }
    }

    return CoupleProfileService.get(coupleId, actorSheetId);
  },
};

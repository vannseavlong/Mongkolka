import { toPublicUrl, toStoredUrl } from "../../utils/media-url.js";
import { randomUUID } from "node:crypto";
import { CoupleProfileModel } from "./couple-profile.model.js";
import { PHOTO_UPLOAD_MODES, clampPhotoSetting } from "../guest-photos/guest-photos.limits.js";
import { validateHttpsUrl } from "../../utils/section-content.js";
import { PublicSiteCache } from "../public-site/public-site.cache.js";

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
  map_url?: string | null;
  venue_image_url?: string | null;
  photo_uploads?: string;
  photo_max_per_guest?: number;
  photo_max_size_mb?: number;
  photo_rate_per_ip_per_hour?: number;
}

export class ProfileInputError extends Error {}

/** validateHttpsUrl throws a plain Error; the controller maps ProfileInputError to a 400. */
function httpsUrlOrNull(value: unknown, field: string): string | null {
  try {
    return validateHttpsUrl(value, field) ?? null;
  } catch (err) {
    throw new ProfileInputError((err as Error).message);
  }
}

/** One of our own uploaded files (saved as a path) or an https link. A bare http link to a local API is only ever our own file. */
function ownPathOrHttpsUrl(value: unknown, field: string): string | null {
  if (typeof value === "string") {
    const stored = toStoredUrl(value.trim());
    if (/^\/(uploads|media)\//.test(stored)) return stored;
  }
  return httpsUrlOrNull(value, field);
}

export const CoupleProfileService = {
  async get(coupleId: string, actorSheetId: string) {
    const [catalog, profile] = await Promise.all([
      CoupleProfileModel.findCatalogById(coupleId),
      CoupleProfileModel.findOwnProfile(actorSheetId),
    ]);
    const merged: Record<string, unknown> = { ...catalog, ...profile };
    for (const field of ["cover_photo_url", "venue_image_url"]) {
      if (typeof merged[field] === "string") merged[field] = toPublicUrl(merged[field] as string);
    }
    return merged as typeof catalog & typeof profile;
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
    if (input.cover_photo_url !== undefined) profileFields.cover_photo_url = typeof input.cover_photo_url === "string" ? toStoredUrl(input.cover_photo_url) : input.cover_photo_url;
    if (input.ceremony_time !== undefined) profileFields.ceremony_time = input.ceremony_time;
    if (input.ceremony_venue !== undefined) profileFields.ceremony_venue = input.ceremony_venue;
    if (input.ceremony_address !== undefined) profileFields.ceremony_address = input.ceremony_address;
    if (input.reception_time !== undefined) profileFields.reception_time = input.reception_time;
    if (input.reception_venue !== undefined) profileFields.reception_venue = input.reception_venue;
    if (input.reception_address !== undefined)
      profileFields.reception_address = input.reception_address;
    if (input.dress_code !== undefined) profileFields.dress_code = input.dress_code;
    // https only (a map link and a venue photo are rendered as href/src on the public site).
    if (input.map_url !== undefined) profileFields.map_url = httpsUrlOrNull(input.map_url, "map_url");
    if (input.venue_image_url !== undefined)
      profileFields.venue_image_url = ownPathOrHttpsUrl(input.venue_image_url, "venue_image_url");
    if (input.photo_uploads !== undefined) {
      if (!(PHOTO_UPLOAD_MODES as readonly string[]).includes(input.photo_uploads)) {
        throw new Error("photo_uploads must be off, auto or pending");
      }
      profileFields.photo_uploads = input.photo_uploads;
    }
    if (input.photo_max_per_guest !== undefined)
      profileFields.photo_max_per_guest = clampPhotoSetting("maxPerGuest", input.photo_max_per_guest);
    if (input.photo_max_size_mb !== undefined)
      profileFields.photo_max_size_mb = clampPhotoSetting("maxSizeMb", input.photo_max_size_mb);
    if (input.photo_rate_per_ip_per_hour !== undefined)
      profileFields.photo_rate_per_ip_per_hour = clampPhotoSetting(
        "ratePerIpPerHour",
        input.photo_rate_per_ip_per_hour,
      );

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

    PublicSiteCache.invalidateCouple(coupleId);
    return CoupleProfileService.get(coupleId, actorSheetId);
  },
};

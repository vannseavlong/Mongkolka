import { toast } from "sonner";
import { mutate } from "swr";
import { api, ApiError } from "@/lib/api";
import type { CoupleProfile } from "@/features/profile/data/schema";
import { PROFILE_KEY } from "./asset-library-api";

type ProfileCache = { profile: CoupleProfile };
export type ProfileImageField = "cover_photo_url" | "venue_image_url";

/**
 * Saves one profile image field through the profile PATCH, updating the cached profile
 * first so the canvas reacts at once; rolls back and toasts if the save fails.
 * null clears the image (the endpoint takes an empty string for that).
 */
export async function saveProfileImage(field: ProfileImageField, url: string | null, failure: string) {
  let previous: string | null | undefined;
  await mutate(
    PROFILE_KEY,
    (cur?: ProfileCache) => {
      previous = cur?.profile[field];
      return cur && { profile: { ...cur.profile, [field]: url } };
    },
    { revalidate: false },
  );
  try {
    await api.patch(PROFILE_KEY, { [field]: url ?? "" });
    return true;
  } catch (err) {
    mutate(PROFILE_KEY, (cur?: ProfileCache) => cur && { profile: { ...cur.profile, [field]: previous ?? null } }, {
      revalidate: false,
    });
    toast.error(err instanceof ApiError ? err.message : failure);
    return false;
  }
}

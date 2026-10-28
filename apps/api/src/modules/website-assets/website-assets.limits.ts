import { ALLOWED_MIME, PHOTO_DEFAULTS } from "../guest-photos/guest-photos.limits.js";

export { ALLOWED_MIME };

export const ASSET_LIMITS = {
  maxPerCouple: 100,
  maxBytes: PHOTO_DEFAULTS.maxSizeMb * 1024 * 1024,
} as const;

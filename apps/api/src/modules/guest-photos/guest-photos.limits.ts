// Platform-wide ceilings. Couples configure their own limits in the portal, but the
// API never lets them exceed these — one couple can't set "unlimited" and run up the
// storage bill.
export const PHOTO_CEILINGS = {
  maxPerGuest: 50,
  maxSizeMb: 15,
  ratePerIpPerHour: 200,
} as const;

export const PHOTO_DEFAULTS = {
  mode: "pending" as PhotoUploadMode,
  maxPerGuest: 5,
  maxSizeMb: 8,
  ratePerIpPerHour: 30,
} as const;

export const PHOTO_UPLOAD_MODES = ["off", "auto", "pending"] as const;
export type PhotoUploadMode = (typeof PHOTO_UPLOAD_MODES)[number];

export const PHOTO_STATUSES = ["pending", "approved", "hidden"] as const;
export type PhotoStatus = (typeof PHOTO_STATUSES)[number];

/** Allowlist, with the extension each type is stored under (never trust a client filename). */
export const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export interface PhotoSettings {
  mode: PhotoUploadMode;
  maxPerGuest: number;
  maxSizeMb: number;
  ratePerIpPerHour: number;
}

function clampNumber(value: unknown, fallback: number, min: number, max: number) {
  if (value === null || value === undefined || value === "") return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

export function clampPhotoSetting<K extends keyof typeof PHOTO_CEILINGS>(
  key: K,
  value: unknown,
): number {
  const fallback = {
    maxPerGuest: PHOTO_DEFAULTS.maxPerGuest,
    maxSizeMb: PHOTO_DEFAULTS.maxSizeMb,
    ratePerIpPerHour: PHOTO_DEFAULTS.ratePerIpPerHour,
  }[key];
  return clampNumber(value, fallback, 1, PHOTO_CEILINGS[key]);
}

/** Reads the couple's settings off their profile row, applying defaults and ceilings. */
export function photoSettingsFromProfile(profile: Record<string, unknown> | null | undefined): PhotoSettings {
  const mode = profile?.photo_uploads;
  return {
    mode: (PHOTO_UPLOAD_MODES as readonly unknown[]).includes(mode)
      ? (mode as PhotoUploadMode)
      : PHOTO_DEFAULTS.mode,
    maxPerGuest: clampPhotoSetting("maxPerGuest", profile?.photo_max_per_guest),
    maxSizeMb: clampPhotoSetting("maxSizeMb", profile?.photo_max_size_mb),
    ratePerIpPerHour: clampPhotoSetting("ratePerIpPerHour", profile?.photo_rate_per_ip_per_hour),
  };
}

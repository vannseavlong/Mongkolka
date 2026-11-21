export type LimitKey = "maxMb" | "maxDimension" | "maxPerCouple";

export type LimitNumbers = Record<LimitKey, number>;
export type LimitRanges = Record<LimitKey, { min: number; max: number }>;

/** Response of GET/PATCH /admin/api/settings/uploads. */
export interface UploadLimitsView {
  /** What the API enforces right now. */
  effective: LimitNumbers;
  /** What applies when nothing is overridden (server config). */
  defaults: LimitNumbers;
  /** Only the fields an admin has set. */
  overrides: Partial<LimitNumbers>;
  ranges: LimitRanges;
}

/** A number sets an override; null clears it so the default applies. */
export type UploadLimitsPayload = Record<LimitKey, number | null>;

export const UPLOAD_LIMITS_KEY = "/admin/api/settings/uploads";

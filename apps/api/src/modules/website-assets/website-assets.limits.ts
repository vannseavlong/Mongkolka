import { env } from "../../config/env.js";
import { ALLOWED_MIME } from "../guest-photos/guest-photos.limits.js";

export { ALLOWED_MIME };

/** Reads a whole number from config; falls back when unset or invalid, and clamps to [min, max]. */
export function intFromConfig(raw: string | undefined, fallback: number, min: number, max: number): number {
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

/** Hard ceilings: env can raise the defaults but never past these (memory and storage-bill guard). */
export const ASSET_CEILINGS = {
  maxMb: 100,
  maxDimension: 16383, // the WebP format limit
  maxPerCouple: 1000,
} as const;

/** Built from the environment (ASSET_MAX_MB, ASSET_MAX_DIMENSION, ASSET_MAX_PER_COUPLE). */
export function buildAssetLimits(config: {
  ASSET_MAX_MB?: string;
  ASSET_MAX_DIMENSION?: string;
  ASSET_MAX_PER_COUPLE?: string;
}) {
  return {
    maxPerCouple: intFromConfig(config.ASSET_MAX_PER_COUPLE, 100, 1, ASSET_CEILINGS.maxPerCouple),
    /** Per-asset size cap; the upload middleware buffers a file in memory up to this size. */
    maxBytes: intFromConfig(config.ASSET_MAX_MB, 8, 1, ASSET_CEILINGS.maxMb) * 1024 * 1024,
    /** Reject absurd pixel sizes (decompression-bomb style) when the header can be read. */
    maxDimension: intFromConfig(config.ASSET_MAX_DIMENSION, 12000, 1, ASSET_CEILINGS.maxDimension),
  };
}

export const ASSET_LIMITS = buildAssetLimits(env);

export type AssetLimits = ReturnType<typeof buildAssetLimits>;

/** Admin-set overrides, in the units the admin form uses. A missing field means "use the default". */
export interface AssetLimitOverrides {
  maxMb?: number;
  maxDimension?: number;
  maxPerCouple?: number;
}

/** Allowed range per override field, shared by input validation and clamping. */
export const ASSET_LIMIT_RANGES = {
  maxMb: { min: 1, max: ASSET_CEILINGS.maxMb },
  maxDimension: { min: 1, max: ASSET_CEILINGS.maxDimension },
  maxPerCouple: { min: 1, max: ASSET_CEILINGS.maxPerCouple },
} as const;

/** Applies overrides on top of the env-built defaults, clamped to the ceilings. */
export function applyAssetOverrides(base: AssetLimits, o: AssetLimitOverrides): AssetLimits {
  const r = ASSET_LIMIT_RANGES;
  const pick = (v: number | undefined, fallback: number, k: keyof typeof r) =>
    typeof v === "number" && Number.isFinite(v) ? Math.min(r[k].max, Math.max(r[k].min, Math.floor(v))) : fallback;
  return {
    maxPerCouple: pick(o.maxPerCouple, base.maxPerCouple, "maxPerCouple"),
    maxBytes: pick(o.maxMb, base.maxBytes / (1024 * 1024), "maxMb") * 1024 * 1024,
    maxDimension: pick(o.maxDimension, base.maxDimension, "maxDimension"),
  };
}

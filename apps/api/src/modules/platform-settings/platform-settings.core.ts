import {
  applyAssetOverrides,
  ASSET_LIMIT_RANGES,
  type AssetLimitOverrides,
  type AssetLimits,
} from "../website-assets/website-assets.limits.js";

export const ASSET_LIMITS_KEY = "asset_limits";
const FIELDS = ["maxMb", "maxDimension", "maxPerCouple"] as const;
type Field = (typeof FIELDS)[number];

export interface SettingsStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}
export interface Deps {
  store: SettingsStore;
  /** Env-built defaults: what applies when no override is set. */
  defaults: AssetLimits;
  ttlMs?: number;
  now?: () => number;
}

/** What the admin screen shows. `overrides` only has the fields an admin has set. */
export interface AssetLimitsView {
  effective: { maxMb: number; maxDimension: number; maxPerCouple: number };
  defaults: { maxMb: number; maxDimension: number; maxPerCouple: number };
  overrides: AssetLimitOverrides;
  ranges: typeof ASSET_LIMIT_RANGES;
}

export type ParseResult = { ok: true; patch: Partial<Record<Field, number | null>> } | { ok: false; error: string };

/** Validates an admin PATCH body. A number sets an override, null clears it, a missing field is left alone. */
export function parseAssetLimitsInput(body: unknown): ParseResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { ok: false, error: "Send an object of limits." };
  const input = body as Record<string, unknown>;
  const patch: Partial<Record<Field, number | null>> = {};
  for (const f of FIELDS) {
    const v = input[f];
    if (v === undefined) continue;
    if (v === null) {
      patch[f] = null;
      continue;
    }
    const { min, max } = ASSET_LIMIT_RANGES[f];
    if (typeof v !== "number" || !Number.isInteger(v) || v < min || v > max) {
      return { ok: false, error: `${f} must be a whole number from ${min} to ${max}.` };
    }
    patch[f] = v;
  }
  if (Object.keys(patch).length === 0) return { ok: false, error: "Nothing to change." };
  return { ok: true, patch };
}

function readOverrides(raw: string | null): AssetLimitOverrides {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: AssetLimitOverrides = {};
    for (const f of FIELDS) if (typeof parsed[f] === "number") out[f] = parsed[f] as number;
    return out;
  } catch {
    return {};
  }
}

const mb = (bytes: number) => bytes / (1024 * 1024);
const toNumbers = (l: AssetLimits) => ({ maxMb: mb(l.maxBytes), maxDimension: l.maxDimension, maxPerCouple: l.maxPerCouple });

export function createPlatformSettingsCore(deps: Deps) {
  const ttl = deps.ttlMs ?? 30_000;
  const now = deps.now ?? Date.now;
  let cached: { at: number; overrides: AssetLimitOverrides } | null = null;

  async function overrides(): Promise<AssetLimitOverrides> {
    if (cached && now() - cached.at < ttl) return cached.overrides;
    try {
      const o = readOverrides(await deps.store.get(ASSET_LIMITS_KEY));
      cached = { at: now(), overrides: o };
      return o;
    } catch (err) {
      // A settings read failure must never block uploads; fall back to what we last knew, else the env defaults.
      console.error("[platform-settings] read failed, using last known or default limits", err);
      return cached?.overrides ?? {};
    }
  }

  return {
    /** The limits to enforce right now: env defaults with admin overrides applied. Never throws. */
    async getAssetLimits(): Promise<AssetLimits> {
      return applyAssetOverrides(deps.defaults, await overrides());
    },

    async getAssetLimitsView(): Promise<AssetLimitsView> {
      const o = await overrides();
      return {
        effective: toNumbers(applyAssetOverrides(deps.defaults, o)),
        defaults: toNumbers(deps.defaults),
        overrides: o,
        ranges: ASSET_LIMIT_RANGES,
      };
    },

    async updateAssetLimits(patch: Partial<Record<Field, number | null>>): Promise<AssetLimitsView> {
      // Read through the store (not the cache) so a stale cache can't overwrite a recent change.
      const next = readOverrides(await deps.store.get(ASSET_LIMITS_KEY));
      for (const f of FIELDS) {
        const v = patch[f];
        if (v === null) delete next[f];
        else if (typeof v === "number") next[f] = v;
      }
      await deps.store.set(ASSET_LIMITS_KEY, JSON.stringify(next));
      cached = null;
      return this.getAssetLimitsView();
    },
  };
}

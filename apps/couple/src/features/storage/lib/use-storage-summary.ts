"use client";

import { useApiQuery } from "@/lib/use-api-query";
import { ASSET_LIMITS_KEY, ASSETS_KEY, LIST_CACHE } from "@/features/website/components/asset-library-api";
import { DEFAULT_ASSET_LIMITS, type AssetLimits, type WebsiteAsset } from "@/features/website/components/asset-library-logic";
import { summarizeStorage } from "./storage-summary";
import { useDriveConnection } from "./use-drive-connection";

/**
 * Numbers for the summary tiles. Shares the SWR keys with the image library on the same page, so it adds no
 * requests and follows uploads and deletes as they happen.
 */
export function useStorageSummary() {
  const assets = useApiQuery<{ assets: WebsiteAsset[] }>(ASSETS_KEY, LIST_CACHE);
  const limits = useApiQuery<{ limits: AssetLimits }>(ASSET_LIMITS_KEY, LIST_CACHE);
  const drive = useDriveConnection();

  return {
    loading: assets.loading || drive.loading,
    summary: summarizeStorage({
      sizes: assets.data ? assets.data.assets.map((a) => a.size_bytes) : null,
      maxImages: { ...DEFAULT_ASSET_LIMITS, ...limits.data?.limits }.maxPerCouple,
      drive: drive.connection,
    }),
  };
}

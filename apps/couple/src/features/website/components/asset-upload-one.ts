import { mutate } from "swr";
import { ApiError } from "@/lib/api";
import { ASSETS_KEY, readImageSize, uploadAsset } from "./asset-library-api";
import { type AssetLimits, DEFAULT_ASSET_LIMITS, dimensionsError, sizeError, validateAssetFile, type WebsiteAsset } from "./asset-library-logic";
import { optimizeImage } from "./asset-optimize";

/**
 * Uploads a single image straight from a file the couple picked (no library dialog): checks it, converts it to WebP
 * like the library does, uploads it, adds it to the library list, and returns its URL. Throws ApiError with a
 * message fit to show.
 */
export async function uploadSingleImage(
  file: File,
  onProgress: (percent: number) => void,
  signal: AbortSignal,
  limits: AssetLimits = DEFAULT_ASSET_LIMITS,
): Promise<string> {
  const unsupported = validateAssetFile(file);
  if (unsupported) throw new ApiError(unsupported, 0);
  const size = await readImageSize(file);
  const tooBig = size && dimensionsError(file.name, size.width, size.height, limits);
  if (tooBig) throw new ApiError(tooBig, 0);
  const { file: optimized } = await optimizeImage(file);
  const tooLarge = sizeError(optimized, limits);
  if (tooLarge) throw new ApiError(tooLarge, 0);
  const asset = await uploadAsset(optimized, onProgress, signal, undefined, limits);
  void mutate(ASSETS_KEY, (cur?: { assets: WebsiteAsset[] }) => ({ assets: [asset, ...(cur?.assets ?? [])] }), { revalidate: false });
  return asset.url;
}

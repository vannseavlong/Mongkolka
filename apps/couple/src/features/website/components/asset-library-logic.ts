/** Pure helpers for the asset library (no React, no network) so they can be unit-tested later. */

export interface WebsiteAsset {
  asset_id: string;
  url: string;
  mime: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  created_at: string | null;
}

export interface AssetUsage {
  sections: { section_id: string; section_key: string }[];
  cover: boolean;
}

export const ASSET_QUOTA = 100;
export const ASSET_MAX_BYTES = 8 * 1024 * 1024;
export const ASSET_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ASSET_ACCEPT = ASSET_TYPES.join(",");

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** Friendly message for a file the server would reject, or null when it looks fine. */
export function validateAssetFile(file: { name: string; type: string; size: number }): string | null {
  if (!ASSET_TYPES.includes(file.type)) return `${file.name}: only JPEG, PNG, WebP or GIF images are supported.`;
  if (file.size === 0) return `${file.name}: the file is empty.`;
  if (file.size > ASSET_MAX_BYTES) {
    return `${file.name}: ${formatBytes(file.size)} is over the ${formatBytes(ASSET_MAX_BYTES)} limit.`;
  }
  return null;
}

/** Friendly message for an upload failure from the API. */
export function uploadErrorMessage(status: number, fallback?: string): string {
  switch (status) {
    case 400:
      return "That file could not be read. Try a different image.";
    case 409:
      return `Your library is full (${ASSET_QUOTA} images). Delete some to upload more.`;
    case 413:
      return `Too large. Images must be under ${formatBytes(ASSET_MAX_BYTES)} and 12000 pixels on the longest side.`;
    case 415:
      return "Unsupported file type. Use JPEG, PNG, WebP or GIF.";
    case 502:
      return "Storage is unavailable right now. Please try again.";
    case 0:
      return "Network error. Check your connection and try again.";
    default:
      return fallback || "Upload failed. Please try again.";
  }
}

/** Splits picked files into those to upload (capped by remaining quota) and rejection messages. */
export function planUploads<F extends { name: string; type: string; size: number }>(
  files: F[],
  existingCount: number,
): { accepted: F[]; rejected: string[] } {
  const accepted: F[] = [];
  const rejected: string[] = [];
  let room = Math.max(0, ASSET_QUOTA - existingCount);
  for (const file of files) {
    const problem = validateAssetFile(file);
    if (problem) rejected.push(problem);
    else if (room <= 0) rejected.push(`${file.name}: your library is full (${ASSET_QUOTA} images).`);
    else {
      accepted.push(file);
      room -= 1;
    }
  }
  return { accepted, rejected };
}

/** Moves item `from` to `to`; returns the same array when the move is a no-op or out of range. */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item as T);
  return next;
}

/** Photo URLs stored in a gallery section's content (ignores anything that is not a string). */
export function photosOf(content: unknown): string[] {
  const photos = content && typeof content === "object" ? (content as { photos?: unknown }).photos : undefined;
  return Array.isArray(photos) ? photos.filter((p): p is string => typeof p === "string") : [];
}

/** Adds the url when absent, removes it when present. */
export function togglePhoto(photos: string[], url: string): string[] {
  return photos.includes(url) ? photos.filter((p) => p !== url) : [...photos, url];
}

export const ASSET_MAX_DIMENSION = 12000;
export const ASSET_UPLOAD_TIMEOUT_MS = 60_000;

/** Message when an image is larger than the server accepts on its longest side, else null. */
export function dimensionsError(name: string, width: number, height: number): string | null {
  return Math.max(width, height) > ASSET_MAX_DIMENSION
    ? `${name}: ${width}x${height} pixels is over the ${ASSET_MAX_DIMENSION} pixel limit. Resize it and try again.`
    : null;
}

/** True for a well-formed http(s) URL. */
export function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export const URL_ERROR = "Enter a full address starting with http:// or https://";

/** Returns `incoming` without URLs already in `existing` (and without repeats within itself). */
export function newUrlsOnly(existing: string[], incoming: string[]): string[] {
  const seen = new Set(existing);
  return incoming.filter((u) => (seen.has(u) ? false : (seen.add(u), true)));
}

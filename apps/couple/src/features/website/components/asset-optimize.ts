/**
 * Browser-side image optimizer: scales a big camera photo down and compresses it before upload, so guests download
 * a small file. Quality and size come from the admin's upload settings. No React, no network.
 * It never makes things worse: whenever it cannot help, the original file is returned.
 */

export interface EncodeSettings {
  /** Percent, 1-100. */
  webpQuality: number;
  /** Longest side in pixels; larger images are scaled down, smaller ones are never enlarged. */
  resizeTo: number;
}

/** GIF may be animated, so it is never touched. */
const CONVERTIBLE = ["image/jpeg", "image/png", "image/webp"];

const EXTENSION: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg" };

export function renamed(name: string, type: string): string {
  const dot = name.lastIndexOf(".");
  return `${dot > 0 ? name.slice(0, dot) : name}.${EXTENSION[type]}`;
}

/** The size to draw at: the longest side capped to `max`, aspect ratio kept. */
export function fitWithin(width: number, height: number, max: number): { width: number; height: number; scaled: boolean } {
  const longest = Math.max(width, height);
  if (longest <= max) return { width, height, scaled: false };
  const k = max / longest;
  return { width: Math.max(1, Math.round(width * k)), height: Math.max(1, Math.round(height * k)), scaled: true };
}

export interface OptimizeResult {
  file: File;
  converted: boolean;
  /** Bytes saved (0 when the original was kept). */
  savedBytes: number;
}

/** Pure choice between the original and the encoded file: keep the new one only if it is a real image and smaller. */
export function pickSmaller(original: File, blob: Blob | null): OptimizeResult {
  if (!blob || !EXTENSION[blob.type] || blob.size === 0 || blob.size >= original.size) {
    return { file: original, converted: false, savedBytes: 0 };
  }
  const file = new File([blob], renamed(original.name, blob.type), { type: blob.type, lastModified: original.lastModified });
  return { file, converted: true, savedBytes: original.size - blob.size };
}

async function encode(file: File, { webpQuality, resizeTo }: EncodeSettings): Promise<Blob | null> {
  // Applies the EXIF rotation, so the stored file (which carries no EXIF) stays upright.
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const size = fitWithin(bitmap.width, bitmap.height, resizeTo);
    // Re-encoding a WebP that is already small enough would only lose detail.
    if (file.type === "image/webp" && !size.scaled) return null;
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, size.width, size.height);
    const toBlob = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, webpQuality / 100));
    const webp = await toBlob("image/webp");
    if (webp?.type === "image/webp") return webp;
    // Safari has no WebP encoder. A JPEG source can stay JPEG; PNG and WebP may be transparent, so leave them.
    return file.type === "image/jpeg" ? await toBlob("image/jpeg") : null;
  } finally {
    bitmap.close();
  }
}

export async function optimizeImage(file: File, settings: EncodeSettings): Promise<OptimizeResult> {
  if (!CONVERTIBLE.includes(file.type)) return { file, converted: false, savedBytes: 0 };
  try {
    return pickSmaller(file, await encode(file, settings));
  } catch {
    // Undecodable or too large for the canvas: let the server decide.
    return { file, converted: false, savedBytes: 0 };
  }
}

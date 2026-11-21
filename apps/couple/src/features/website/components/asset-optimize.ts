/**
 * Browser-side image optimizer: re-encodes JPEG/PNG as WebP at maximum quality before upload,
 * so big camera photos fit the server limit without visible loss. No React, no network.
 * It never makes things worse: whenever it cannot help, the original file is returned.
 */

/** 1 = the encoder's maximum quality (same as `quality=100` in Img2web). */
export const WEBP_QUALITY = 1;

/** Types worth converting. GIF may be animated and WebP is already WebP (re-encoding only loses detail). */
const CONVERTIBLE = ["image/jpeg", "image/png"];

export function webpName(name: string): string {
  const dot = name.lastIndexOf(".");
  return `${dot > 0 ? name.slice(0, dot) : name}.webp`;
}

export interface OptimizeResult {
  file: File;
  converted: boolean;
  /** Bytes saved (0 when the original was kept). */
  savedBytes: number;
}

/** Pure choice between the original and the converted file: keep the WebP only if it is a real WebP and smaller. */
export function pickSmaller(original: File, blob: Blob | null): OptimizeResult {
  if (!blob || blob.type !== "image/webp" || blob.size === 0 || blob.size >= original.size) {
    return { file: original, converted: false, savedBytes: 0 };
  }
  const file = new File([blob], webpName(original.name), { type: "image/webp", lastModified: original.lastModified });
  return { file, converted: true, savedBytes: original.size - blob.size };
}

async function encodeWebp(file: File): Promise<Blob | null> {
  // Applies the EXIF rotation, so the stored WebP (which carries no EXIF) stays upright.
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
      return await canvas.convertToBlob({ type: "image/webp", quality: WEBP_QUALITY });
    }
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", WEBP_QUALITY));
  } finally {
    bitmap.close();
  }
}

export async function optimizeImage(file: File): Promise<OptimizeResult> {
  if (!CONVERTIBLE.includes(file.type)) return { file, converted: false, savedBytes: 0 };
  try {
    return pickSmaller(file, await encodeWebp(file));
  } catch {
    // Undecodable, too large for the canvas, or no WebP encoder (e.g. Safari returns PNG): let the server decide.
    return { file, converted: false, savedBytes: 0 };
  }
}

import { env } from "../../config/env.js";
import { createLocalStorage } from "./local.driver.js";
import { createS3Storage } from "./s3.driver.js";
import { createCoupleStorage } from "../drive/couple-storage.js";
import { driveEnabled, driveRuntime } from "../drive/drive.runtime.js";
import type { PhotoStorage } from "./storage.types.js";

export type { PhotoStorage } from "./storage.types.js";

function build(): PhotoStorage {
  if (env.PHOTO_STORAGE === "s3") {
    const missing = ["S3_BUCKET", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "S3_PUBLIC_BASE_URL"].filter(
      (k) => !env[k as keyof typeof env],
    );
    if (missing.length) throw new Error(`PHOTO_STORAGE=s3 but missing: ${missing.join(", ")}`);
    return createS3Storage({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      bucket: env.S3_BUCKET,
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      publicBaseUrl: env.S3_PUBLIC_BASE_URL,
    });
  }
  return createLocalStorage(env.PHOTO_LOCAL_DIR, env.PUBLIC_API_URL);
}

let instance: PhotoStorage | undefined;

/** Lazily built so a bad S3 config only fails the photo endpoints, not API startup. */
export function photoStorage(): PhotoStorage {
  instance ??= build();
  return instance;
}

/**
 * Storage for one couple's files. A couple with an active Google Drive connection gets their own
 * Drive (files served through /media); everyone else, and any Drive failure, uses the default
 * driver so an upload is never lost. Keys passed in must start with `couples/<coupleId>/`.
 */
export function storageFor(coupleId: string): PhotoStorage {
  const fallback = photoStorage();
  if (!driveEnabled()) return fallback;
  const drive = driveRuntime();
  return createCoupleStorage({
    coupleId,
    fallback,
    drive: drive.gateway,
    isConnected: drive.isConnected,
    markNeedsReconnect: drive.markNeedsReconnect,
    publicApiUrl: env.PUBLIC_API_URL,
  });
}

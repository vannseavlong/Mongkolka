import type { PhotoStorage } from "../storage/storage.types.js";
import { isNotFound, isRevokedGrant } from "./drive-errors.js";
import type { DriveGateway } from "./drive.gateway.js";
import { buildMediaUrl, parseMediaUrl } from "./media-url.js";

export interface CoupleStorageDeps {
  coupleId: string;
  /** Used when the couple has no active connection, or Drive fails (a guest's photo is never lost). */
  fallback: PhotoStorage;
  drive: DriveGateway;
  isConnected: (coupleId: string) => Promise<boolean>;
  markNeedsReconnect: (coupleId: string, reason: string) => Promise<void>;
  publicApiUrl: string;
  log?: (msg: string, err?: unknown) => void;
}

/** `couples/<id>/assets/x.jpg` -> `Mongkolka/assets`; keys without that shape land in `Mongkolka`. */
export function driveFolderFor(key: string): string {
  const parts = key.split("/");
  const sub = parts[0] === "couples" && parts.length >= 4 ? parts[2] : parts.length >= 3 ? parts[1] : undefined;
  return sub ? `Mongkolka/${sub}` : "Mongkolka";
}

export function createCoupleStorage(d: CoupleStorageDeps): PhotoStorage {
  const log = d.log ?? ((msg, err) => console.error(msg, err));

  return {
    async put(key, body, mimeType) {
      if (await d.isConnected(d.coupleId)) {
        try {
          const fileId = await d.drive.upload(d.coupleId, {
            filename: key.split("/").pop() ?? key,
            mimeType,
            folder: driveFolderFor(key),
            body,
          });
          return buildMediaUrl(d.publicApiUrl, d.coupleId, fileId);
        } catch (err) {
          if (isRevokedGrant(err)) {
            await d.markNeedsReconnect(d.coupleId, "Google access was revoked or expired").catch((e) =>
              log("[couple-storage] could not flag connection", e),
            );
          } else {
            log(`[couple-storage] Drive upload failed for ${key}; using default storage`, err);
          }
        }
      }
      return d.fallback.put(key, body, mimeType);
    },

    async delete(key, url) {
      const fileId = parseMediaUrl(url, d.coupleId);
      if (!fileId) return d.fallback.delete(key, url);
      try {
        await d.drive.remove(d.coupleId, fileId);
      } catch (err) {
        if (isNotFound(err)) return;
        // Revoked or offline: the file stays in the couple's own Drive, which they can clean up.
        log(`[couple-storage] could not delete Drive file ${fileId}`, err);
      }
    },
  };
}

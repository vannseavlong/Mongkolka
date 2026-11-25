import type { Readable } from "node:stream";
import { isValidCoupleId, isValidFileId } from "../../services/drive/media-url.js";
import type { DriveGateway } from "../../services/drive/drive.gateway.js";

/** Only the image types uploads are validated for; anything else in a couple's Drive is not served. */
const SERVABLE = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type MediaResult =
  | { status: 404 }
  | { status: 304; etag: string }
  | { status: 200; mimeType: string; size: number; etag: string; stream: Readable };

export interface MediaDeps {
  drive: Pick<DriveGateway, "stat" | "read">;
  isConnected: (coupleId: string) => Promise<boolean>;
}

/**
 * Serves one Drive file for one couple. The couple's own token is used to read it, and a
 * drive.file token only sees files this app created in that Drive, so a file id from another
 * couple (or any unrelated file) simply is not found here.
 */
export function createMediaCore(deps: MediaDeps) {
  return async function serve(coupleId: string, fileId: string, ifNoneMatch?: string): Promise<MediaResult> {
    if (!isValidCoupleId(coupleId) || !isValidFileId(fileId)) return { status: 404 };
    if (!(await deps.isConnected(coupleId))) return { status: 404 };

    const info = await deps.drive.stat(coupleId, fileId);
    if (!info || !SERVABLE.has(info.mimeType)) return { status: 404 };

    const etag = info.etag ? `"${info.etag}"` : "";
    if (etag && ifNoneMatch?.split(",").some((t) => t.trim() === etag)) return { status: 304, etag };

    return { status: 200, mimeType: info.mimeType, size: info.size, etag, stream: await deps.drive.read(coupleId, fileId) };
  };
}

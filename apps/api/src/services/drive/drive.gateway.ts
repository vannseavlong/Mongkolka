import type { Readable } from "node:stream";

export interface DriveFileInfo {
  mimeType: string;
  size: number;
  /** Drive's md5 of the content, used as the ETag. */
  etag: string;
}

/** What the app needs from a couple's Drive. Implemented over lsdb (write) and googleapis (read). */
export interface DriveGateway {
  /** Returns the Drive file id. */
  upload(coupleId: string, file: { filename: string; mimeType: string; folder: string; body: Buffer }): Promise<string>;
  remove(coupleId: string, fileId: string): Promise<void>;
  /** null when the file is not in this couple's Drive. */
  stat(coupleId: string, fileId: string): Promise<DriveFileInfo | null>;
  read(coupleId: string, fileId: string): Promise<Readable>;
  /** Drops cached clients so a reconnect or disconnect takes effect immediately. */
  evict(coupleId: string): void;
}

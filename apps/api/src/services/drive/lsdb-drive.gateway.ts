import type { Readable } from "node:stream";
import { buildDriveDownloadUrl, extractDriveFileId, type SheetAdapter } from "longcelot-sheet-db";
import { google, type drive_v3 } from "googleapis";
import { isNotFound } from "./drive-errors.js";
import { driveActorId } from "./drive-token.store.js";
import type { DriveFileInfo, DriveGateway } from "./drive.gateway.js";

const MAX_CLIENTS = 200;

interface Deps {
  adapter: SheetAdapter;
  credentials: { clientId: string; clientSecret: string };
  refreshTokenFor: (coupleId: string) => Promise<string>;
}

/**
 * Writes go through lsdb (DriveStorageAdapter), which creates the folders and uploads into the
 * couple's own Drive because the token store answers for `drive:<coupleId>`. Reads use googleapis
 * directly: lsdb has no download call.
 */
export function createLsdbDriveGateway(deps: Deps): DriveGateway {
  const readers = new Map<string, drive_v3.Drive>();
  const scoped = new Map<string, ReturnType<SheetAdapter["withContext"]>>();

  // deleteFile() takes its actor from withContext(), and withContext() starts a schema check,
  // so build one per couple and reuse it.
  function ctx(coupleId: string) {
    let c = scoped.get(coupleId);
    if (!c) {
      if (scoped.size >= MAX_CLIENTS) scoped.clear();
      c = deps.adapter.withContext({ userId: driveActorId(coupleId), actor: "couple", actorSheetId: "" });
      scoped.set(coupleId, c);
    }
    return c;
  }

  async function reader(coupleId: string) {
    let r = readers.get(coupleId);
    if (!r) {
      const auth = new google.auth.OAuth2(deps.credentials.clientId, deps.credentials.clientSecret);
      auth.setCredentials({ refresh_token: await deps.refreshTokenFor(coupleId) });
      if (readers.size >= MAX_CLIENTS) readers.clear();
      r = google.drive({ version: "v3", auth });
      readers.set(coupleId, r);
    }
    return r;
  }

  return {
    async upload(coupleId, file) {
      const url = await deps.adapter.upload(file.body, {
        filename: file.filename,
        mimeType: file.mimeType,
        folder: file.folder,
        public: false,
        linkFormat: "download",
        actorContext: { userId: driveActorId(coupleId), actor: "couple" },
      });
      const fileId = extractDriveFileId(url);
      if (!fileId) throw new Error("Drive upload returned no file id");
      return fileId;
    },

    async remove(coupleId, fileId) {
      await ctx(coupleId).deleteFile(buildDriveDownloadUrl(fileId));
    },

    async stat(coupleId, fileId): Promise<DriveFileInfo | null> {
      try {
        const { data } = await (await reader(coupleId)).files.get({
          fileId,
          fields: "mimeType,size,md5Checksum,trashed",
        });
        if (data.trashed || !data.mimeType) return null;
        return { mimeType: data.mimeType, size: Number(data.size ?? 0), etag: data.md5Checksum ?? "" };
      } catch (err) {
        if (isNotFound(err)) return null;
        throw err;
      }
    },

    async read(coupleId, fileId): Promise<Readable> {
      const res = await (await reader(coupleId)).files.get({ fileId, alt: "media" }, { responseType: "stream" });
      return res.data as Readable;
    },

    evict(coupleId) {
      readers.delete(coupleId);
      scoped.delete(coupleId);
      // lsdb keeps the couple's Drive client (and folder ids) for the life of the process and has
      // no public way to drop them, so a reconnect would keep using the old token.
      // TODO(upstream): ask lsdb for DriveStorageAdapter.evictActor(userId) and drop this.
      const storage = (deps.adapter as unknown as { storage?: Record<string, unknown> }).storage;
      const clients = storage?._actorClientCache;
      if (clients instanceof Map) clients.delete(driveActorId(coupleId));
      const folders = storage?._folderCache;
      if (folders instanceof Map) {
        for (const k of [...folders.keys()]) if (String(k).startsWith(`actor:${driveActorId(coupleId)}:`)) folders.delete(k);
      }
    },
  };
}

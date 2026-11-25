import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { PhotoStorage } from "../storage/storage.types.js";
import { createCoupleStorage, driveFolderFor } from "./couple-storage.js";
import type { DriveGateway } from "./drive.gateway.js";
import { buildMediaUrl, parseMediaUrl } from "./media-url.js";

const API = "https://api.test";
const FILE = "1AbCdEfGhIjKlMnOp";

function setup(opts: { connected?: boolean; uploadError?: unknown; removeError?: unknown } = {}) {
  const calls = { fallbackPut: [] as string[], fallbackDelete: [] as string[], uploads: [] as unknown[], removed: [] as string[], flagged: [] as string[] };
  const fallback: PhotoStorage = {
    async put(key) { calls.fallbackPut.push(key); return `${API}/uploads/${key}`; },
    async delete(key) { calls.fallbackDelete.push(key); },
  };
  const drive = {
    async upload(_c: string, f: unknown) { if (opts.uploadError) throw opts.uploadError; calls.uploads.push(f); return FILE; },
    async remove(_c: string, id: string) { if (opts.removeError) throw opts.removeError; calls.removed.push(id); },
  } as unknown as DriveGateway;
  const storage = createCoupleStorage({
    coupleId: "c1", fallback, drive, publicApiUrl: API, log: () => {},
    isConnected: async () => opts.connected ?? true,
    markNeedsReconnect: async (c) => { calls.flagged.push(c); },
  });
  return { storage, calls };
}

describe("couple storage", () => {
  it("stores connected couples' files in Drive and returns a /media URL", async () => {
    const { storage, calls } = setup();
    const url = await storage.put("couples/c1/assets/a.jpg", Buffer.from("x"), "image/jpeg");
    assert.equal(url, `${API}/media/c1/${FILE}`);
    assert.equal(calls.fallbackPut.length, 0);
    assert.deepEqual(calls.uploads[0], { filename: "a.jpg", mimeType: "image/jpeg", folder: "Mongkolka/assets", body: Buffer.from("x") });
  });

  it("uses the default driver when the couple is not connected", async () => {
    const { storage, calls } = setup({ connected: false });
    const url = await storage.put("couples/c1/assets/a.jpg", Buffer.from("x"), "image/jpeg");
    assert.match(url, /\/uploads\//);
    assert.equal(calls.uploads.length, 0);
  });

  it("falls back and flags needs_reconnect when Google revoked the grant", async () => {
    const { storage, calls } = setup({ uploadError: new Error("invalid_grant") });
    const url = await storage.put("couples/c1/assets/a.jpg", Buffer.from("x"), "image/jpeg");
    assert.match(url, /\/uploads\//);
    assert.deepEqual(calls.flagged, ["c1"]);
  });

  it("falls back without flagging on other Drive errors", async () => {
    const { storage, calls } = setup({ uploadError: new Error("quota") });
    await storage.put("couples/c1/assets/a.jpg", Buffer.from("x"), "image/jpeg");
    assert.equal(calls.fallbackPut.length, 1);
    assert.equal(calls.flagged.length, 0);
  });

  it("deletes Drive files by media URL and other files through the default driver", async () => {
    const { storage, calls } = setup();
    await storage.delete("k", `${API}/media/c1/${FILE}`);
    assert.deepEqual(calls.removed, [FILE]);
    await storage.delete("couples/c1/assets/old.jpg", `${API}/uploads/couples/c1/assets/old.jpg`);
    assert.deepEqual(calls.fallbackDelete, ["couples/c1/assets/old.jpg"]);
  });

  it("never deletes another couple's media URL from Drive", async () => {
    const { storage, calls } = setup();
    await storage.delete("k", `${API}/media/other/${FILE}`);
    assert.equal(calls.removed.length, 0);
  });

  it("swallows a missing file and a failing Drive delete", async () => {
    await setup({ removeError: { code: 404 } }).storage.delete("k", `${API}/media/c1/${FILE}`);
    await setup({ removeError: new Error("offline") }).storage.delete("k", `${API}/media/c1/${FILE}`);
  });
});

describe("helpers", () => {
  it("builds folders from keys", () => {
    assert.equal(driveFolderFor("couples/c1/assets/a.jpg"), "Mongkolka/assets");
    assert.equal(driveFolderFor("couples/c1/guest-photos/a.jpg"), "Mongkolka/guest-photos");
    assert.equal(driveFolderFor("a.jpg"), "Mongkolka");
  });
  it("round-trips media urls and rejects junk", () => {
    assert.equal(parseMediaUrl(buildMediaUrl(API, "c1", FILE), "c1"), FILE);
    assert.equal(parseMediaUrl(buildMediaUrl(API, "c1", FILE), "c2"), null);
    assert.equal(parseMediaUrl(`${API}/media/c1/../x`, "c1"), null);
    assert.equal(parseMediaUrl(undefined, "c1"), null);
  });
});

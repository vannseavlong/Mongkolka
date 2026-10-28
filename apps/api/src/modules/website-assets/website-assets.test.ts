import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createWebsiteAssetsCore,
  type AssetModel,
  type AssetRecord,
  type AssetStorage,
  type SectionRecord,
} from "./website-assets.core.js";
import { ASSET_LIMITS } from "./website-assets.limits.js";

const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(40)]);
PNG.writeUInt32BE(640, 16);
PNG.writeUInt32BE(480, 20);

function setup(opts: { putFails?: boolean; createFails?: boolean } = {}) {
  const assets = new Map<string, AssetRecord[]>();
  const sections = new Map<string, SectionRecord[]>();
  const profiles = new Map<string, { profile_id: string; cover_photo_url?: unknown }>();
  let beforeSectionWrite: (() => void) | undefined;
  const files = new Map<string, string>(); // key -> couple that stored it
  const invalidated: string[] = [];
  const rows = (s: string) => assets.get(s) ?? [];
  const model: AssetModel = {
    findMany: async (s) => [...rows(s)],
    findById: async (s, id) => rows(s).find((r) => r.asset_id === id) ?? null,
    create: async (s, d) => {
      if (opts.createFails) throw new Error("sheet down");
      await new Promise((r) => setTimeout(r, 5)); // widen the race window
      assets.set(s, [...rows(s), d as unknown as AssetRecord]);
    },
    delete: async (s, id) => void assets.set(s, rows(s).filter((r) => r.asset_id !== id)),
    findSections: async (s) => sections.get(s) ?? [],
    findSectionById: async (s, id) => {
      const sec = (sections.get(s) ?? []).find((x) => x.section_id === id);
      return sec ? { ...sec } : null;
    },
    findProfile: async (s) => profiles.get(s) ?? null,
    updateProfileCover: async (s, _id, url) => {
      const p = profiles.get(s);
      if (p) p.cover_photo_url = url;
    },
    updateSectionContent: async (s, id, content) => {
      beforeSectionWrite?.();
      for (const sec of sections.get(s) ?? []) if (sec.section_id === id) sec.content = content;
    },
  };
  const storageFor = (coupleId: string): AssetStorage => ({
    put: async (key) => {
      if (opts.putFails) throw new Error("disk full");
      files.set(key, coupleId);
      return `https://cdn.test/${key}`;
    },
    delete: async (key) => void files.delete(key),
  });
  const core = createWebsiteAssetsCore({ model, storageFor, invalidateCouple: (c) => invalidated.push(c) });
  return { core, assets, sections, profiles, files, invalidated, onBeforeSectionWrite: (fn: () => void) => (beforeSectionWrite = fn) };
}

const A = { coupleId: "cA", actorSheetId: "sheetA" };
const B = { coupleId: "cB", actorSheetId: "sheetB" };
const png = { body: PNG, mimeType: "image/png" };

describe("website assets: validation", () => {
  it("rejects empty, wrong mime, spoofed bytes and oversize", async () => {
    const { core, files } = setup();
    assert.deepEqual(await core.upload(A, { body: Buffer.alloc(0), mimeType: "image/png" }), { ok: false, status: 400, error: "empty" });
    assert.deepEqual(await core.upload(A, { body: PNG, mimeType: "application/pdf" }), { ok: false, status: 415, error: "unsupported_type" });
    const spoof = await core.upload(A, { body: Buffer.from("<script>alert(1)</script>"), mimeType: "image/png" });
    assert.deepEqual(spoof, { ok: false, status: 415, error: "unsupported_type" });
    const big = Buffer.concat([PNG, Buffer.alloc(ASSET_LIMITS.maxBytes)]);
    assert.deepEqual(await core.upload(A, { body: big, mimeType: "image/png" }), { ok: false, status: 413, error: "too_large" });
    assert.equal(files.size, 0);
  });

  it("stores under couples/<id>/assets/<uuid>.<ext> with header-derived dimensions", async () => {
    const { core, files } = setup();
    const r = await core.upload(A, png);
    assert.ok(r.ok);
    const [key] = [...files.keys()];
    assert.match(key!, /^couples\/cA\/assets\/[0-9a-f-]{36}\.png$/);
    assert.equal(r.asset.width, 640);
    assert.equal(r.asset.height, 480);
    assert.equal(r.asset.url, `https://cdn.test/${key}`);
  });
});

describe("website assets: dimensions", () => {
  it("rejects images over 12000 px", async () => {
    const { core } = setup();
    const huge = Buffer.from(PNG);
    huge.writeUInt32BE(12001, 16);
    assert.deepEqual(await core.upload(A, { body: huge, mimeType: "image/png" }), { ok: false, status: 413, error: "image_too_large" });
  });
});

describe("website assets: quota and concurrency", () => {
  it("rejects past the per-couple limit", async () => {
    const { core, assets } = setup();
    assets.set("sheetA", Array.from({ length: ASSET_LIMITS.maxPerCouple }, (_, i) => ({ asset_id: `x${i}` }) as AssetRecord));
    assert.deepEqual(await core.upload(A, png), { ok: false, status: 409, error: "quota_exceeded" });
  });

  it("parallel uploads cannot overshoot the quota", async () => {
    const { core, assets } = setup();
    assets.set("sheetA", Array.from({ length: ASSET_LIMITS.maxPerCouple - 2 }, (_, i) => ({ asset_id: `x${i}` }) as AssetRecord));
    const results = await Promise.all(Array.from({ length: 6 }, () => core.upload(A, png)));
    assert.equal(results.filter((r) => r.ok).length, 2);
    assert.equal(assets.get("sheetA")!.length, ASSET_LIMITS.maxPerCouple);
  });
});

describe("website assets: failures", () => {
  it("reports storage failure and writes no row", async () => {
    const { core, assets } = setup({ putFails: true });
    assert.deepEqual(await core.upload(A, png), { ok: false, status: 502, error: "storage_failed" });
    assert.equal(assets.get("sheetA")?.length ?? 0, 0);
  });

  it("removes the stored file when the row cannot be created", async () => {
    const { core, files } = setup({ createFails: true });
    assert.equal((await core.upload(A, png)).ok, false);
    assert.equal(files.size, 0);
  });
});

describe("website assets: ownership isolation", () => {
  it("couple B cannot list, inspect or delete couple A's asset", async () => {
    const { core, files } = setup();
    const up = await core.upload(A, png);
    assert.ok(up.ok);
    const id = up.asset.asset_id;
    assert.equal((await core.list(B)).length, 0);
    assert.equal(await core.usage(B, id), null);
    assert.deepEqual(await core.remove(B, id, true), { ok: false, status: 404, error: "not_found" });
    assert.equal((await core.list(A)).length, 1);
    assert.equal(files.size, 1);
  });
});

describe("website assets: delete in use", () => {
  async function withUsage() {
    const s = setup();
    const up = await s.core.upload(A, png);
    assert.ok(up.ok);
    const url = up.asset.url;
    s.sections.set("sheetA", [
      { section_id: "s1", section_key: "gallery", content: { photos: [url, "https://other/x.jpg"] } },
      { section_id: "s2", section_key: "hero", content: JSON.stringify({ image: url, title: "Hi" }) },
      { section_id: "s3", section_key: "story", content: { text: "none" } },
    ]);
    return { ...s, id: up.asset.asset_id };
  }

  it("lists the sections using the asset", async () => {
    const { core, id } = await withUsage();
    assert.deepEqual(await core.usage(A, id), {
      sections: [
        { section_id: "s1", section_key: "gallery" },
        { section_id: "s2", section_key: "hero" },
      ],
      cover: false,
    });
  });

  it("refuses without force and changes nothing", async () => {
    const { core, id, files, invalidated } = await withUsage();
    const r = await core.remove(A, id, false);
    assert.equal(r.ok, false);
    assert.equal(!r.ok && r.status, 409);
    assert.equal(files.size, 1);
    assert.equal(invalidated.length, 0);
  });

  it("with force strips the URL, deletes row and file, invalidates the public cache", async () => {
    const { core, id, files, sections, invalidated, assets } = await withUsage();
    assert.deepEqual(await core.remove(A, id, true), { ok: true });
    const [s1, s2] = sections.get("sheetA")!;
    assert.deepEqual(s1!.content, { photos: ["https://other/x.jpg"] });
    assert.deepEqual(s2!.content, { image: "", title: "Hi" });
    assert.equal(files.size, 0);
    assert.equal(assets.get("sheetA")!.length, 0);
    assert.deepEqual(invalidated, ["cA"]);
  });

  it("a section edited to drop the URL after the scan is not rewritten", async () => {
    const { core, id, sections, onBeforeSectionWrite } = await withUsage();
    // s2 is written second; before the first write, s2 is replaced with new content lacking the URL
    onBeforeSectionWrite(() => {
      sections.get("sheetA")![1]!.content = { image: "https://new/y.jpg", title: "New" };
    });
    assert.deepEqual(await core.remove(A, id, true), { ok: true });
    assert.deepEqual(sections.get("sheetA")![1]!.content, { image: "https://new/y.jpg", title: "New" });
  });

  it("treats couple_profile.cover_photo_url as usage and strips it on force", async () => {
    const { core, id, profiles, assets, invalidated } = await withUsage();
    const url = assets.get("sheetA")![0]!.url;
    profiles.set("sheetA", { profile_id: "p1", cover_photo_url: url });
    const u = await core.usage(A, id);
    assert.equal(u?.cover, true);
    const r = await core.remove(A, id, false);
    assert.equal(!r.ok && r.status, 409);
    assert.equal(!r.ok && r.cover, true);
    assert.equal(profiles.get("sheetA")!.cover_photo_url, url);
    assert.deepEqual(await core.remove(A, id, true), { ok: true });
    assert.equal(profiles.get("sheetA")!.cover_photo_url, "");
    assert.deepEqual(invalidated, ["cA"]);
  });

  it("an asset used only as cover blocks delete without force", async () => {
    const { core, profiles } = setup();
    const up = await core.upload(A, png);
    assert.ok(up.ok);
    profiles.set("sheetA", { profile_id: "p1", cover_photo_url: up.asset.url });
    const r = await core.remove(A, up.asset.asset_id, false);
    assert.equal(!r.ok && r.error, "in_use");
  });

  it("deleting an unused asset needs no force and does not touch the cache", async () => {
    const { core, files, invalidated } = setup();
    const up = await core.upload(A, png);
    assert.ok(up.ok);
    assert.deepEqual(await core.remove(A, up.asset.asset_id, false), { ok: true });
    assert.equal(files.size, 0);
    assert.equal(invalidated.length, 0);
  });
});

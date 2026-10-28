import { randomUUID } from "node:crypto";
import { KeyedLock } from "../../utils/keyed-lock.js";
import { matchesSignature, readImageSize } from "../../utils/image-signature.js";
import { ALLOWED_MIME, ASSET_LIMITS } from "./website-assets.limits.js";

/** Minimal shapes the core needs; the real model/storage satisfy them, tests fake them. */
export interface AssetRecord {
  asset_id: string;
  url: string;
  storage_key: string;
  mime: string;
  size_bytes: number;
  width?: unknown;
  height?: unknown;
  _created_at?: unknown;
  [k: string]: unknown;
}
export interface SectionRecord {
  section_id: string;
  section_key: string;
  content?: unknown;
  [k: string]: unknown;
}
export interface AssetModel {
  findMany(sheet: string): Promise<AssetRecord[]>;
  findById(sheet: string, id: string): Promise<AssetRecord | null>;
  create(sheet: string, data: Record<string, unknown>): Promise<unknown>;
  delete(sheet: string, id: string): Promise<unknown>;
  findSections(sheet: string): Promise<SectionRecord[]>;
  updateSectionContent(sheet: string, sectionId: string, content: unknown): Promise<unknown>;
}
export interface AssetStorage {
  put(key: string, body: Buffer, mime: string): Promise<string>;
  delete(key: string): Promise<void>;
}
export interface Deps {
  model: AssetModel;
  storageFor: (coupleId: string) => AssetStorage;
  invalidateCouple: (coupleId: string) => void;
}
export interface Tenant {
  coupleId: string;
  actorSheetId: string;
}

export type UploadError = "empty" | "too_large" | "unsupported_type" | "quota_exceeded" | "storage_failed";
export type UploadResult =
  | { ok: true; asset: PublicAsset }
  | { ok: false; status: 400 | 409 | 413 | 415 | 502; error: UploadError };
export type DeleteResult =
  | { ok: true }
  | { ok: false; status: 404 | 409; error: "not_found" | "in_use"; sections?: UsageSection[] };

export interface UsageSection {
  section_id: string;
  section_key: string;
}
export interface PublicAsset {
  asset_id: string;
  url: string;
  mime: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  created_at: string | null;
}

function toPublic(r: AssetRecord): PublicAsset {
  const num = (v: unknown) => (v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));
  return {
    asset_id: r.asset_id,
    url: r.url,
    mime: r.mime,
    size_bytes: Number(r.size_bytes ?? 0),
    width: num(r.width),
    height: num(r.height),
    created_at: typeof r._created_at === "string" ? r._created_at : null,
  };
}

/** Section content may arrive as an object or a JSON string depending on the sheet layer. */
function parseContent(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function containsUrl(node: unknown, url: string): boolean {
  if (node === url) return true;
  if (Array.isArray(node)) return node.some((n) => containsUrl(n, url));
  if (node && typeof node === "object") return Object.values(node).some((n) => containsUrl(n, url));
  return false;
}

/** Array items equal to the URL are removed; object fields equal to it become "". */
function stripUrl(node: unknown, url: string): unknown {
  if (Array.isArray(node)) return node.filter((n) => n !== url).map((n) => stripUrl(n, url));
  if (node && typeof node === "object") {
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [k, v === url ? "" : stripUrl(v, url)]),
    );
  }
  return node;
}

export function createWebsiteAssetsCore(deps: Deps) {
  const { model } = deps;
  const lock = new KeyedLock();

  async function usageOf(sheet: string, url: string): Promise<{ section: SectionRecord; content: unknown }[]> {
    const sections = await model.findSections(sheet);
    return sections
      .map((section) => ({ section, content: parseContent(section.content) }))
      .filter((s) => containsUrl(s.content, url));
  }

  return {
    async list(t: Tenant): Promise<PublicAsset[]> {
      const rows = await model.findMany(t.actorSheetId);
      return rows
        .map(toPublic)
        .sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
    },

    async upload(t: Tenant, input: { body: Buffer; mimeType: string }): Promise<UploadResult> {
      if (input.body.length === 0) return { ok: false, status: 400, error: "empty" };
      const ext = ALLOWED_MIME[input.mimeType];
      if (!ext || !matchesSignature(input.mimeType, input.body)) {
        return { ok: false, status: 415, error: "unsupported_type" };
      }
      if (input.body.length > ASSET_LIMITS.maxBytes) return { ok: false, status: 413, error: "too_large" };

      // Count-check and insert are serialised per couple so parallel uploads can't overshoot the quota.
      return lock.run(t.coupleId, async (): Promise<UploadResult> => {
        const existing = await model.findMany(t.actorSheetId);
        if (existing.length >= ASSET_LIMITS.maxPerCouple) {
          return { ok: false, status: 409, error: "quota_exceeded" };
        }
        const assetId = randomUUID();
        // Key is built from ids and an allowlisted extension; the client filename is never used.
        const key = `couples/${t.coupleId}/assets/${assetId}.${ext}`;
        const storage = deps.storageFor(t.coupleId);
        let url: string;
        try {
          url = await storage.put(key, input.body, input.mimeType);
        } catch (err) {
          console.error(`[website-assets] storage put failed for ${key}`, err);
          return { ok: false, status: 502, error: "storage_failed" };
        }
        const size = readImageSize(input.mimeType, input.body);
        const row = {
          asset_id: assetId,
          couple_id: t.coupleId,
          storage_key: key,
          url,
          mime: input.mimeType,
          size_bytes: input.body.length,
          width: size?.width,
          height: size?.height,
        };
        try {
          await model.create(t.actorSheetId, row);
        } catch (err) {
          console.error(`[website-assets] row create failed for ${key}`, err);
          await storage.delete(key).catch((e) => console.error(`[website-assets] orphaned file ${key}`, e));
          return { ok: false, status: 502, error: "storage_failed" };
        }
        return { ok: true, asset: toPublic({ ...row, _created_at: new Date().toISOString() }) };
      });
    },

    /** null when the asset doesn't exist in this couple's sheet. */
    async usage(t: Tenant, assetId: string): Promise<UsageSection[] | null> {
      const asset = await model.findById(t.actorSheetId, assetId);
      if (!asset) return null;
      return (await usageOf(t.actorSheetId, asset.url)).map(({ section }) => ({
        section_id: section.section_id,
        section_key: section.section_key,
      }));
    },

    async remove(t: Tenant, assetId: string, force: boolean): Promise<DeleteResult> {
      const asset = await model.findById(t.actorSheetId, assetId);
      if (!asset) return { ok: false, status: 404, error: "not_found" };

      const used = await usageOf(t.actorSheetId, asset.url);
      const sections = used.map(({ section }) => ({
        section_id: section.section_id,
        section_key: section.section_key,
      }));
      if (used.length > 0 && !force) return { ok: false, status: 409, error: "in_use", sections };

      try {
        for (const { section, content } of used) {
          await model.updateSectionContent(t.actorSheetId, section.section_id, stripUrl(content, asset.url));
        }
        // Row before file: if the file delete fails the asset is already gone from the library.
        await model.delete(t.actorSheetId, assetId);
      } finally {
        if (used.length > 0) deps.invalidateCouple(t.coupleId);
      }
      await deps
        .storageFor(t.coupleId)
        .delete(asset.storage_key)
        .catch((err) => console.error(`[website-assets] orphaned file ${asset.storage_key}`, err));
      return { ok: true };
    },
  };
}

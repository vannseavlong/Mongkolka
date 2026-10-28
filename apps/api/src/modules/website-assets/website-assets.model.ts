import { coupleContext } from "../../config/database.js";

export interface AssetRow extends Record<string, unknown> {
  asset_id: string;
  couple_id: string;
  storage_key: string;
  url: string;
  mime: string;
  size_bytes: number;
}

export interface SectionRow extends Record<string, unknown> {
  section_id: string;
  section_key: string;
  content?: unknown;
}

/** All data-layer calls for assets live here (keeps a later move off Sheets cheap). */
export const WebsiteAssetsModel = {
  findMany(actorSheetId: string) {
    return coupleContext(actorSheetId).table("website_assets").findMany() as Promise<AssetRow[]>;
  },

  findById(actorSheetId: string, assetId: string) {
    return coupleContext(actorSheetId)
      .table("website_assets")
      .findOne({ where: { asset_id: assetId } }) as Promise<AssetRow | null>;
  },

  create(actorSheetId: string, data: Record<string, unknown>) {
    return coupleContext(actorSheetId).table("website_assets").create(data);
  },

  delete(actorSheetId: string, assetId: string) {
    return coupleContext(actorSheetId)
      .table("website_assets")
      .delete({ where: { asset_id: assetId } });
  },

  findSections(actorSheetId: string) {
    return coupleContext(actorSheetId).table("website_sections").findMany() as Promise<SectionRow[]>;
  },

  updateSectionContent(actorSheetId: string, sectionId: string, content: unknown) {
    return coupleContext(actorSheetId)
      .table("website_sections")
      .update({ where: { section_id: sectionId }, data: { content } });
  },
};

export type WebsiteAssetsModelApi = typeof WebsiteAssetsModel;

import { randomUUID } from "node:crypto";
import { CoupleWebsiteModel } from "./couple-website.model.js";

// Mirrors SECTION_KEYS in packages/templates/src/types.ts — kept as a plain
// constant here since the API is framework-agnostic and shouldn't depend on the
// React-rendering template package.
const SECTION_KEYS = [
  "opening",
  "hero",
  "story",
  "gallery",
  "details",
  "rsvp",
  "registry",
  "timeline",
  "music",
] as const;

export const CoupleWebsiteService = {
  async getCatalog() {
    const [templates, components] = await Promise.all([
      CoupleWebsiteModel.findTemplates(),
      CoupleWebsiteModel.findComponents(),
    ]);
    return { templates, components };
  },

  async getSettings(coupleId: string, actorSheetId: string) {
    const [couple, profile] = await Promise.all([
      CoupleWebsiteModel.findCoupleById(coupleId),
      CoupleWebsiteModel.findProfile(actorSheetId),
    ]);
    return {
      slug: couple?.slug ?? null,
      website_status: couple?.website_status ?? "draft",
      site_template_id: profile?.site_template_id ?? null,
      theme_override: profile?.theme_override ?? null,
    };
  },

  /**
   * Sets the couple's chosen design pack. The first time a couple selects a
   * template, bootstraps one website_sections row per SECTION_KEYS entry so the
   * builder has something to list/reorder/toggle immediately.
   */
  async selectTemplate(actorSheetId: string, templateId: string) {
    const profile = await CoupleWebsiteModel.findProfile(actorSheetId);
    if (profile) {
      await CoupleWebsiteModel.updateProfile(actorSheetId, profile.profile_id as string, {
        site_template_id: templateId,
      });
    } else {
      await CoupleWebsiteModel.createProfile(actorSheetId, {
        profile_id: randomUUID(),
        site_template_id: templateId,
      });
    }

    const existingSections = await CoupleWebsiteModel.findSections(actorSheetId);
    if (existingSections.length === 0) {
      for (const [index, sectionKey] of SECTION_KEYS.entries()) {
        await CoupleWebsiteModel.createSection(actorSheetId, {
          section_id: randomUUID(),
          section_key: sectionKey,
          display_order: index,
          enabled: true,
        });
      }
    }
  },

  async updateTheme(actorSheetId: string, themeOverride: Record<string, unknown>) {
    const profile = await CoupleWebsiteModel.findProfile(actorSheetId);
    if (profile) {
      await CoupleWebsiteModel.updateProfile(actorSheetId, profile.profile_id as string, {
        theme_override: themeOverride,
      });
    } else {
      await CoupleWebsiteModel.createProfile(actorSheetId, {
        profile_id: randomUUID(),
        theme_override: themeOverride,
      });
    }
  },

  listSections(actorSheetId: string) {
    return CoupleWebsiteModel.findSections(actorSheetId);
  },

  async updateSection(actorSheetId: string, sectionId: string, input: Record<string, unknown>) {
    await CoupleWebsiteModel.updateSection(actorSheetId, sectionId, input);
    return CoupleWebsiteModel.findSectionById(actorSheetId, sectionId);
  },

  async reorderSections(actorSheetId: string, sectionIds: string[]) {
    await Promise.all(
      sectionIds.map((sectionId, index) =>
        CoupleWebsiteModel.updateSection(actorSheetId, sectionId, { display_order: index }),
      ),
    );
    return CoupleWebsiteModel.findSections(actorSheetId);
  },

  async publish(coupleId: string, actorSheetId: string) {
    const profile = await CoupleWebsiteModel.findProfile(actorSheetId);
    if (!profile?.site_template_id) {
      throw new Error("Choose a site template before publishing");
    }
    await CoupleWebsiteModel.updateWebsiteStatus(coupleId, "published");
    return CoupleWebsiteModel.findCoupleById(coupleId);
  },

  async unpublish(coupleId: string) {
    await CoupleWebsiteModel.updateWebsiteStatus(coupleId, "draft");
    return CoupleWebsiteModel.findCoupleById(coupleId);
  },
};

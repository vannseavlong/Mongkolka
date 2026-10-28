import { randomUUID } from "node:crypto";
import { ValidationError } from "longcelot-sheet-db";
import { isValidCustomSlug, normalizeSlug } from "../../utils/slug.js";
import { CoupleWebsiteModel } from "./couple-website.model.js";
import { PublicSiteCache } from "../public-site/public-site.cache.js";
import { SiteTemplatesService } from "../site-templates/site-templates.service.js";

/**
 * How applying a template treats what the couple already edited:
 * - `keep_content`: clears per-section `component_id` / `color_override` and the
 *   profile `theme_override` (so the template's look applies fully) but keeps `content`.
 * - `reset_all`: also clears every section's `content`.
 */
export type ApplyTemplateMode = "keep_content" | "reset_all";
export const APPLY_TEMPLATE_MODES: readonly ApplyTemplateMode[] = ["keep_content", "reset_all"];
export const DEFAULT_APPLY_TEMPLATE_MODE: ApplyTemplateMode = "keep_content";

export class TemplateNotAvailableError extends Error {}

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
  "guestbook",
] as const;

function toComparableTime(value: unknown): number {
  if (typeof value !== "string" || !value) return Number.POSITIVE_INFINITY;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

function toComparableOrder(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : Number.POSITIVE_INFINITY;
}

/** Earliest _created_at wins; ties broken by lowest display_order, then lowest section_id. */
function compareSectionsForDedupe(a: Record<string, unknown>, b: Record<string, unknown>): number {
  const createdDiff = toComparableTime(a._created_at) - toComparableTime(b._created_at);
  if (createdDiff !== 0) return createdDiff;
  const orderDiff = toComparableOrder(a.display_order) - toComparableOrder(b.display_order);
  if (orderDiff !== 0) return orderDiff;
  return String(a.section_id ?? "").localeCompare(String(b.section_id ?? ""));
}

function compareByDisplayOrder(a: Record<string, unknown>, b: Record<string, unknown>): number {
  return toComparableOrder(a.display_order) - toComparableOrder(b.display_order);
}

function isSet(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return false;
  return true;
}

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
   *
   * Bootstrap is gated per section_key (not by "does the whole batch have zero
   * rows") specifically so it's idempotent under concurrent calls: two
   * near-simultaneous POSTs (double-click, fast re-selection) both observing an
   * empty/partial set no longer each insert a full duplicate batch — each call
   * only creates whatever keys it still sees missing, so retries self-heal
   * instead of piling up more duplicates. This still isn't a true atomic lock
   * (the underlying sheet-backed store has no transactions), so a duplicate is
   * still theoretically possible for the same key on a dead heat between two
   * reads — that residual case is covered by the dedupe in listSections().
   */
  async selectTemplate(
    actorSheetId: string,
    templateId: string,
    mode: ApplyTemplateMode = DEFAULT_APPLY_TEMPLATE_MODE,
  ) {
    const template = await CoupleWebsiteModel.findTemplateById(templateId);
    if (!template || template.status !== "active") {
      throw new TemplateNotAvailableError("That template isn't available");
    }
    try {
      await CoupleWebsiteService.selectTemplateUncached(actorSheetId, templateId, mode);
    } finally {
      PublicSiteCache.invalidateActorSheet(actorSheetId);
    }
  },

  async selectTemplateUncached(
    actorSheetId: string,
    templateId: string,
    mode: ApplyTemplateMode = DEFAULT_APPLY_TEMPLATE_MODE,
  ) {
    const [profile, existingSections] = await Promise.all([
      CoupleWebsiteModel.findProfile(actorSheetId),
      CoupleWebsiteModel.findSections(actorSheetId),
    ]);
    // Applying a template always drops the whole-site color override so the new
    // template's theme shows (null = "use the template's theme as-is").
    if (profile) {
      await CoupleWebsiteModel.updateProfile(actorSheetId, profile.profile_id as string, {
        site_template_id: templateId,
        theme_override: null,
      });
    } else {
      await CoupleWebsiteModel.createProfile(actorSheetId, {
        profile_id: randomUUID(),
        site_template_id: templateId,
      });
    }

    // The adapter has no multi-row update, so this is one write per section that
    // actually needs clearing (already-clean rows are skipped), issued in parallel.
    const clearContent = mode === "reset_all";
    const resets = existingSections.flatMap((section) => {
      const patch: Record<string, unknown> = {};
      if (isSet(section.component_id)) patch.component_id = null;
      if (isSet(section.color_override)) patch.color_override = null;
      if (clearContent && isSet(section.content)) patch.content = null;
      return Object.keys(patch).length > 0
        ? [CoupleWebsiteModel.updateSection(actorSheetId, section.section_id as string, patch)]
        : [];
    });
    await Promise.all(resets);

    const existingKeys = new Set(existingSections.map((section) => section.section_key as string));
    const missingKeys = SECTION_KEYS.filter((sectionKey) => !existingKeys.has(sectionKey));
    if (missingKeys.length > 0) {
      // One batched append instead of N sequential creates — each create() was
      // its own round trip to the Sheets API, so a couple selecting a template
      // for the first time was paying for up to SECTION_KEYS.length (9)
      // sequential network calls in series before the request could respond,
      // and any single one of those calls failing/timing out took the whole
      // request down with it. createMany() still validates each row the same
      // way create() does — it just appends them in one call.
      const nextOrderStart = existingSections.length;
      await CoupleWebsiteModel.createSections(
        actorSheetId,
        missingKeys.map((sectionKey, offset) => ({
          section_id: randomUUID(),
          section_key: sectionKey,
          display_order: nextOrderStart + offset,
          enabled: true,
        })),
      );
    }
  },

  async updateTheme(actorSheetId: string, themeOverride: Record<string, unknown>) {
    try {
      await CoupleWebsiteService.updateThemeUncached(actorSheetId, themeOverride);
    } finally {
      PublicSiteCache.invalidateActorSheet(actorSheetId);
    }
  },

  async updateThemeUncached(actorSheetId: string, themeOverride: Record<string, unknown>) {
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

  /**
   * Reads sections and collapses any duplicate rows sharing a section_key down
   * to one — a display-layer safety net against the historical bootstrap race
   * (see selectTemplate() above), not a data mutation the caller depends on.
   * The "keeper" per key is deterministic: earliest-created row (ties broken by
   * lowest display_order, then lowest section_id) wins, mirroring what a couple
   * would expect to still see if they'd been editing the original row all along.
   * True orphan duplicates are then best-effort deleted so they stop coming back
   * on every future read; a failed cleanup never fails the request — the couple
   * still gets a clean, deduped list either way.
   */
  async listSections(actorSheetId: string) {
    let sections = await CoupleWebsiteModel.findSections(actorSheetId);

    // A section type added after a couple first picked a template (e.g. `guestbook`)
    // has no row for them yet — create it, disabled, so it shows up in the builder
    // for them to opt in to instead of changing a site that's already published.
    // Only once the couple has any sections at all (before that, selectTemplate
    // bootstraps the whole set).
    if (sections.length > 0) {
      const have = new Set(sections.map((s) => s.section_key as string));
      const missing = SECTION_KEYS.filter((key) => !have.has(key));
      if (missing.length > 0) {
        await CoupleWebsiteModel.createSections(
          actorSheetId,
          missing.map((sectionKey, offset) => ({
            section_id: randomUUID(),
            section_key: sectionKey,
            display_order: sections.length + offset,
            enabled: false,
          })),
        );
        PublicSiteCache.invalidateActorSheet(actorSheetId);
        sections = await CoupleWebsiteModel.findSections(actorSheetId);
      }
    }

    const bySectionKey = new Map<string, Record<string, unknown>[]>();
    for (const section of sections) {
      const key = section.section_key as string;
      const group = bySectionKey.get(key);
      if (group) {
        group.push(section);
      } else {
        bySectionKey.set(key, [section]);
      }
    }

    const duplicateIds: string[] = [];
    const deduped: Record<string, unknown>[] = [];
    for (const group of bySectionKey.values()) {
      const sorted = [...group].sort(compareSectionsForDedupe);
      const [keeper, ...rest] = sorted;
      if (!keeper) continue;
      deduped.push(keeper);
      for (const duplicate of rest) {
        duplicateIds.push(duplicate.section_id as string);
      }
    }

    if (duplicateIds.length > 0) {
      // Best-effort cleanup — never let it fail the read.
      await Promise.all(
        duplicateIds.map((sectionId) =>
          CoupleWebsiteModel.deleteSection(actorSheetId, sectionId).catch(() => undefined),
        ),
      );
    }

    return deduped.sort(compareByDisplayOrder);
  },

  async updateSection(actorSheetId: string, sectionId: string, input: Record<string, unknown>) {
    try {
      await CoupleWebsiteModel.updateSection(actorSheetId, sectionId, input);
    } finally {
      PublicSiteCache.invalidateActorSheet(actorSheetId);
    }
    return CoupleWebsiteModel.findSectionById(actorSheetId, sectionId);
  },

  async reorderSections(actorSheetId: string, sectionIds: string[]) {
    try {
      await Promise.all(
        sectionIds.map((sectionId, index) =>
          CoupleWebsiteModel.updateSection(actorSheetId, sectionId, {
            display_order: index,
          }),
        ),
      );
    } finally {
      PublicSiteCache.invalidateActorSheet(actorSheetId);
    }
    return CoupleWebsiteModel.findSections(actorSheetId);
  },

  async publish(coupleId: string, actorSheetId: string) {
    const profile = await CoupleWebsiteModel.findProfile(actorSheetId);
    if (!profile?.site_template_id) {
      throw new Error("Choose a site template before publishing");
    }
    try {
      await CoupleWebsiteModel.updateWebsiteStatus(coupleId, "published");
    } finally {
      PublicSiteCache.invalidateCouple(coupleId);
    }
    return CoupleWebsiteModel.findCoupleById(coupleId);
  },

  async unpublish(coupleId: string) {
    try {
      await CoupleWebsiteModel.updateWebsiteStatus(coupleId, "draft");
    } finally {
      PublicSiteCache.invalidateCouple(coupleId);
    }
    return CoupleWebsiteModel.findCoupleById(coupleId);
  },

  /**
   * Lets a couple replace their random placeholder slug (e.g. "couple-a1b2c3d4")
   * with a readable one (e.g. "vutha-nita") that also doubles as their site's
   * subdomain label. Format is validated here; the "already taken" case is
   * caught from the model's unique-constraint violation rather than checked
   * up front, so a race between two saves still can't produce duplicates.
   */
  async updateSlug(coupleId: string, rawSlug: string) {
    const slug = normalizeSlug(rawSlug);
    if (!isValidCustomSlug(slug)) {
      throw new Error(
        "Link must be 3-40 characters: lowercase letters, numbers, and single hyphens only",
      );
    }
    // Template slugs are reserved: each one is the public preview address of a template.
    const reserved = await SiteTemplatesService.listTemplateSlugs();
    if (reserved.has(slug)) {
      throw new Error("That link is reserved — try another");
    }
    try {
      await CoupleWebsiteModel.updateSlug(coupleId, slug);
      // Old slug's entry is found by couple id; the new slug has no entry yet, but a
      // cached "not found" for it (from a guest probing the link) must go too.
      PublicSiteCache.invalidateCouple(coupleId);
      PublicSiteCache.invalidateSlug(slug);
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new Error("That link is already taken — try another");
      }
      throw err;
    }
    return CoupleWebsiteModel.findCoupleById(coupleId);
  },
};

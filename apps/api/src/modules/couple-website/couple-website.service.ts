import { randomUUID } from "node:crypto";
import { ValidationError } from "longcelot-sheet-db";
import { isReservedSlug, isValidCustomSlug, normalizeSlug } from "../../utils/slug.js";
import { CoupleWebsiteModel } from "./couple-website.model.js";
import { PublicSiteCache } from "../public-site/public-site.cache.js";
import {
  SECTION_KEYS,
  layoutFromDefaults,
  parseDefaultSections,
} from "../../utils/section-keys.js";
import { SiteTemplatesService } from "../site-templates/site-templates.service.js";

/**
 * How applying a template treats what the couple already edited:
 * - `keep_content`: clears per-section `component_id` / `color_override` and the
 *   profile `theme_override` (so the template's look applies fully) but keeps `content`.
 * - `reset_all`: also clears every section's `content`.
 *
 * Section order and on/off flags: when the template has `default_sections`, `reset_all`
 * also resets every section's `display_order` and `enabled` from it (sections the
 * template omits go disabled at the end). `keep_content` never touches them. A template
 * without `default_sections` leaves order and flags alone in both modes.
 */
export type ApplyTemplateMode = "keep_content" | "reset_all";
export const APPLY_TEMPLATE_MODES: readonly ApplyTemplateMode[] = ["keep_content", "reset_all"];
export const DEFAULT_APPLY_TEMPLATE_MODE: ApplyTemplateMode = "keep_content";

export class TemplateNotAvailableError extends Error {}

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
    // default_sections is normalised on read (unknown keys dropped; null when unusable).
    return {
      templates: templates.map((t) => ({
        ...t,
        default_sections: parseDefaultSections(t.default_sections),
      })),
      components,
    };
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
      await CoupleWebsiteService.selectTemplateUncached(actorSheetId, templateId, mode, template);
    } finally {
      PublicSiteCache.invalidateActorSheet(actorSheetId);
    }
  },

  async selectTemplateUncached(
    actorSheetId: string,
    templateId: string,
    mode: ApplyTemplateMode = DEFAULT_APPLY_TEMPLATE_MODE,
    /** undefined = read the row here; null = the template is missing. */
    templateRow?: Record<string, unknown> | null,
  ) {
    const [profile, existingSections, template] = await Promise.all([
      CoupleWebsiteModel.findProfile(actorSheetId),
      CoupleWebsiteModel.findSections(actorSheetId),
      templateRow === undefined ? CoupleWebsiteModel.findTemplateById(templateId) : templateRow,
    ]);
    const defaults = parseDefaultSections(template?.default_sections);
    // key -> { position, enabled } in the template's layout; null = template has no default_sections.
    const layout = defaults
      ? new Map(
          layoutFromDefaults(defaults).map((d, index) => [
            d.section_key as string,
            { index, enabled: d.enabled },
          ]),
        )
      : null;
    // Section writes go first and are all awaited (allSettled) before the profile is
    // written. If any fail we stop with the profile still on the old template. That is NOT
    // a fully consistent old state: sibling writes that succeeded stay applied (cleared
    // component/color overrides and, for reset_all with default_sections, the new
    // order/enabled flags). Retrying the same pick is idempotent: rows that already match
    // are skipped and missing rows are recomputed from the current state. If the couple
    // does not retry, listSections() later appends missing keys disabled and only a
    // reset_all repairs the layout. The same applies if the profile write or createSections
    // fails after the section writes. The adapter has no multi-row update or transaction,
    // so this is one write per section that needs a change, run in parallel; the public
    // cache is invalidated only after everything settled (selectTemplate's finally).
    const clearContent = mode === "reset_all";
    const resets = existingSections.flatMap((section) => {
      const patch: Record<string, unknown> = {};
      if (isSet(section.component_id)) patch.component_id = null;
      if (isSet(section.color_override)) patch.color_override = null;
      if (clearContent && isSet(section.content)) patch.content = null;
      const target = clearContent ? layout?.get(section.section_key as string) : undefined;
      if (target) {
        if (!isSet(section.display_order) || Number(section.display_order) !== target.index) {
          patch.display_order = target.index;
        }
        if (section.enabled !== target.enabled) patch.enabled = target.enabled;
      }
      return Object.keys(patch).length > 0
        ? [CoupleWebsiteModel.updateSection(actorSheetId, section.section_id as string, patch)]
        : [];
    });
    const results = await Promise.allSettled(resets);
    const failed = results.find((r): r is PromiseRejectedResult => r.status === "rejected");
    if (failed) throw failed.reason;

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

    const existingKeys = new Set(existingSections.map((section) => section.section_key as string));
    const missingKeys = SECTION_KEYS.filter((sectionKey) => !existingKeys.has(sectionKey));
    if (missingKeys.length > 0) {
      // One batched append instead of N sequential creates (each create() is its own
      // Sheets round trip). createMany() still validates each row like create() does.
      const nextOrderStart = existingSections.length;
      let rows: {
        section_key: string;
        display_order: number;
        enabled: boolean;
      }[];
      if (layout && (existingSections.length === 0 || clearContent)) {
        // Template layout: first pick (or reset_all) places rows at the template's
        // positions with its flags; existing rows were moved to the same positions above.
        const ordered = [...layout.entries()].filter(([key]) => !existingKeys.has(key));
        rows = ordered.map(([key, target]) => ({
          section_key: key,
          display_order: target.index,
          enabled: target.enabled,
        }));
      } else {
        // No template layout: today's behavior (appended, enabled). With a layout but an
        // existing partial set under keep_content: appended disabled, like listSections().
        const layoutOrder = layout ? [...layout.keys()] : [...SECTION_KEYS];
        rows = layoutOrder
          .filter((key) => !existingKeys.has(key))
          .map((key, offset) => ({
            section_key: key,
            display_order: nextOrderStart + offset,
            enabled: !layout,
          }));
      }
      await CoupleWebsiteModel.createSections(
        actorSheetId,
        rows.map((row) => ({ section_id: randomUUID(), ...row })),
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
          CoupleWebsiteModel.updateSection(actorSheetId, sectionId, { display_order: index }),
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
    if (isReservedSlug(slug) || (await SiteTemplatesService.listTemplateSlugs()).has(slug)) {
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

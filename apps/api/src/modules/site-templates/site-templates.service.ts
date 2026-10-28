import { ValidationError } from "longcelot-sheet-db";
import { isValidCustomSlug, normalizeSlug } from "../../utils/slug.js";
import { TtlCache } from "../../utils/ttl-cache.js";
import { SiteTemplatesModel } from "./site-templates.model.js";
import { PublicSiteCache } from "../public-site/public-site.cache.js";

export interface Theme {
  bg_color?: string;
  text_color?: string;
  accent_color?: string;
  font_style?: string;
}

export interface CreateSiteTemplateInput {
  template_id: string;
  name: string;
  slug: string;
  description?: string;
  default_theme: Theme;
  default_components: Record<string, string>;
}

export interface UpdateSiteTemplateInput {
  name?: string;
  slug?: string;
  description?: string;
  default_theme?: Theme;
  default_components?: Record<string, string>;
  status?: string;
}

/** Thrown for input the admin can fix; the controller maps it to 400/409. */
export class SiteTemplateInputError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 409,
  ) {
    super(message);
  }
}

// Public by-slug lookups come from the preview site on every visit; keep them off Sheets.
const BY_SLUG_TTL_MS = 60 * 1000;
const MISS_TTL_MS = 20 * 1000;
type Row = Record<string, unknown> | null;
const bySlugCache = new TtlCache<{ template: Row }>(BY_SLUG_TTL_MS, 200);

/**
 * A template slug must follow the couple slug rules, be unique among templates,
 * and not be a slug some couple already uses (the reverse direction is checked
 * in CoupleWebsiteService.updateSlug via listTemplateSlugs()).
 */
async function assertSlugAvailable(slug: string, templateId: string) {
  if (!isValidCustomSlug(slug)) {
    throw new SiteTemplateInputError(
      "slug must be 3-40 characters: lowercase letters, numbers, and single hyphens only",
      400,
    );
  }
  const [sameTemplate, couple] = await Promise.all([
    SiteTemplatesModel.findBySlug(slug),
    SiteTemplatesModel.findCoupleBySlug(slug),
  ]);
  if (sameTemplate && sameTemplate.template_id !== templateId) {
    throw new SiteTemplateInputError("That slug is already used by another template", 409);
  }
  if (couple) {
    throw new SiteTemplateInputError("That slug is already used by a couple's site", 409);
  }
}

function invalidate() {
  bySlugCache.clear();
  PublicSiteCache.invalidateAll();
}

export const SiteTemplatesService = {
  list(status?: string) {
    return SiteTemplatesModel.findMany(status ? { status } : undefined);
  },

  /** Public lookup: active templates only, `null` for unknown or inactive slugs. */
  async getPublicBySlug(rawSlug: string) {
    const slug = normalizeSlug(rawSlug);
    if (!isValidCustomSlug(slug)) return null;
    const entry = await bySlugCache.getOrLoad(
      slug,
      async () => {
        const template = await SiteTemplatesModel.findBySlug(slug);
        return {
          template: template && template.status === "active" ? template : null,
        };
      },
      (value) => (value.template ? BY_SLUG_TTL_MS : MISS_TTL_MS),
    );
    return entry.template;
  },

  /** Every template slug (any status), for couple slug validation. */
  async listTemplateSlugs(): Promise<Set<string>> {
    const rows = await SiteTemplatesModel.findMany();
    return new Set(
      rows.map((r) => (typeof r.slug === "string" ? r.slug : "")).filter((s) => s.length > 0),
    );
  },

  async create(input: CreateSiteTemplateInput) {
    const slug = normalizeSlug(input.slug);
    await assertSlugAvailable(slug, input.template_id);
    try {
      const created = await SiteTemplatesModel.create({
        ...input,
        slug,
        status: "active",
      });
      invalidate();
      return created;
    } catch (err) {
      if (err instanceof ValidationError) throw new SiteTemplateInputError(err.message, 409);
      throw err;
    }
  },

  async update(templateId: string, input: UpdateSiteTemplateInput) {
    const data: Record<string, unknown> = { ...input };
    if (input.slug !== undefined) {
      const slug = normalizeSlug(input.slug);
      await assertSlugAvailable(slug, templateId);
      data.slug = slug;
    }
    try {
      await SiteTemplatesModel.update(templateId, data);
    } catch (err) {
      if (err instanceof ValidationError) throw new SiteTemplateInputError(err.message, 409);
      throw err;
    } finally {
      invalidate();
    }
    return SiteTemplatesModel.findById(templateId);
  },

  async delete(templateId: string) {
    const result = await SiteTemplatesModel.delete(templateId);
    invalidate();
    return result;
  },
};

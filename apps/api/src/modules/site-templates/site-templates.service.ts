import { ValidationError } from "longcelot-sheet-db";
import { isReservedSlug, isValidCustomSlug, normalizeSlug } from "../../utils/slug.js";
import { TtlCache } from "../../utils/ttl-cache.js";
import { parseDefaultSections, validateDefaultSections, type DefaultSection } from "../../utils/section-keys.js";
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
  default_sections?: unknown;
}

export interface UpdateSiteTemplateInput {
  name?: string;
  slug?: string;
  description?: string;
  default_theme?: Theme;
  default_components?: Record<string, string>;
  /** `null` or `[]` clears it (back to the fixed order, all enabled). */
  default_sections?: unknown;
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

// The public by-slug lookup is hit on every preview visit. The whole active catalog is
// tiny, so it is loaded with ONE read into a short-TTL cache and looked up in memory:
// no per-slug keys, so junk slugs can neither grow the cache nor evict real entries.
const CATALOG_TTL_MS = 60 * 1000;
type Row = Record<string, unknown>;
const activeCatalogCache = new TtlCache<Row[]>(CATALOG_TTL_MS, 1);
const CATALOG_KEY = "active";

const PUBLIC_FIELDS = [
  "template_id",
  "name",
  "slug",
  "description",
  "default_theme",
  "default_components",
] as const;

function toPublicTemplate(row: Row) {
  // default_sections is normalised (unknown keys dropped, null when unusable); not in PUBLIC_FIELDS on purpose.
  return {
    ...Object.fromEntries(PUBLIC_FIELDS.map((key) => [key, row[key] ?? null])),
    default_sections: parseDefaultSections(row.default_sections),
  };
}

/**
 * A template slug must follow the couple slug rules, be unique among templates,
 * and not be a slug some couple already uses (the reverse direction is checked
 * in CoupleWebsiteService.updateSlug via listTemplateSlugs()).
 */
async function assertSlugAvailable(slug: string, templateId: string) {
  if (isReservedSlug(slug)) {
    throw new SiteTemplateInputError("That slug is reserved", 400);
  }
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

function cleanDefaultSections(value: unknown): DefaultSection[] | null {
  try {
    return validateDefaultSections(value);
  } catch (err) {
    throw new SiteTemplateInputError((err as Error).message, 400);
  }
}

function invalidate() {
  activeCatalogCache.clear();
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
    const catalog = await activeCatalogCache.getOrLoad(CATALOG_KEY, () =>
      SiteTemplatesModel.findMany({ status: "active" }),
    );
    const row = catalog.find((r) => r.slug === slug && r.status === "active");
    return row ? toPublicTemplate(row) : null;
  },

  /** Drops the public catalog cache (also called by every write here). */
  invalidatePublicCache: invalidate,

  /** Every template slug (any status), for couple slug validation. */
  async listTemplateSlugs(): Promise<Set<string>> {
    const rows = await SiteTemplatesModel.findMany();
    return new Set(
      rows.map((r) => (typeof r.slug === "string" ? r.slug : "")).filter((s) => s.length > 0),
    );
  },

  async create(input: CreateSiteTemplateInput) {
    const slug = normalizeSlug(input.slug);
    const withSections =
      input.default_sections !== undefined
        ? { default_sections: cleanDefaultSections(input.default_sections) }
        : {};
    await assertSlugAvailable(slug, input.template_id);
    try {
      const created = await SiteTemplatesModel.create({
        ...input,
        ...withSections,
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
    if (input.default_sections !== undefined) {
      data.default_sections = cleanDefaultSections(input.default_sections);
    }
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

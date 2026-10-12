import { TtlCache } from "../../utils/ttl-cache.js";

export interface CachedSite {
  /** The fully assembled response body, or null for "no such published site". */
  site: Record<string, unknown> | null;
  coupleId: string | null;
  actorSheetId: string | null;
}

// A landing page changes only when the couple edits it, so serve it from memory.
// 5 minutes is the safety net for writes this process never sees (e.g. someone
// editing the sheet by hand); every write path in this API invalidates explicitly.
const SITE_TTL_MS = 5 * 60 * 1000;
// Unknown / unpublished slugs are cached briefly so a scanner or a viral link to an
// unpublished site can't turn into one Sheets read per request.
const MISS_TTL_MS = 20 * 1000;

const cache = new TtlCache<CachedSite>(SITE_TTL_MS, 1000);

export const PublicSiteCache = {
  getOrLoad(slug: string, loader: () => Promise<CachedSite>) {
    return cache.getOrLoad(slug, loader, (entry) => (entry.site ? SITE_TTL_MS : MISS_TTL_MS));
  },

  invalidateSlug(slug: string) {
    cache.delete(slug);
  },

  /** Drops the couple's cached site, whichever slug it's currently cached under. */
  invalidateCouple(coupleId: string) {
    cache.deleteWhere((entry) => entry.coupleId === coupleId);
  },

  invalidateActorSheet(actorSheetId: string) {
    cache.deleteWhere((entry) => entry.actorSheetId === actorSheetId);
  },

  /** For catalog-wide changes (a site template edited by an admin). */
  invalidateAll() {
    cache.clear();
  },
};

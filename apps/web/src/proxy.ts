import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Wildcard subdomain routing for couple sites: a request to
// {slug}.{ROOT_DOMAIN} is rewritten to the internal /[slug] route, so the
// couple portal can hand out clean links like
// https://vutha-nita.mongkolka.app instead of
// https://mongkolka.app/couple-a1b2c3d4. Any host that isn't a recognized
// subdomain of ROOT_DOMAIN (including plain localhost in dev, before
// ROOT_DOMAIN is pointed at a real domain) falls through unchanged, so the
// existing /{slug} path route keeps working as a fallback.
//
// NOTE: renamed from `middleware.ts` — Next.js 16 deprecated Middleware in
// favor of this `proxy.ts` file convention (same request-interception
// behavior, new name). See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
const ROOT_DOMAIN = (process.env.ROOT_DOMAIN ?? "localhost:3000").split(":")[0];

// Template preview subdomains: {template-slug}.{ROOT_DOMAIN} renders a
// template with sample data. Template slugs are resolved BEFORE the couple-slug
// rewrite. The lookup is in-memory cached (proxy runs on the Node.js runtime in
// Next 16, so module state persists), bounded in size, time-limited, and fails
// open: any error/timeout means "not a template", i.e. the couple route.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const LOOKUP_TIMEOUT_MS = 1500;
const HIT_TTL_MS = 5 * 60_000;
const MISS_TTL_MS = 60_000;
const ERROR_TTL_MS = 10_000;
const MAX_CACHE_ENTRIES = 500;
const SLUG_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

const templateSlugCache = new Map<string, { isTemplate: boolean; expires: number }>();

async function isTemplateSlug(slug: string): Promise<boolean> {
  // Only plausible DNS labels reach the API/cache; junk hosts cost nothing.
  if (!SLUG_PATTERN.test(slug)) return false;

  const now = Date.now();
  const cached = templateSlugCache.get(slug);
  if (cached && cached.expires > now) return cached.isTemplate;

  let isTemplate = false;
  let ttl = MISS_TTL_MS;
  try {
    const res = await fetch(`${API_URL}/public/api/site-templates/by-slug/${slug}`, {
      signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
      cache: "no-store",
    });
    if (res.ok) {
      isTemplate = true;
      ttl = HIT_TTL_MS;
    } else if (res.status !== 404) {
      ttl = ERROR_TTL_MS;
    }
  } catch {
    ttl = ERROR_TTL_MS;
  }

  if (templateSlugCache.size >= MAX_CACHE_ENTRIES) {
    // Drop expired entries first, then the oldest inserted one.
    for (const [key, entry] of templateSlugCache) {
      if (entry.expires <= now) templateSlugCache.delete(key);
    }
    if (templateSlugCache.size >= MAX_CACHE_ENTRIES) {
      const oldest = templateSlugCache.keys().next().value;
      if (oldest !== undefined) templateSlugCache.delete(oldest);
    }
  }
  templateSlugCache.set(slug, { isTemplate, expires: now + ttl });
  return isTemplate;
}

export async function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0];

  if (!hostname || hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) {
    return NextResponse.next();
  }

  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const slug = hostname.slice(0, -(ROOT_DOMAIN.length + 1));
    const url = request.nextUrl.clone();
    if (await isTemplateSlug(slug)) {
      url.pathname = `/templates/preview/${slug}`;
      return NextResponse.rewrite(url);
    }
    url.pathname = `/${slug}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URL } from "@/lib/api";

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
// rewrite. The proxy runs on the Node.js runtime in Next 16, so module state
// persists. Instead of one lookup per host label (junk hosts could churn the
// cache), the set of published template slugs is fetched from the public list
// once, cached as a single entry, and shared by concurrent requests through one
// in-flight promise. Any error or timeout falls through to the couple route.
const LOOKUP_TIMEOUT_MS = 1500;
const SET_TTL_MS = 60_000;
const ERROR_TTL_MS = 10_000;
// Same rule as the API (3-40 chars, lowercase letters/digits, single hyphens).
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Labels the API refuses as slugs (infrastructure subdomains); never looked up.
const RESERVED_LABELS = new Set(["www", "api", "admin", "app", "mail", "couple", "vendor", "web", "static", "cdn"]);

let templateSlugs: { slugs: Set<string>; expires: number } | null = null;
let inFlight: Promise<Set<string>> | null = null;

async function loadTemplateSlugs(): Promise<Set<string>> {
  try {
    const res = await fetch(`${API_URL}/public/api/site-templates`, {
      signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as { templates?: { slug?: string | null }[] };
    const slugs = new Set<string>();
    for (const t of data.templates ?? []) if (t.slug) slugs.add(t.slug);
    templateSlugs = { slugs, expires: Date.now() + SET_TTL_MS };
    return slugs;
  } catch {
    // Keep serving the previous set for a short while, then retry.
    const previous = templateSlugs?.slugs ?? new Set<string>();
    templateSlugs = { slugs: previous, expires: Date.now() + ERROR_TTL_MS };
    return previous;
  } finally {
    inFlight = null;
  }
}

async function isTemplateSlug(slug: string): Promise<boolean> {
  if (slug.length < 3 || slug.length > 40 || !SLUG_PATTERN.test(slug) || RESERVED_LABELS.has(slug)) {
    return false;
  }
  if (templateSlugs && templateSlugs.expires > Date.now()) return templateSlugs.slugs.has(slug);
  inFlight ??= loadTemplateSlugs();
  return (await inFlight).has(slug);
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

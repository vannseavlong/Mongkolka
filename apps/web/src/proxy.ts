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

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0];

  if (!hostname || hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) {
    return NextResponse.next();
  }

  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const slug = hostname.slice(0, -(ROOT_DOMAIN.length + 1));
    const url = request.nextUrl.clone();
    url.pathname = `/${slug}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};

// Public site URLs. Templates and couples are served as subdomains of
// ROOT_DOMAIN (e.g. "botanical-romance.mongkolka.app"); apps/web rewrites
// {slug}.{ROOT_DOMAIN} to its internal /[slug] route. Falls back to
// "localhost:3000" for local dev, same as apps/couple.
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
const PROTOCOL = ROOT_DOMAIN.startsWith("localhost") ? "http" : "https";

export function siteHost(slug: string): string {
  return `${slug}.${ROOT_DOMAIN}`;
}

export function siteOrigin(slug: string): string {
  return `${PROTOCOL}://${siteHost(slug)}`;
}

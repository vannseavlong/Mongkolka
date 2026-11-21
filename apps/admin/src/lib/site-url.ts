// Public site URLs. Templates are previewed by path on the main site
// ("mongkolka.web.app/templates/preview/<slug>"); apps/web is a static export and Firebase
// Hosting rewrites that path to its client-rendered preview. NEXT_PUBLIC_ROOT_DOMAIN must be set
// in production builds; falls back to "localhost:3000" for local dev, same as apps/couple.
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
const PROTOCOL = ROOT_DOMAIN.startsWith("localhost") ? "http" : "https";

export function siteHost(slug: string): string {
  return `${ROOT_DOMAIN}/templates/preview/${slug}`;
}

export function siteOrigin(slug: string): string {
  return `${PROTOCOL}://${siteHost(slug)}`;
}

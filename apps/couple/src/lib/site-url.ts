// Builds URLs for a couple's public wedding site. Sites are served by path on the main site
// (e.g. "mongkolka.web.app/vutha-nita"); apps/web is a static export and Firebase Hosting
// rewrites /<slug> to its client-rendered site shell. NEXT_PUBLIC_ROOT_DOMAIN must be set in
// production builds (see .env.production); it falls back to "localhost:3000" for local dev.
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
const PROTOCOL = ROOT_DOMAIN.startsWith("localhost") ? "http" : "https";

/** The couple's site address without protocol, e.g. "mongkolka.web.app/vutha-nita". */
export function siteHost(slug: string): string {
  return `${ROOT_DOMAIN}/${slug}`;
}

/** The couple's site URL, e.g. "https://mongkolka.web.app/vutha-nita". */
export function siteOrigin(slug: string): string {
  return `${PROTOCOL}://${siteHost(slug)}`;
}

/** Full-page preview of a template, e.g. "https://mongkolka.web.app/templates/preview/grace". */
export function templatePreviewUrl(slug: string): string {
  return `${PROTOCOL}://${ROOT_DOMAIN}/templates/preview/${slug}`;
}

// Query values read as "spaces, not %20" — encodeURIComponent still escapes
// everything else (so a literal "&" in a name can't be mistaken for a param
// separator), just not in the noisy form-urlencoded space encoding.
function encodeQueryValue(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

/**
 * A guest's personalized invitation link, e.g.
 * "https://mongkolka.web.app/vutha-nita?name=Guest+1,Chea". Multiple names
 * (a guest plus their plus-one) are comma-joined into the one `name` param.
 */
export function buildInviteLink(slug: string, names: string[]): string {
  const value = names.filter(Boolean).map(encodeQueryValue).join(",");
  return `${siteOrigin(slug)}?name=${value}`;
}

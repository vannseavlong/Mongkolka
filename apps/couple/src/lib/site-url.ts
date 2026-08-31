// Builds URLs for a couple's public wedding site. The site is served as a
// subdomain of ROOT_DOMAIN (e.g. "vutha-nita.mongkolka.app") via middleware
// in apps/web that rewrites {slug}.{ROOT_DOMAIN} to the internal /[slug]
// route — see apps/web/src/middleware.ts. Falls back to "localhost:3000" for
// local dev, where "*.localhost" already resolves without any hosts-file
// changes in modern browsers.
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
const PROTOCOL = ROOT_DOMAIN.startsWith("localhost") ? "http" : "https";

/** The couple's site host, e.g. "vutha-nita.mongkolka.app". */
export function siteHost(slug: string): string {
  return `${slug}.${ROOT_DOMAIN}`;
}

/** The couple's site origin, e.g. "https://vutha-nita.mongkolka.app". */
export function siteOrigin(slug: string): string {
  return `${PROTOCOL}://${siteHost(slug)}`;
}

// Query values read as "spaces, not %20" — encodeURIComponent still escapes
// everything else (so a literal "&" in a name can't be mistaken for a param
// separator), just not in the noisy form-urlencoded space encoding.
function encodeQueryValue(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

/**
 * A guest's personalized invitation link, e.g.
 * "https://vutha-nita.mongkolka.app/?name=Guest+1,Chea". Multiple names
 * (a guest plus their plus-one) are comma-joined into the one `name` param.
 */
export function buildInviteLink(slug: string, names: string[]): string {
  const value = names.filter(Boolean).map(encodeQueryValue).join(",");
  return `${siteOrigin(slug)}/?name=${value}`;
}

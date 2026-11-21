/**
 * Main-site URL for the footer credit link, from NEXT_PUBLIC_ROOT_DOMAIN (e.g. "mongkolka.web.app").
 * Lower-cased, trailing slash stripped; http only for the hostname localhost or 127.0.0.1 (exact
 * match, so "localhost.evil.com" gets https); undefined when unset so the template shows plain
 * text instead of a guessed domain.
 */
export function brandUrl(): string | undefined {
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim().toLowerCase().replace(/\/+$/, "");
  if (!root) return undefined;
  const host = root.split(":")[0];
  const protocol = host === "localhost" || host === "127.0.0.1" ? "http" : "https";
  return `${protocol}://${root}`;
}

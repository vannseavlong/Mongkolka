/**
 * Main-site URL for the footer credit link, from ROOT_DOMAIN (the same env proxy.ts and
 * /templates use). Lower-cased, trailing slash stripped; http only for the hostname localhost
 * or 127.0.0.1 (exact match, so "localhost.evil.com" gets https); undefined when unset so the
 * template shows plain text instead of a guessed domain. Server-only (non-public env var).
 */
export function brandUrl(): string | undefined {
  const root = process.env.ROOT_DOMAIN?.trim().toLowerCase().replace(/\/+$/, "");
  if (!root) return undefined;
  const host = root.split(":")[0];
  const protocol = host === "localhost" || host === "127.0.0.1" ? "http" : "https";
  return `${protocol}://${root}`;
}

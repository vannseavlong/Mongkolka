/**
 * Main-site URL for the footer credit link, from ROOT_DOMAIN (the same env proxy.ts and
 * /templates use). http for localhost, https otherwise; undefined when unset so the
 * template shows plain text instead of a guessed domain. Server-only (reads a non-public env var).
 */
export function brandUrl(): string | undefined {
  const root = process.env.ROOT_DOMAIN?.trim();
  if (!root) return undefined;
  const protocol = root.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${root}`;
}

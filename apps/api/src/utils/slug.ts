import { randomUUID } from "node:crypto";

/**
 * Placeholder slug for a couple's site, assigned at approval time before partner
 * names are known. The couple portal lets them change it to something readable
 * (see isValidCustomSlug / CoupleWebsiteService.updateSlug) once they're ready.
 */
export function generatePlaceholderSlug(): string {
  let slug = `couple-${randomUUID().slice(0, 8)}`;
  while (isReservedSlug(slug)) slug = `couple-${randomUUID().slice(0, 8)}`;
  return slug;
}

/**
 * Words that must never be a couple's or template's slug: they collide with
 * infrastructure subdomains / app routes now or once slugs become subdomain labels.
 */
export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  "www",
  "api",
  "admin",
  "app",
  "mail",
  "email",
  "smtp",
  "ftp",
  "couple",
  "couples",
  "vendor",
  "vendors",
  "web",
  "static",
  "assets",
  "media",
  "cdn",
  "img",
  "images",
  "dashboard",
  "login",
  "logout",
  "signup",
  "auth",
  "public",
  "preview",
  "templates",
  "template",
  "help",
  "support",
  "status",
  "blog",
  "docs",
  "dev",
  "staging",
  "test",
  "mongkolka",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}

const CUSTOM_SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * A couple-chosen site slug, e.g. "vutha-nita": lowercase letters/digits,
 * single hyphens between segments (no leading/trailing/doubled hyphens),
 * 3-40 characters. Doubles as the subdomain label once DNS is wildcarded, so
 * it's kept restrictive rather than allowing anything URL-safe.
 */
export function isValidCustomSlug(slug: string): boolean {
  return slug.length >= 3 && slug.length <= 40 && CUSTOM_SLUG_PATTERN.test(slug);
}

/** Normalises user input the way every slug check expects: trimmed and lowercase. */
export function normalizeSlug(raw: string): string {
  return raw.trim().toLowerCase();
}

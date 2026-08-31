import { randomUUID } from "node:crypto";

/**
 * Placeholder slug for a couple's site, assigned at approval time before partner
 * names are known. The couple portal lets them change it to something readable
 * (see isValidCustomSlug / CoupleWebsiteService.updateSlug) once they're ready.
 */
export function generatePlaceholderSlug(): string {
  return `couple-${randomUUID().slice(0, 8)}`;
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

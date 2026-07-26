import { randomUUID } from "node:crypto";

/**
 * Placeholder slug for a couple's site, assigned at approval time before partner
 * names are known. The couple portal (not built yet) will let them change it.
 */
export function generatePlaceholderSlug(): string {
  return `couple-${randomUUID().slice(0, 8)}`;
}

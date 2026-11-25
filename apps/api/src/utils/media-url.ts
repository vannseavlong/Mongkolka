import { env } from "../config/env.js";

/**
 * Files this API serves itself live under /uploads (local disk) and /media (a couple's Google Drive). Their URLs are
 * stored as the path only ("/uploads/couples/...") so the sheet does not hold the host, and the host is added when
 * the data leaves the API. Moving the API to another address, or from dev to production, then needs no data change.
 * Anything else (an S3/CDN address, a link typed in) is left exactly as it is, and old rows that still hold a full
 * address keep working.
 */
const OWN_PATH = /^\/(uploads|media)\//;

const trimBase = (base: string) => base.replace(/\/+$/, "");

/** The form to save: our own files as a path, every other URL unchanged. */
export function toStoredUrl(url: string, base: string = env.PUBLIC_API_URL): string {
  if (typeof url !== "string") return url;
  const b = trimBase(base);
  if (b && url.startsWith(`${b}/`)) {
    const path = url.slice(b.length);
    if (OWN_PATH.test(path)) return path;
  }
  return url;
}

/** The form to send out: our own paths get the API address in front, every other URL unchanged. */
export function toPublicUrl(url: string, base: string = env.PUBLIC_API_URL): string {
  if (typeof url !== "string") return url;
  return OWN_PATH.test(url) ? `${trimBase(base)}${url}` : url;
}

/** Applies `fn` to every string inside a JSON-like value (objects, arrays, strings). Other values pass through. */
export function mapStrings(value: unknown, fn: (s: string) => string): unknown {
  if (typeof value === "string") return fn(value);
  if (Array.isArray(value)) return value.map((v) => mapStrings(v, fn));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, mapStrings(v, fn)]));
  }
  return value;
}

export const storeMediaUrls = (value: unknown, base?: string): unknown => mapStrings(value, (s) => toStoredUrl(s, base));
export const publicMediaUrls = (value: unknown, base?: string): unknown => mapStrings(value, (s) => toPublicUrl(s, base));

/** Both URLs point at the same file, whichever form each is in. */
export const sameMediaUrl = (a: string, b: string, base?: string): boolean => toStoredUrl(a, base) === toStoredUrl(b, base);

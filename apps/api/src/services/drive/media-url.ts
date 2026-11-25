const FILE_ID = /^[A-Za-z0-9_-]{10,128}$/;
const COUPLE_ID = /^[A-Za-z0-9_-]{1,64}$/;

export function isValidFileId(v: string): boolean {
  return FILE_ID.test(v);
}

export function isValidCoupleId(v: string): boolean {
  return COUPLE_ID.test(v);
}

/** Public URL a Drive-backed file is served from (our /media route, never a raw Drive link). */
export function buildMediaUrl(publicApiUrl: string, coupleId: string, fileId: string): string {
  return `${publicApiUrl.replace(/\/$/, "")}/media/${coupleId}/${fileId}`;
}

/** The file id from a URL built by buildMediaUrl for this couple; null for any other URL. */
export function parseMediaUrl(url: string | undefined, coupleId: string): string | null {
  if (!url) return null;
  const m = /\/media\/([^/?#]+)\/([^/?#]+)$/.exec(url);
  if (!m || m[1] !== coupleId || !isValidFileId(m[2] as string)) return null;
  return m[2] as string;
}

/** Mirrors isYoutubeUrl in apps/api/src/utils/section-content.ts (the server is the real check; this is UX only). */
const HOSTS = new Set(["youtube.com", "m.youtube.com", "music.youtube.com", "youtube-nocookie.com", "youtu.be"]);
const ID = /^[A-Za-z0-9_-]{11}$/;

export function isYoutubeLink(value: string): boolean {
  let u: URL;
  try {
    u = new URL(value.trim());
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;
  const host = u.hostname.toLowerCase().replace(/^www\./, "");
  if (!HOSTS.has(host)) return false;
  const parts = u.pathname.split("/").filter(Boolean);
  const id = host === "youtu.be" ? parts[0] : parts[0] === "watch" ? u.searchParams.get("v") : ["embed", "shorts", "live", "v"].includes(parts[0] ?? "") ? parts[1] : undefined;
  return !!id && ID.test(id);
}

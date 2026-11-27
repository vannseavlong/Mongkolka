// Pure rules for a couple's share preview (the tags X, Telegram and Facebook read). No file or network access.
import { resolveHeroPhoto } from "../../../packages/templates/src/hero-photo.ts";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Routes and files of the web app itself: a couple page must never overwrite them.
const OWN_PAGES = new Set(["_", "404", "index", "about", "contact", "marketplace", "templates"]);

export const isShareableSlug = (slug) => slug.length >= 3 && slug.length <= 40 && SLUG.test(slug) && !OWN_PAGES.has(slug);

/** Slugs from free text: separated by commas or whitespace, "#" starts a comment, duplicates dropped. */
export function parseSlugList(text) {
  const words = text.split("\n").flatMap((line) => line.split("#")[0].split(/[\s,]+/));
  return [...new Set(words.map((w) => w.trim().toLowerCase()).filter(Boolean))];
}

/** The photo guests see in the hero, preferring the wide banner because the share card is wide. */
export function sharePhotoUrl(site) {
  const stored = site.sections?.find((s) => s.section_key === "hero")?.content;
  const content = { coverPhotoUrl: site.profile?.cover_photo_url ?? undefined, ...(stored && typeof stored === "object" ? stored : {}) };
  return resolveHeroPhoto(content, "landscape");
}

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

export function shareText(couple) {
  const names = [couple.partner1_name, couple.partner2_name].map((n) => n?.trim()).filter(Boolean).join(" & ");
  const date = formatDate(couple.wedding_date);
  return {
    title: names ? `${names} — Wedding invitation` : "Wedding invitation",
    description: date ? `You're invited to our wedding on ${date}.` : "You're invited to our wedding.",
  };
}

/** Image type from the file's first bytes (never trust the URL or the header); null = not usable in a preview. */
export function imageType(bytes) {
  const ascii = (from, to) => String.fromCharCode(...bytes.slice(from, to));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (bytes[0] === 0x89 && ascii(1, 4) === "PNG") return { ext: "png", mime: "image/png" };
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { ext: "webp", mime: "image/webp" };
  if (ascii(0, 4) === "GIF8") return { ext: "gif", mime: "image/gif" };
  return null;
}

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const GENERATED_MARK = '<meta name="mongkolka:share-preview" content="generated"/>';

const IMAGE_TAGS = /<meta (?:property="og:image|name="twitter:image)(?::[a-z_]+)?" content="[^"]*"\/>/g;
const TEXT_TAGS = /<title>[^<]*<\/title>|<meta (?:name="description"|property="og:(?:title|description|url)"|name="twitter:(?:title|description)") content="[^"]*"\/>/g;

/**
 * The couple's page: the built shell with its <head> tags replaced. `image` ({ url, mime }) is optional;
 * without it the site's default share image stays.
 */
export function withSharePreview(shell, { title, description, url, image }) {
  const end = shell.indexOf("</head>");
  if (end < 0) throw new Error("shell page has no </head>");
  let head = shell.slice(0, end).replace(TEXT_TAGS, "");
  const meta = (key, name, content) => `<meta ${key}="${name}" content="${escapeHtml(content)}"/>`;
  const tags = [
    GENERATED_MARK,
    `<title>${escapeHtml(title)}</title>`,
    meta("name", "description", description),
    meta("property", "og:title", title),
    meta("property", "og:description", description),
    meta("property", "og:url", url),
    meta("name", "twitter:title", title),
    meta("name", "twitter:description", description),
  ];
  if (image) {
    head = head.replace(IMAGE_TAGS, "");
    tags.push(
      meta("property", "og:image", image.url),
      meta("property", "og:image:type", image.mime),
      meta("property", "og:image:alt", title),
      meta("name", "twitter:image", image.url),
      meta("name", "twitter:image:alt", title),
    );
  }
  return head + tags.join("") + shell.slice(end);
}

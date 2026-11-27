// Runs after `next build`: writes out/<slug>.html for each listed couple so a shared link shows their hero photo.
// Firebase serves that file before the "_" shell rewrite. Previews change only on the next build + deploy.
//
// Which couples: SHARE_PREVIEW_SLUGS="a-b,c-d", else apps/web/share-previews.txt (one slug per line, not in git).
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GENERATED_MARK, imageType, isShareableSlug, parseSlugList, sharePhotoUrl, shareText, withSharePreview } from "./share-preview-html.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
// X rejects card images over 5 MB.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
// The free API host sleeps; the first request can take about a minute.
const TIMEOUT_MS = 90_000;

// Same precedence as `next build`: a value already set is never overwritten, so load the strongest file first.
for (const file of [".env.production.local", ".env.local", ".env.production", ".env"]) {
  if (existsSync(join(root, file))) process.loadEnvFile(join(root, file));
}

function listedSlugs() {
  const file = join(root, "share-previews.txt");
  return parseSlugList(process.env.SHARE_PREVIEW_SLUGS ?? (existsSync(file) ? readFileSync(file, "utf8") : ""));
}

const get = (url) => fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });

/** Copies the photo into the build, so a preview does not depend on the API being awake. */
async function copyImage(slug, photo, apiUrl, siteUrl) {
  const source = new URL(photo, apiUrl);
  // Couples can type any link: only https, or our own API (http in local development).
  if (source.protocol !== "https:" && source.origin !== new URL(apiUrl).origin) throw new Error(`photo is not https: ${source.href}`);
  const res = await get(source);
  if (!res.ok) throw new Error(`photo returned ${res.status}: ${source.href}`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  const type = imageType(bytes);
  if (!type) throw new Error(`photo is not a JPEG, PNG, WebP or GIF: ${source.href}`);
  if (bytes.length > MAX_IMAGE_BYTES) throw new Error(`photo is over 5 MB (${(bytes.length / 1048576).toFixed(1)} MB): ${source.href}`);
  // The content hash gives a new photo a new address, so platforms do not keep showing the cached one.
  const name = `${slug}-${createHash("sha256").update(bytes).digest("hex").slice(0, 8)}.${type.ext}`;
  mkdirSync(join(out, "share"), { recursive: true });
  writeFileSync(join(out, "share", name), bytes);
  return { url: `${siteUrl}/share/${name}`, mime: type.mime };
}

async function writePreview(slug, shell, apiUrl, siteUrl) {
  if (!isShareableSlug(slug)) throw new Error("not a couple slug");
  const target = join(out, `${slug}.html`);
  if (existsSync(target) && !readFileSync(target, "utf8").includes(GENERATED_MARK)) throw new Error("a page of the app already uses this name");
  const res = await get(`${apiUrl}/public/api/site/${slug}`);
  if (res.status === 404) throw new Error("no published site with this slug");
  if (!res.ok) throw new Error(`API returned ${res.status}`);
  const site = await res.json();
  const photo = sharePhotoUrl(site);
  const image = photo ? await copyImage(slug, photo, apiUrl, siteUrl) : undefined;
  writeFileSync(target, withSharePreview(shell, { ...shareText(site.couple), url: `${siteUrl}/${slug}`, image }));
  console.log(`share preview: ${slug}${image ? "" : " (no hero photo, default image kept)"}`);
}

const slugs = listedSlugs();
if (slugs.length === 0) {
  console.warn("share preview: no couples listed, every couple link shows the default image");
  process.exit(0);
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim().replace(/\/+$/, "");
if (!apiUrl || !domain) {
  console.error("share preview: set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_ROOT_DOMAIN");
  process.exit(1);
}
const shell = readFileSync(join(out, "_.html"), "utf8");
let failed = 0;
for (const slug of slugs) {
  try {
    await writePreview(slug, shell, apiUrl, `https://${domain}`);
  } catch (err) {
    failed += 1;
    console.error(`share preview FAILED: ${slug}: ${err instanceof Error ? err.message : err}`);
  }
}
// A failure stops the build, so a deploy never silently loses a couple's preview.
if (failed > 0) process.exit(1);

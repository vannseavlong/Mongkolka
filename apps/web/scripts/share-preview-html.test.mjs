import assert from "node:assert/strict";
import { test } from "node:test";
import { imageType, isShareableSlug, parseSlugList, sharePhotoUrl, shareText, withSharePreview } from "./share-preview-html.mjs";

const shell =
  '<html><head><meta charSet="utf-8"/><title>Mongkolka</title><meta name="description" content="d"/>' +
  '<meta property="og:title" content="t"/><meta property="og:site_name" content="Mongkolka"/>' +
  '<meta property="og:image" content="default.png"/><meta property="og:image:width" content="1200"/>' +
  '<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:image" content="default.png"/>' +
  "</head><body></body></html>";

test("replaces text and image tags, escaped, and keeps the rest", () => {
  const html = withSharePreview(shell, { title: 'A "$&" <b>', description: "x", url: "https://s/a-b", image: { url: "https://s/share/p.jpg", mime: "image/jpeg" } });
  assert.ok(!html.includes("default.png"));
  assert.ok(!html.includes("og:image:width"));
  assert.equal(html.match(/<title>/g).length, 1);
  assert.ok(html.includes("<title>A &quot;$&amp;&quot; &lt;b&gt;</title>"));
  assert.ok(html.includes('<meta name="twitter:image" content="https://s/share/p.jpg"/>'));
  assert.ok(html.includes('content="summary_large_image"'));
  assert.ok(html.includes('property="og:site_name"'));
});

test("without a photo the default image stays", () => {
  const html = withSharePreview(shell, { title: "A", description: "x", url: "u" });
  assert.ok(html.includes('<meta property="og:image" content="default.png"/>'));
});

test("photo: landscape, then portrait, then cover", () => {
  const site = (content, cover = "c") => ({ profile: { cover_photo_url: cover }, sections: [{ section_key: "hero", content }] });
  assert.equal(sharePhotoUrl(site({ landscapeUrl: "l", portraitUrl: "p" })), "l");
  assert.equal(sharePhotoUrl(site({ portraitUrl: "p" })), "p");
  assert.equal(sharePhotoUrl(site(null)), "c");
  assert.equal(sharePhotoUrl({ profile: null, sections: [] }), undefined);
});

test("text handles missing names and dates", () => {
  assert.deepEqual(shareText({ partner1_name: "A", partner2_name: "B", wedding_date: "2026-12-05" }), {
    title: "A & B — Wedding invitation",
    description: "You're invited to our wedding on 5 December 2026.",
  });
  assert.equal(shareText({ partner1_name: null, partner2_name: null, wedding_date: "soon" }).title, "Wedding invitation");
});

test("slugs", () => {
  assert.deepEqual(parseSlugList("A-b, c-d # note\n\nc-d\n# x"), ["a-b", "c-d"]);
  assert.ok(isShareableSlug("vutha-nita"));
  for (const bad of ["about", "index", "../x", "a", "a/b"]) assert.ok(!isShareableSlug(bad), bad);
});

test("image type comes from the bytes", () => {
  assert.equal(imageType(new Uint8Array([0xff, 0xd8, 0xff, 0])).ext, "jpg");
  assert.equal(imageType(new TextEncoder().encode("<html>")), null);
});

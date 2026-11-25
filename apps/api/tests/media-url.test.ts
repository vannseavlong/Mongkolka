import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mapStrings, publicMediaUrls, sameMediaUrl, storeMediaUrls, toPublicUrl, toStoredUrl } from "../src/utils/media-url.js";

const BASE = "http://localhost:4000";

describe("media urls", () => {
  it("stores our own upload and Drive URLs as a path", () => {
    assert.equal(toStoredUrl(`${BASE}/uploads/couples/c1/assets/a.jpg`, BASE), "/uploads/couples/c1/assets/a.jpg");
    assert.equal(toStoredUrl(`${BASE}/media/c1/abcDEF12345`, BASE), "/media/c1/abcDEF12345");
    assert.equal(toStoredUrl(`${BASE}/uploads/x.jpg`, `${BASE}/`), "/uploads/x.jpg", "a trailing slash on the base is ignored");
  });
  it("leaves every other URL exactly as it is", () => {
    for (const url of ["https://cdn.example.com/uploads/a.jpg", "https://example.com/photo.jpg", "http://localhost:4000/health", "http://localhost:4000", "/somewhere/else.jpg", "", "plain text"]) {
      assert.equal(toStoredUrl(url, BASE), url, url);
      assert.equal(toPublicUrl(url, BASE), url, url);
    }
  });
  it("adds the API address to our own paths when serving", () => {
    assert.equal(toPublicUrl("/uploads/couples/c1/assets/a.jpg", BASE), `${BASE}/uploads/couples/c1/assets/a.jpg`);
    assert.equal(toPublicUrl("/media/c1/abcDEF12345", "https://api.example.com/"), "https://api.example.com/media/c1/abcDEF12345");
  });
  it("round-trips, and old full-address rows keep working", () => {
    const stored = toStoredUrl(`${BASE}/uploads/a.jpg`, BASE);
    assert.equal(toPublicUrl(stored, BASE), `${BASE}/uploads/a.jpg`);
    assert.equal(toPublicUrl(`${BASE}/uploads/old.jpg`, BASE), `${BASE}/uploads/old.jpg`);
  });
  it("changing the API address needs no data change", () => {
    assert.equal(toPublicUrl("/uploads/a.jpg", "https://api.prod.example"), "https://api.prod.example/uploads/a.jpg");
  });
  it("maps every string inside JSON content and nothing else", () => {
    const content = { photos: [`${BASE}/uploads/1.jpg`, "https://x/2.jpg"], portraitUrl: `${BASE}/media/c/abcDEF12345`, n: 3, flag: true, nothing: null, title: { kh: "ក" } };
    const stored = storeMediaUrls(content, BASE) as typeof content;
    assert.deepEqual(stored, { ...content, photos: ["/uploads/1.jpg", "https://x/2.jpg"], portraitUrl: "/media/c/abcDEF12345" });
    assert.deepEqual(publicMediaUrls(stored, BASE), content);
    assert.equal(mapStrings(5, () => "x"), 5);
  });
  it("compares a stored path with a full address as the same file", () => {
    assert.equal(sameMediaUrl("/uploads/a.jpg", `${BASE}/uploads/a.jpg`, BASE), true);
    assert.equal(sameMediaUrl("/uploads/a.jpg", `${BASE}/uploads/b.jpg`, BASE), false);
  });
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { heroContentFor, resolveHeroPhoto } from "./hero-photo";

describe("hero photo for the screen", () => {
  const both = { portraitUrl: "https://x/p.jpg", landscapeUrl: "https://x/l.jpg", coverPhotoUrl: "https://x/c.jpg" };
  it("uses the banner made for the orientation", () => {
    assert.equal(resolveHeroPhoto(both, "portrait"), "https://x/p.jpg");
    assert.equal(resolveHeroPhoto(both, "landscape"), "https://x/l.jpg");
  });
  it("a single banner is used on both screens, ahead of the profile cover", () => {
    assert.equal(resolveHeroPhoto({ portraitUrl: "https://x/p.jpg", coverPhotoUrl: "https://x/c.jpg" }, "landscape"), "https://x/p.jpg");
    assert.equal(resolveHeroPhoto({ landscapeUrl: "https://x/l.jpg", coverPhotoUrl: "https://x/c.jpg" }, "portrait"), "https://x/l.jpg");
  });
  it("falls back to the profile cover, then to nothing", () => {
    assert.equal(resolveHeroPhoto({ coverPhotoUrl: "https://x/c.jpg" }, "portrait"), "https://x/c.jpg");
    assert.equal(resolveHeroPhoto({ portraitUrl: "  " }, "portrait"), undefined);
    assert.equal(resolveHeroPhoto(undefined, "landscape"), undefined);
  });
  it("merges the profile-derived content with the section's banners", () => {
    const out = heroContentFor({ coverPhotoUrl: "https://x/c.jpg" }, { landscapeUrl: "https://x/l.jpg" }, "landscape");
    assert.equal(out.coverPhotoUrl, "https://x/l.jpg");
    assert.equal(out.landscapeUrl, "https://x/l.jpg");
    assert.equal(heroContentFor({ coverPhotoUrl: "https://x/c.jpg" }, null, "portrait").coverPhotoUrl, "https://x/c.jpg");
    assert.deepEqual(heroContentFor(null, "junk", "portrait"), { coverPhotoUrl: undefined });
  });
});

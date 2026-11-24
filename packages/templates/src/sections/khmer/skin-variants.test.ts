import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { componentOwner, variantsForSkin } from "./skin-resolve";

const row = (component_id: string, section: string) => ({ component_id, section });
const rows = [
  row("hero_classic", "hero"),
  row("hero_emerald", "hero"),
  row("hero_garden", "hero"),
  row("hero_kids", "hero"),
  row("gallery_skin", "gallery"),
  row("gallery_fairytale", "gallery"),
  row("gallery_grid", "gallery"),
  row("details_khmer", "details"),
  row("details_skin", "details"),
  row("details_kids", "details"),
  row("invitation_khmer", "invitation"),
  row("invitation_kids", "invitation"),
];
const ids = (skin: Parameters<typeof variantsForSkin>[1]) => variantsForSkin(rows, skin).map((r) => r.component_id);

describe("componentOwner", () => {
  it("reads the owner from the id", () => {
    assert.equal(componentOwner("hero_emerald"), "emerald");
    assert.equal(componentOwner("gallery_skin"), "skin");
    assert.equal(componentOwner("details_khmer"), "khmer");
    assert.equal(componentOwner("hero_classic"), null);
    assert.equal(componentOwner("hero_grace"), null);
  });
});

describe("variantsForSkin", () => {
  it("a plain template sees no skin components", () => {
    assert.deepEqual(ids(null), ["hero_classic", "gallery_grid"]);
  });
  it("a skin template sees its own, shared and plain ones, never another skin's", () => {
    const got = ids("emerald");
    assert.ok(got.includes("hero_emerald") && got.includes("hero_classic") && got.includes("gallery_skin"));
    assert.ok(!got.includes("hero_garden") && !got.includes("hero_kids") && !got.includes("gallery_fairytale") && !got.includes("details_kids"));
    assert.ok(got.includes("details_khmer") && got.includes("invitation_khmer"));
  });
  it("drops the wedding-wording _khmer variant where the skin has its own", () => {
    const got = ids("kids");
    assert.ok(got.includes("invitation_kids") && !got.includes("invitation_khmer"));
    assert.ok(got.includes("details_kids") && !got.includes("details_khmer") && got.includes("details_skin"));
  });
  it("gallery_fairytale belongs to fairytale only", () => {
    assert.ok(ids("fairytale").includes("gallery_fairytale"));
    assert.ok(!ids("sakura").includes("gallery_fairytale"));
  });
});

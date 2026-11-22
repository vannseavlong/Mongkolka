import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cleanPhotos, fillTemplate, gridClasses, tileClass, visiblePhotos } from "./gallery-layout";

describe("cleanPhotos", () => {
  it("trims, de-duplicates and drops non-strings", () => {
    assert.deepEqual(cleanPhotos([" a ", "a", "", "b", 3, null, "b "]), ["a", "b"]);
  });
  it("returns [] for anything that is not an array", () => {
    for (const v of [undefined, null, "x", 5, {}]) assert.deepEqual(cleanPhotos(v), []);
  });
});

describe("gridClasses", () => {
  it("keeps a lone photo narrow and centred, pairs side by side, 3+ in a 2/3 column grid", () => {
    assert.equal(gridClasses(0).cols, "grid-cols-1");
    assert.equal(gridClasses(1).width, "max-w-[15rem]");
    assert.equal(gridClasses(2).cols, "grid-cols-2");
    assert.equal(gridClasses(5).cols, "grid-cols-2 sm:grid-cols-3");
  });
});

describe("tileClass", () => {
  it("adds no offset for a single photo and a drop for the second of a pair", () => {
    assert.equal(tileClass(0, 1), "");
    assert.equal(tileClass(0, 2), "");
    assert.equal(tileClass(1, 2), "mt-6");
  });
  it("centres an odd last tile under the pair", () => {
    assert.match(tileClass(4, 5), /col-span-2/);
    assert.doesNotMatch(tileClass(3, 5), /col-span-2/);
  });
  it("staggers every second tile on phones and the middle column on desktop", () => {
    assert.match(tileClass(1, 6), /mt-6/);
    assert.match(tileClass(1, 6), /sm:mt-10/);
    assert.equal(tileClass(0, 6), "");
  });
});

describe("visiblePhotos", () => {
  it("hides failed photos but keeps the one open in the viewer", () => {
    const failed = new Set(["b", "c"]);
    assert.deepEqual(visiblePhotos(["a", "b", "c"], failed), ["a"]);
    assert.deepEqual(visiblePhotos(["a", "b", "c"], failed, "c"), ["a", "c"]);
  });
});

describe("fillTemplate", () => {
  it("replaces known placeholders and leaves unknown ones", () => {
    assert.equal(fillTemplate("Photo {n} of {total} {x}", { n: 2, total: 9 }), "Photo 2 of 9 {x}");
  });
});

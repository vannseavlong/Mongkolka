import { test } from "node:test";
import assert from "node:assert/strict";
import { limitPhotos, stackSlices } from "./gallery-stack";

const p = (n: number) => Array.from({ length: n }, (_, i) => `p${i}`);

test("limitPhotos: no setting keeps every photo", () => {
  assert.equal(limitPhotos(p(12), undefined).length, 12);
  assert.equal(limitPhotos(p(12), "").length, 12);
});
test("limitPhotos: couple's number caps, clamped to 3..24", () => {
  assert.equal(limitPhotos(p(12), 7).length, 7);
  assert.equal(limitPhotos(p(12), 1).length, 3);
  assert.equal(limitPhotos(p(40), 99).length, 24);
});
test("stackSlices: counts in order, last block takes the rest", () => {
  const s = stackSlices(p(10), [{ layout: "gallery_masonry", count: 4 }, { layout: "gallery_carousel", count: 2 }]);
  assert.deepEqual(s.map((x) => [x.layout, x.photos.length]), [["gallery_masonry", 4], ["gallery_carousel", 6]]);
});
test("stackSlices: empty blocks and unknown layouts are dropped", () => {
  const s = stackSlices(p(3), [{ layout: "gallery_grid", count: 5 }, { layout: "nope" }, { layout: "gallery_carousel" }]);
  assert.deepEqual(s.map((x) => x.layout), ["gallery_grid"]);
  assert.equal(s[0]?.photos.length, 3);
});
test("stackSlices: no stack gives nothing", () => {
  assert.deepEqual(stackSlices(p(3), undefined), []);
});

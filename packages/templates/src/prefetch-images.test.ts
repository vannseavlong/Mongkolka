import { test } from "node:test";
import assert from "node:assert/strict";
import { prefetchTargets } from "./prefetch-images";

const sections = [
  { section_key: "hero", enabled: true, content: { portraitUrl: "/p.webp", landscapeUrl: "/l.webp" } },
  { section_key: "gallery", enabled: true, content: { photos: Array.from({ length: 20 }, (_, i) => `/g${i}.webp`) } },
];

test("hero photo for the screen first, then the first gallery photos, capped", () => {
  const urls = prefetchTargets(sections, "portrait", 3);
  assert.deepEqual(urls, ["/p.webp", "/g0.webp", "/g1.webp", "/g2.webp"]);
  assert.equal(prefetchTargets(sections, "landscape", 0)[0], "/l.webp");
});

test("disabled or missing sections give nothing", () => {
  assert.deepEqual(prefetchTargets([{ ...sections[0]!, enabled: false }], "portrait"), []);
  assert.deepEqual(prefetchTargets([], "portrait"), []);
});

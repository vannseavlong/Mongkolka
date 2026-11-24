import { test } from "node:test";
import assert from "node:assert/strict";
import { devRewrite } from "./dev-rewrite.mjs";

test("couple sites and their sub-pages go to the _ shell", () => {
  assert.equal(devRewrite("/demo"), "/_");
  assert.equal(devRewrite("/demo/wishes"), "/_/wishes");
  assert.equal(devRewrite("/demo/photos"), "/_/photos");
  assert.equal(devRewrite("/_"), "/_");
});
test("template and marketplace pages", () => {
  assert.equal(devRewrite("/templates/preview/covenant-gold-blush"), "/templates/preview/_");
  assert.equal(devRewrite("/templates/covenant_gold"), "/templates/_");
  assert.equal(devRewrite("/templates"), "/templates");
  assert.equal(devRewrite("/marketplace/abc"), "/marketplace/_");
  assert.equal(devRewrite("/marketplace"), "/marketplace");
});
test("static pages, files and Next internals are untouched", () => {
  for (const p of ["/", "/about", "/contact", "/_next/static/x.js", "/_next/webpack-hmr", "/templates/covenant/hero.webp", "/favicon.ico", "/demo/other/deep"]) assert.equal(devRewrite(p), p, p);
});

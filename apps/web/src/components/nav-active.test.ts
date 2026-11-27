import assert from "node:assert/strict";
import { test } from "node:test";
import { isActivePath } from "./nav-active.ts";

test("matches the page and pages under it", () => {
  assert.equal(isActivePath("/templates", "/templates"), true);
  assert.equal(isActivePath("/templates/", "/templates"), true);
  assert.equal(isActivePath("/templates/preview/sage", "/templates"), true);
});

test("does not match other pages or lookalike prefixes", () => {
  assert.equal(isActivePath("/", "/templates"), false);
  assert.equal(isActivePath("/templates-old", "/templates"), false);
  assert.equal(isActivePath(null, "/templates"), false);
});

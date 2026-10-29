import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import siteTemplates from "../seeds/site-templates.js";
import sectionComponents from "../seeds/section-components.js";

// Reads the registry as text so the API never imports the React templates package.
const registrySrc = readFileSync(
  fileURLToPath(new URL("../../../packages/templates/src/registry.ts", import.meta.url)),
  "utf8",
);
const registered = new Set([...registrySrc.matchAll(/^\s+([a-z]+_[a-z_]+):\s*[A-Z]\w+,/gm)].map((m) => m[1] as string));

describe("grace_blush seed rows", () => {
  const grace = siteTemplates.site_templates.find((t) => t.template_id === "grace_blush") as
    | (Record<string, unknown> & { default_components: Record<string, string>; default_sections: { section_key: string; enabled: boolean }[] })
    | undefined;

  it("is inactive and has the expected slug", () => {
    assert.ok(grace);
    assert.equal(grace.status, "inactive");
    assert.equal(grace.slug, "pink-gold-white");
  });

  it("every default component id is in the template registry and in the section_components seed", () => {
    assert.ok(grace);
    const seeded = new Set(sectionComponents.section_components.map((c) => c.component_id));
    for (const [section, id] of Object.entries(grace.default_components)) {
      assert.ok(registered.has(id), `${section}: ${id} missing from registry.ts`);
      assert.ok(seeded.has(id), `${section}: ${id} missing from section-components seed`);
    }
  });

  it("default_sections is ordered, covers each section once, and ends with footer", () => {
    assert.ok(grace);
    const keys = grace.default_sections.map((s) => s.section_key);
    assert.equal(new Set(keys).size, keys.length);
    assert.equal(keys[keys.length - 1], "footer");
    for (const k of keys) assert.ok(k in grace.default_components, `${k} has no default component`);
  });
});

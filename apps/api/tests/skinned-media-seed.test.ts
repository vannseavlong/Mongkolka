import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import siteTemplates from "../seeds/site-templates.js";
import sectionComponents from "../seeds/section-components.js";

const registrySrc = readFileSync(
  fileURLToPath(new URL("../../../packages/templates/src/registry.ts", import.meta.url)),
  "utf8",
);
const registered = new Set([...registrySrc.matchAll(/^\s+([a-z]+_[a-z_]+):\s*[A-Z]\w+,/gm)].map((m) => m[1] as string));

type Tpl = { template_id: string; status: string; default_components: Record<string, string> };
const IDS = ["emerald_kbach", "royal_garden", "royal_cream", "sakura_romance", "fairytale_storybook", "kids_fantasy_birthday"];
const templates = siteTemplates.site_templates as Tpl[];
const rows = (Array.isArray(sectionComponents) ? sectionComponents : (sectionComponents as { section_components: unknown[] }).section_components) as { component_id: string; section: string; status: string }[];

describe("skin-aware gallery and guestbook seed", () => {
  it("registers gallery_skin and guestbook_skin and seeds them inactive under their own sections", () => {
    for (const [id, section] of [["gallery_skin", "gallery"], ["guestbook_skin", "guestbook"]] as const) {
      assert.ok(registered.has(id), `${id} registered`);
      const row = rows.find((r) => r.component_id === id);
      assert.ok(row, `${id} seeded`);
      assert.equal(row.section, section);
      assert.equal(row.status, "inactive");
    }
  });
  it("all six Khmer templates use them, and stay inactive", () => {
    for (const id of IDS) {
      const t = templates.find((x) => x.template_id === id)!;
      assert.ok(t, id);
      assert.equal(t.default_components.gallery, "gallery_skin", `${id} gallery`);
      assert.equal(t.default_components.guestbook, "guestbook_skin", `${id} guestbook`);
      assert.equal(t.status, "inactive", `${id} status`);
    }
  });
  it("does not change the gallery or guestbook of any other template", () => {
    for (const t of templates.filter((x) => !IDS.includes(x.template_id))) {
      assert.notEqual(t.default_components.gallery, "gallery_skin", t.template_id);
      assert.notEqual(t.default_components.guestbook, "guestbook_skin", t.template_id);
    }
  });
});

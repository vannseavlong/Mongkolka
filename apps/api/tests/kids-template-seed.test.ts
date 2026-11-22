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

type Tpl = { template_id: string; status: string; default_components: Record<string, string>; default_sections: { section_key: string; enabled: boolean }[] };
const kids = (siteTemplates.site_templates as Tpl[]).find((t) => t.template_id === "kids_fantasy_birthday")!;
const rows = (Array.isArray(sectionComponents) ? sectionComponents : (sectionComponents as { section_components: unknown[] }).section_components) as { component_id: string; section: string; status: string }[];

describe("kids_fantasy_birthday seed", () => {
  it("uses the kids-specific invitation, agenda and location components plus the KHQR gift card", () => {
    assert.equal(kids.status, "inactive");
    assert.deepEqual(
      [kids.default_components.invitation, kids.default_components.agenda, kids.default_components.details, kids.default_components.registry],
      ["invitation_kids", "agenda_kids", "details_kids", "registry_khqr"],
    );
  });
  it("registers and seeds (inactive, under the right section) every kids component", () => {
    for (const [id, section] of [["opening_kids", "opening"], ["hero_kids", "hero"], ["invitation_kids", "invitation"], ["agenda_kids", "agenda"], ["details_kids", "details"]] as const) {
      assert.ok(registered.has(id), `${id} registered`);
      const row = rows.find((r) => r.component_id === id);
      assert.ok(row, `${id} seeded`);
      assert.equal(row.section, section);
      assert.equal(row.status, "inactive");
    }
  });
  it("is a birthday: invitation, party plan, location, gift and wishes sections are on", () => {
    const on = new Set(kids.default_sections.filter((s) => s.enabled).map((s) => s.section_key));
    for (const k of ["opening", "hero", "invitation", "agenda", "details", "gallery", "registry", "guestbook", "footer"]) assert.ok(on.has(k), k);
  });
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sectionComponents from "../seeds/section-components.js";
import siteTemplates from "../seeds/site-templates.js";

// `lsdb seed --upsert` finds the existing row by the FIRST key of each record. If that key is not the row's
// unique id (e.g. `status`), it matches and rewrites an unrelated row, so every seed row must lead with its id.
describe("seed rows lead with their unique id (lsdb seed --upsert matches on the first key)", () => {
  it("section_components rows start with component_id", () => {
    for (const row of sectionComponents.section_components) assert.equal(Object.keys(row)[0], "component_id", String((row as { component_id: string }).component_id));
  });
  it("site_templates rows start with template_id", () => {
    for (const row of siteTemplates.site_templates) assert.equal(Object.keys(row)[0], "template_id", String(row.template_id));
  });
  it("ids are unique within each seed", () => {
    const ids = sectionComponents.section_components.map((r) => r.component_id);
    assert.equal(new Set(ids).size, ids.length);
    const tids = siteTemplates.site_templates.map((r) => r.template_id);
    assert.equal(new Set(tids).size, tids.length);
  });
  it("each row keeps its own status when it sets one, else active", () => {
    const row = sectionComponents.section_components.find((r) => r.component_id === "hero_covenant");
    assert.equal(row?.status, "inactive");
    assert.equal(sectionComponents.section_components.find((r) => r.component_id === "hero_classic")?.status, "active");
  });
});

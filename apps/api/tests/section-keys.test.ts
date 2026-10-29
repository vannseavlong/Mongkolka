import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Reads sources as text so the API never imports the React templates package.
const read = (rel: string) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");

function listAfter(source: string, anchor: RegExp): string[] {
  const match = anchor.exec(source);
  assert.ok(match, `anchor ${anchor} not found`);
  const rest = source.slice(match.index + match[0].length);
  const body = rest.slice(0, rest.search(/\]/));
  return [...body.matchAll(/["']([a-z_]+)["']/g)].map((m) => m[1] as string);
}

describe("section key lists stay in sync", () => {
  const templates = listAfter(
    read("../../../packages/templates/src/types.ts"),
    /export const SECTION_KEYS = \[/,
  );
  const service = listAfter(
    read("../src/modules/couple-website/couple-website.service.ts"),
    /const SECTION_KEYS = \[/,
  );
  const websiteEnum = listAfter(read("../schemas/couple/website_sections.ts"), /\.enum\(\[/);
  const componentEnum = listAfter(read("../schemas/admin/section_components.ts"), /\.enum\(\[/);

  const couple = listAfter(
    read("../../couple/src/features/website/data/schema.ts"),
    /export const WEBSITE_SECTIONS = \[/,
  );
  const admin = listAfter(
    read("../../admin/src/features/section-components/data/schema.ts"),
    /export const WEBSITE_SECTIONS = \[/,
  );
  const apiSections = listAfter(
    read("../src/modules/section-components/section-components.service.ts"),
    /export const SECTIONS = \[/,
  );
  const labelsSrc = read("../../couple/src/features/website/workspace/section-labels.ts");
  const labels = [...labelsSrc.slice(labelsSrc.indexOf("SECTION_LABELS")).split("};")[0]!.matchAll(/^\s+([a-z]+):\s*"/gm)].map(
    (m) => m[1] as string,
  );

  it("couple WEBSITE_SECTIONS, SECTION_LABELS, admin WEBSITE_SECTIONS and API SECTIONS match", () => {
    assert.deepEqual(couple, templates);
    assert.deepEqual([...labels].sort(), [...templates].sort());
    assert.deepEqual(admin, templates);
    assert.deepEqual(apiSections, templates);
  });

  it("includes verse and footer", () => {
    assert.ok(templates.includes("verse") && templates.includes("footer") && templates.includes("guestbook"));
  });
  it("API service mirrors the templates SECTION_KEYS (order too)", () => {
    assert.deepEqual(service, templates);
  });
  it("website_sections enum covers every key", () => {
    assert.deepEqual([...websiteEnum].sort(), [...templates].sort());
  });
  it("section_components enum covers every key", () => {
    assert.deepEqual([...componentEnum].sort(), [...templates].sort());
  });
  it("every key has a seeded default component", () => {
    const seed = read("../seeds/section-components.ts");
    for (const key of templates) {
      assert.match(seed, new RegExp(`section: "${key}"`), `no seed row for ${key}`);
    }
  });
});

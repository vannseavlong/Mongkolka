import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import siteTemplates from "../seeds/site-templates.js";
import sectionComponents from "../seeds/section-components.js";
import { SECTION_KEYS } from "../src/utils/section-keys.js";
import { contrastRatio, MIN_ACCENT_CONTRAST, MIN_TEXT_CONTRAST } from "../../../packages/templates/src/theme-presets.js";
import { skinKeyMismatches } from "../../../packages/templates/src/sections/skin-strings.js";

// Reads the registry as text so the API never imports the React templates package.
const registrySrc = readFileSync(
  fileURLToPath(new URL("../../../packages/templates/src/registry.ts", import.meta.url)),
  "utf8",
);
const registered = new Set([...registrySrc.matchAll(/^\s+([a-z]+_[a-z_]+):\s*[A-Z]\w+,/gm)].map((m) => m[1] as string));

const KHMER_IDS = [
  "emerald_kbach",
  "royal_garden",
  "royal_cream",
  "sakura_romance",
  "fairytale_storybook",
  "kids_fantasy_birthday",
];
const PARTICLE_KINDS = ["petals", "butterflies", "dust", "bokeh"];
const DOCK_KEYS = ["invitation", "story", "agenda", "details", "gallery", "registry", "guestbook", "rsvp"];

type Tpl = {
  template_id: string;
  slug: string;
  status: string;
  default_theme: { bg_color: string; text_color: string; accent_color: string };
  default_components: Record<string, string>;
  default_sections: { section_key: string; enabled: boolean }[];
  chrome: {
    dock?: boolean | { include?: string[] };
    music?: { icon?: string };
    particles?: { kinds: string[] };
  };
};
const templates = KHMER_IDS.map((id) => siteTemplates.site_templates.find((t) => t.template_id === id) as unknown as Tpl | undefined);
const componentRows = sectionComponents.section_components;

describe("Khmer e-invitation seed rows", () => {
  it("skin string keys match in en and kh", () => assert.deepEqual(skinKeyMismatches(), []));

  it("all six templates exist, are active and have unique slugs", () => {
    assert.ok(templates.every(Boolean), "a template row is missing");
    for (const t of templates as Tpl[]) assert.equal(t.status, "active", `${t.template_id} must be active`);
    const slugs = (templates as Tpl[]).map((t) => t.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    const all = siteTemplates.site_templates.map((t) => t.slug);
    assert.equal(new Set(all).size, all.length, "template slugs must be unique across the catalog");
  });

  it("palettes meet the contrast floor", () => {
    for (const t of templates as Tpl[]) {
      const { bg_color: bg, text_color: tx, accent_color: ac } = t.default_theme;
      assert.ok((contrastRatio(tx, bg) ?? 0) >= MIN_TEXT_CONTRAST, `${t.template_id} text/bg`);
      assert.ok((contrastRatio(ac, bg) ?? 0) >= MIN_ACCENT_CONTRAST, `${t.template_id} accent/bg`);
    }
  });

  it("every default component is registered, seeded, and used under its own section", () => {
    const bySection = new Map(componentRows.map((c) => [c.component_id, c.section]));
    for (const t of templates as Tpl[]) {
      for (const [section, id] of Object.entries(t.default_components)) {
        assert.ok(registered.has(id), `${t.template_id} ${section}: ${id} missing from registry.ts`);
        assert.equal(bySection.get(id), section, `${t.template_id}: ${id} seeded under ${bySection.get(id)}, used as ${section}`);
      }
    }
  });

  it("each template covers every section once, cover then opening first, footer last, and has a default component for each (cover is optional)", () => {
    for (const t of templates as Tpl[]) {
      const keys = t.default_sections.map((s) => s.section_key);
      assert.deepEqual([...keys].sort(), [...SECTION_KEYS].sort(), `${t.template_id} default_sections`);
      assert.equal(keys[0], "cover");
      assert.equal(keys[1], "opening");
      assert.equal(keys[keys.length - 1], "footer");
      for (const k of keys) assert.ok(k === "cover" || k in t.default_components, `${t.template_id}: ${k} has no default component`);
    }
  });

  it("each skin has its own opening and hero rows, active, and registry_khqr (Web-khqr-gift) is seeded active and registered", () => {
    for (const skin of ["emerald", "garden", "cream", "sakura", "fairytale", "kids"]) {
      for (const section of ["opening", "hero"]) {
        const row = componentRows.find((c) => c.component_id === `${section}_${skin}`);
        assert.ok(row, `${section}_${skin} not seeded`);
        assert.equal(row.section, section);
        assert.equal(row.status, "active");
      }
    }
    for (const id of ["invitation_khmer", "agenda_khmer", "letters_khmer", "details_khmer"]) {
      assert.equal(componentRows.find((c) => c.component_id === id)?.status, "active", id);
    }
    assert.ok(registered.has("registry_khqr"), "registry_khqr is registered by Web-khqr-gift");
    const khqr = componentRows.find((c) => c.component_id === "registry_khqr");
    assert.equal(khqr?.section, "registry");
    assert.equal(khqr?.status, "active");
  });

  it("default page turns on the invitation, agenda, gift and (not for kids) letters; verse, video, note, map, timeline and music stay optional and off", () => {
    for (const t of templates as Tpl[]) {
      const kids = t.template_id === "kids_fantasy_birthday";
      const ON = ["opening", "hero", "invitation", "story", "agenda", "gallery", "details", "rsvp", "registry", "guestbook", ...(kids ? [] : ["letters"]), "footer"];
      const OFF = ["cover", "verse", "video", "timeline", "music", "note", "map", ...(kids ? ["letters"] : [])];
      const on = t.default_sections.filter((x) => x.enabled).map((x) => x.section_key);
      assert.deepEqual(on, ON, `${t.template_id} enabled sections, in order`);
      const off = t.default_sections.filter((x) => !x.enabled).map((x) => x.section_key);
      assert.deepEqual([...off].sort(), [...OFF].sort(), `${t.template_id} optional sections`);
      assert.equal(t.default_components.story, "story_skin", t.template_id);
      assert.equal(t.default_components.rsvp, "rsvp_skin", t.template_id);
      assert.equal(t.default_components.footer, "footer_skin", t.template_id);
      assert.equal(t.default_components.details, t.template_id === "kids_fantasy_birthday" ? "details_kids" : "details_skin", t.template_id);
      const include = typeof t.chrome.dock === "object" ? (t.chrome.dock.include ?? []) : [];
      for (const k of include) assert.ok(on.includes(k), `${t.template_id} dock ${k} is on by default`);
    }
  });

  it("skinned section components are seeded active and registered", () => {
    for (const [id, section] of [["story_skin", "story"], ["details_skin", "details"], ["rsvp_skin", "rsvp"], ["footer_skin", "footer"]] as const) {
      const row = componentRows.find((c) => c.component_id === id);
      assert.ok(row, `${id} seeded`);
      assert.equal(row.section, section);
      assert.equal(row.status, "active");
      assert.ok(registered.has(id), `${id} registered`);
    }
  });

  it("chrome config uses known particle kinds and dock sections", () => {
    for (const t of templates as Tpl[]) {
      assert.ok(t.chrome.dock, `${t.template_id} dock`);
      for (const kind of t.chrome.particles?.kinds ?? []) assert.ok(PARTICLE_KINDS.includes(kind), `${t.template_id} particle ${kind}`);
      const include = typeof t.chrome.dock === "object" ? (t.chrome.dock.include ?? []) : [];
      assert.ok(include.length <= 6);
      for (const k of include) assert.ok(DOCK_KEYS.includes(k), `${t.template_id} dock ${k}`);
    }
  });
});

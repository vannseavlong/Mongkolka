import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import type { AddressInfo } from "node:net";
import { publicSiteTemplatesRouter } from "../src/modules/site-templates/site-templates.routes.js";
import { CoupleWebsiteController } from "../src/modules/couple-website/couple-website.controller.js";
import { isReservedSlug, generatePlaceholderSlug } from "../src/utils/slug.js";
import { CoupleWebsiteModel } from "../src/modules/couple-website/couple-website.model.js";
import { CoupleWebsiteService } from "../src/modules/couple-website/couple-website.service.js";
import { SiteTemplatesModel } from "../src/modules/site-templates/site-templates.model.js";
import {
  SiteTemplateInputError,
  SiteTemplatesService,
} from "../src/modules/site-templates/site-templates.service.js";

type Row = Record<string, unknown>;
const m = CoupleWebsiteModel as unknown as Record<string, unknown>;
const t = SiteTemplatesModel as unknown as Record<string, unknown>;

let templates: Row[];
let couples: Row[];
let profile: Row | null;
let sections: Row[];
let profileWrites: Row[];
let sectionWrites: { id: string; data: Row }[];
let created: Row[];
let findManyCalls = 0;

beforeEach(() => {
  SiteTemplatesService.invalidatePublicCache();
  templates = [
    { template_id: "a", slug: "green-blue-sky", status: "active", name: "A" },
    { template_id: "b", slug: "old-rose", status: "inactive", name: "B" },
  ];
  couples = [{ couple_id: "c1", slug: "vutha-nita" }];
  profile = { profile_id: "p1", site_template_id: "old", theme_override: { accent_color: "#000" } };
  sections = [
    {
      section_id: "s1",
      section_key: "hero",
      component_id: "hero_x",
      color_override: { a: 1 },
      content: { t: 1 },
    },
    {
      section_id: "s2",
      section_key: "story",
      component_id: null,
      color_override: null,
      content: { t: 2 },
    },
    { section_id: "s3", section_key: "gallery", component_id: "", color_override: "", content: "" },
  ];
  profileWrites = [];
  sectionWrites = [];
  created = [];

  findManyCalls = 0;
  t.findMany = async (where?: Row) =>
    (findManyCalls++, templates).filter(
      (r) => !where || Object.entries(where).every(([k, v]) => r[k] === v),
    );
  t.findBySlug = async (slug: string) => templates.find((r) => r.slug === slug) ?? null;
  t.findById = async (id: string) => templates.find((r) => r.template_id === id) ?? null;
  t.findCoupleBySlug = async (slug: string) => couples.find((r) => r.slug === slug) ?? null;
  t.create = async (data: Row) => {
    created.push(data);
    return data;
  };
  t.update = async () => 1;

  m.findTemplateById = async (id: string) => templates.find((r) => r.template_id === id) ?? null;
  m.findProfile = async () => profile;
  m.findSections = async () => sections;
  m.updateProfile = async (_a: string, _id: string, data: Row) => {
    profileWrites.push(data);
  };
  m.createProfile = async (_a: string, data: Row) => {
    profileWrites.push(data);
  };
  m.updateSection = async (_a: string, id: string, data: Row) => {
    sectionWrites.push({ id, data });
  };
  m.createSections = async () => undefined;
  m.updateSlug = async () => 1;
  m.findCoupleById = async (id: string) => couples.find((r) => r.couple_id === id) ?? null;
});

describe("template by-slug lookup", () => {
  it("returns an active template", async () => {
    const row = await SiteTemplatesService.getPublicBySlug("Green-Blue-Sky");
    assert.equal(row?.template_id, "a");
  });
  it("returns null for unknown, inactive and malformed slugs", async () => {
    assert.equal(await SiteTemplatesService.getPublicBySlug("nope-nope"), null);
    assert.equal(await SiteTemplatesService.getPublicBySlug("old-rose"), null);
    assert.equal(await SiteTemplatesService.getPublicBySlug("../x"), null);
  });
});

describe("template slug rules", () => {
  const input = { template_id: "n", name: "N", default_theme: {}, default_components: {} };
  it("creates with a valid free slug (normalised)", async () => {
    await SiteTemplatesService.create({ ...input, slug: " Teal-Gold " });
    assert.equal(created[0]?.slug, "teal-gold");
    assert.equal(created[0]?.status, "active");
  });
  it("rejects invalid format", async () => {
    await assert.rejects(SiteTemplatesService.create({ ...input, slug: "A_b" }), (e) => {
      return e instanceof SiteTemplateInputError && e.status === 400;
    });
  });
  it("rejects a slug used by another template", async () => {
    await assert.rejects(SiteTemplatesService.create({ ...input, slug: "old-rose" }), (e) => {
      return e instanceof SiteTemplateInputError && e.status === 409;
    });
  });
  it("rejects a slug already used by a couple", async () => {
    await assert.rejects(SiteTemplatesService.create({ ...input, slug: "vutha-nita" }), (e) => {
      return e instanceof SiteTemplateInputError && e.status === 409;
    });
  });
  it("allows re-saving a template with its own slug", async () => {
    await SiteTemplatesService.update("a", { slug: "green-blue-sky" });
  });
});

describe("couple updateSlug reserves template slugs", () => {
  it("rejects a template slug (any status), case-insensitively", async () => {
    await assert.rejects(CoupleWebsiteService.updateSlug("c1", "Green-Blue-Sky"), /reserved/);
    await assert.rejects(CoupleWebsiteService.updateSlug("c1", "old-rose"), /reserved/);
  });
  it("accepts a normal slug", async () => {
    const couple = await CoupleWebsiteService.updateSlug("c1", "new-couple");
    assert.equal(couple?.couple_id, "c1");
  });
});

describe("selectTemplate apply modes", () => {
  it("keep_content clears component/color/theme overrides but not content", async () => {
    await CoupleWebsiteService.selectTemplate("sheet", "a", "keep_content");
    assert.deepEqual(profileWrites, [{ site_template_id: "a", theme_override: null }]);
    assert.deepEqual(sectionWrites, [
      { id: "s1", data: { component_id: null, color_override: null } },
    ]);
  });
  it("defaults to keep_content", async () => {
    await CoupleWebsiteService.selectTemplate("sheet", "a");
    assert.ok(sectionWrites.every((w) => !("content" in w.data)));
  });
  it("reset_all also clears content, skipping already-clean rows", async () => {
    await CoupleWebsiteService.selectTemplate("sheet", "a", "reset_all");
    assert.deepEqual(sectionWrites, [
      { id: "s1", data: { component_id: null, color_override: null, content: null } },
      { id: "s2", data: { content: null } },
    ]);
  });
  it("rejects unknown and inactive templates without writing", async () => {
    await assert.rejects(CoupleWebsiteService.selectTemplate("sheet", "zzz"), /isn't available/);
    await assert.rejects(CoupleWebsiteService.selectTemplate("sheet", "b"), /isn't available/);
    assert.equal(profileWrites.length, 0);
    assert.equal(sectionWrites.length, 0);
  });
  it("bootstraps a profile when none exists", async () => {
    profile = null;
    sections = [];
    await CoupleWebsiteService.selectTemplate("sheet", "a", "reset_all");
    assert.equal(profileWrites[0]?.site_template_id, "a");
    assert.equal(sectionWrites.length, 0);
  });
});

describe("GET /site-templates/by-slug/:slug (http)", () => {
  async function get(path: string) {
    const app = express();
    app.use("/public/api", publicSiteTemplatesRouter);
    const server = app.listen(0);
    try {
      const { port } = server.address() as AddressInfo;
      const res = await fetch(`http://127.0.0.1:${port}/public/api${path}`);
      return { status: res.status, body: (await res.json()) as Row };
    } finally {
      server.close();
    }
  }
  it("200 with { template } for an active slug", async () => {
    const r = await get("/site-templates/by-slug/green-blue-sky");
    assert.equal(r.status, 200);
    assert.equal((r.body.template as Row).template_id, "a");
  });
  it("404 for unknown and inactive", async () => {
    assert.equal((await get("/site-templates/by-slug/missing-one")).status, 404);
    assert.equal((await get("/site-templates/by-slug/old-rose")).status, 404);
  });
});

describe("public by-slug hardening", () => {
  it("returns only the allowlisted fields", async () => {
    templates[0] = {
      ...templates[0],
      _id: "x",
      _created_at: "t",
      description: "d",
      default_theme: {},
    };
    const row = await SiteTemplatesService.getPublicBySlug("green-blue-sky");
    assert.deepEqual(Object.keys(row ?? {}).sort(), [
      "default_components",
      "default_sections",
      "default_theme",
      "description",
      "name",
      "slug",
      "template_id",
    ]);
  });
  it("junk slugs never add cache keys: one catalog read serves all lookups", async () => {
    findManyCalls = 0;
    for (let i = 0; i < 20; i++) await SiteTemplatesService.getPublicBySlug(`junk-${i}`);
    await SiteTemplatesService.getPublicBySlug("green-blue-sky");
    assert.equal(findManyCalls, 1);
  });
  it("an update invalidates the cache so a deactivated template stops resolving", async () => {
    assert.ok(await SiteTemplatesService.getPublicBySlug("green-blue-sky"));
    templates[0] = { ...templates[0], status: "inactive" };
    await SiteTemplatesService.update("a", { status: "inactive" });
    assert.equal(await SiteTemplatesService.getPublicBySlug("green-blue-sky"), null);
  });
});

describe("reserved words", () => {
  it("recognises reserved words", () => {
    for (const w of ["www", "api", "admin", "couple", "cdn"]) assert.ok(isReservedSlug(w));
    assert.equal(isReservedSlug("vutha-nita"), false);
  });
  it("couple updateSlug rejects them", async () => {
    await assert.rejects(CoupleWebsiteService.updateSlug("c1", "admin"), /reserved/);
  });
  it("template slug check rejects them", async () => {
    await assert.rejects(
      SiteTemplatesService.create({
        template_id: "n",
        name: "N",
        slug: "www",
        default_theme: {},
        default_components: {},
      }),
      (e) => e instanceof SiteTemplateInputError && e.status === 400,
    );
  });
  it("placeholder slugs are never reserved", () => {
    assert.equal(isReservedSlug(generatePlaceholderSlug()), false);
  });
});

describe("apply partial failure", () => {
  it("does not touch the profile and rethrows when a section clear fails", async () => {
    m.updateSection = async (_a: string, id: string) => {
      if (id === "s2") throw new Error("sheets down");
      sectionWrites.push({ id, data: {} });
    };
    await assert.rejects(
      CoupleWebsiteService.selectTemplate("sheet", "a", "reset_all"),
      /sheets down/,
    );
    assert.equal(profileWrites.length, 0);
    assert.ok(
      sectionWrites.some((w) => w.id === "s1"),
      "other writes were allowed to settle",
    );
  });
});

describe("POST /website/template (http)", () => {
  async function post(body: Row) {
    const app = express();
    app.use(express.json());
    app.post("/t", (req, res, next) => {
      Object.assign(req, { coupleId: "c1", coupleActorSheetId: "sheet" });
      CoupleWebsiteController.selectTemplate(req as never, res).catch(next);
    });
    const server = app.listen(0);
    try {
      const { port } = server.address() as AddressInfo;
      const res = await fetch(`http://127.0.0.1:${port}/t`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      return { status: res.status, body: (await res.json()) as Row };
    } finally {
      server.close();
    }
  }
  it("404 for an unknown template", async () => {
    const r = await post({ template_id: "zzz" });
    assert.equal(r.status, 404);
    assert.equal(profileWrites.length, 0);
  });
  it("400 for a bad mode", async () => {
    assert.equal((await post({ template_id: "a", mode: "wipe" })).status, 400);
  });
  it("200 echoes the mode", async () => {
    m.findCoupleById = async () => ({ slug: "s", website_status: "draft" });
    const r = await post({ template_id: "a", mode: "reset_all" });
    assert.equal(r.status, 200);
    assert.equal(r.body.mode, "reset_all");
  });
});

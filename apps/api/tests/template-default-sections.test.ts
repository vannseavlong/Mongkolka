import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import type { AddressInfo } from "node:net";
import { CoupleWebsiteModel } from "../src/modules/couple-website/couple-website.model.js";
import { CoupleWebsiteService } from "../src/modules/couple-website/couple-website.service.js";
import { SiteTemplatesController } from "../src/modules/site-templates/site-templates.controller.js";
import { SiteTemplatesModel } from "../src/modules/site-templates/site-templates.model.js";
import {
  SiteTemplateInputError,
  SiteTemplatesService,
} from "../src/modules/site-templates/site-templates.service.js";
import { PublicSiteCache } from "../src/modules/public-site/public-site.cache.js";
import { SECTION_KEYS, parseDefaultSections } from "../src/utils/section-keys.js";

type Row = Record<string, unknown>;
const m = CoupleWebsiteModel as unknown as Record<string, unknown>;
const t = SiteTemplatesModel as unknown as Record<string, unknown>;

const DEFAULTS = [
  { section_key: "hero", enabled: true },
  { section_key: "verse", enabled: true },
  { section_key: "story", enabled: false },
  { section_key: "rsvp", enabled: true },
];
// hero, verse, story, rsvp, then the rest disabled in SECTION_KEYS order
const FULL_ORDER = [
  "hero",
  "verse",
  "story",
  "rsvp",
  ...SECTION_KEYS.filter((k) => !["hero", "verse", "story", "rsvp"].includes(k)),
];

let templates: Row[];
let sections: Row[];
let profileWrites: Row[];
let sectionWrites: { id: string; data: Row }[];
let createdSections: Row[][];
let createdTemplates: Row[];
let updatedTemplates: Row[];
let invalidated: string[];

beforeEach(() => {
  templates = [
    {
      template_id: "grace",
      slug: "grace",
      status: "active",
      default_sections: DEFAULTS,
    },
    {
      template_id: "plain",
      slug: "plain",
      status: "active",
      default_sections: null,
    },
  ];
  sections = [];
  profileWrites = [];
  sectionWrites = [];
  createdSections = [];
  createdTemplates = [];
  updatedTemplates = [];
  invalidated = [];
  PublicSiteCache.invalidateActorSheet = ((id: string) => {
    invalidated.push(id);
  }) as never;
  SiteTemplatesService.invalidatePublicCache();

  t.findMany = async () => templates;
  t.findBySlug = async () => null;
  t.findCoupleBySlug = async () => null;
  t.findById = async (id: string) => templates.find((r) => r.template_id === id) ?? null;
  t.create = async (data: Row) => {
    createdTemplates.push(data);
    return data;
  };
  t.update = async (_id: string, data: Row) => {
    updatedTemplates.push(data);
    return 1;
  };

  m.findTemplateById = async (id: string) => templates.find((r) => r.template_id === id) ?? null;
  m.findTemplates = async () => templates;
  m.findComponents = async () => [];
  m.findProfile = async () => ({ profile_id: "p1" });
  m.findSections = async () => sections;
  m.updateProfile = async (_a: string, _id: string, data: Row) => {
    profileWrites.push(data);
  };
  m.createProfile = m.updateProfile;
  m.updateSection = async (_a: string, id: string, data: Row) => {
    sectionWrites.push({ id, data });
  };
  m.createSections = async (_a: string, rows: Row[]) => {
    createdSections.push(rows);
  };
});

const keys = (rows: Row[]) => rows.map((r) => r.section_key);

describe("first pick with default_sections", () => {
  it("creates rows in template order with its flags; missing keys disabled at the end", async () => {
    await CoupleWebsiteService.selectTemplate("sheet", "grace");
    const rows = createdSections[0]!;
    assert.deepEqual(keys(rows), FULL_ORDER);
    assert.deepEqual(
      rows.map((r) => r.display_order),
      FULL_ORDER.map((_, i) => i),
    );
    assert.deepEqual(
      rows.map((r) => r.enabled),
      FULL_ORDER.map((k) => ["hero", "verse", "rsvp"].includes(k)),
    );
    assert.equal(new Set(rows.map((r) => r.section_id)).size, rows.length);
  });
  it("ignores unknown keys stored in the sheet", async () => {
    templates[0]!.default_sections = [{ section_key: "bogus", enabled: true }, ...DEFAULTS];
    await CoupleWebsiteService.selectTemplate("sheet", "grace");
    assert.deepEqual(keys(createdSections[0]!), FULL_ORDER);
  });
  it("accepts a JSON string value from the sheet", async () => {
    templates[0]!.default_sections = JSON.stringify(DEFAULTS);
    await CoupleWebsiteService.selectTemplate("sheet", "grace");
    assert.deepEqual(keys(createdSections[0]!), FULL_ORDER);
  });
  it("a list with only unknown keys behaves like null", async () => {
    templates[0]!.default_sections = [{ section_key: "bogus", enabled: false }];
    await CoupleWebsiteService.selectTemplate("sheet", "grace");
    assert.deepEqual(keys(createdSections[0]!), [...SECTION_KEYS]);
    assert.ok(createdSections[0]!.every((r) => r.enabled === true));
  });
});

describe("null default_sections keeps today's behavior", () => {
  it("first pick: SECTION_KEYS order, all enabled", async () => {
    await CoupleWebsiteService.selectTemplate("sheet", "plain");
    const rows = createdSections[0]!;
    assert.deepEqual(keys(rows), [...SECTION_KEYS]);
    assert.ok(rows.every((r) => r.enabled === true));
    assert.deepEqual(
      rows.map((r) => r.display_order),
      SECTION_KEYS.map((_, i) => i),
    );
  });
  it("reset_all leaves order and enabled alone; appends missing keys enabled", async () => {
    sections = [
      {
        section_id: "s1",
        section_key: "story",
        display_order: 5,
        enabled: false,
      },
    ];
    await CoupleWebsiteService.selectTemplate("sheet", "plain", "reset_all");
    assert.deepEqual(sectionWrites, []);
    const rows = createdSections[0]!;
    assert.equal(rows.length, SECTION_KEYS.length - 1);
    assert.equal(rows[0]!.display_order, 1);
    assert.ok(rows.every((r) => r.enabled === true));
  });
});

describe("existing sections", () => {
  beforeEach(() => {
    sections = SECTION_KEYS.map((key, i) => ({
      section_id: `id-${key}`,
      section_key: key,
      display_order: i,
      enabled: true,
    }));
  });
  it("reset_all resets order and enabled from the template (omitted keys disabled at the end)", async () => {
    await CoupleWebsiteService.selectTemplate("sheet", "grace", "reset_all");
    const byId = new Map(sectionWrites.map((w) => [w.id, w.data]));
    FULL_ORDER.forEach((key, index) => {
      const enabled = ["hero", "verse", "rsvp"].includes(key);
      const original = SECTION_KEYS.indexOf(key as (typeof SECTION_KEYS)[number]);
      const expected: Row = {};
      if (original !== index) expected.display_order = index;
      if (!enabled) expected.enabled = false;
      assert.deepEqual(byId.get(`id-${key}`) ?? {}, expected, key);
    });
    assert.equal(createdSections.length, 0);
    assert.deepEqual(profileWrites, [{ site_template_id: "grace", theme_override: null }]);
  });
  it("reset_all creates rows missing from the couple at the template position", async () => {
    sections = sections.filter((s) => s.section_key !== "verse");
    await CoupleWebsiteService.selectTemplate("sheet", "grace", "reset_all");
    assert.deepEqual(keys(createdSections[0]!), ["verse"]);
    assert.equal(createdSections[0]![0]!.display_order, 1);
    assert.equal(createdSections[0]![0]!.enabled, true);
  });
  it("keep_content does not touch order or enabled", async () => {
    await CoupleWebsiteService.selectTemplate("sheet", "grace", "keep_content");
    assert.deepEqual(sectionWrites, []);
    assert.equal(createdSections.length, 0);
  });
  it("keep_content appends a missing key disabled at the end (never reorders)", async () => {
    sections = sections.filter((s) => s.section_key !== "verse");
    await CoupleWebsiteService.selectTemplate("sheet", "grace");
    assert.deepEqual(sectionWrites, []);
    assert.equal(createdSections[0]![0]!.section_key, "verse");
    assert.equal(createdSections[0]![0]!.enabled, false);
    assert.equal(createdSections[0]![0]!.display_order, SECTION_KEYS.length - 1);
  });
  it("reset_all skips rows that already match", async () => {
    sections = FULL_ORDER.map((key, i) => ({
      section_id: `id-${key}`,
      section_key: key,
      display_order: i,
      enabled: ["hero", "verse", "rsvp"].includes(key),
    }));
    await CoupleWebsiteService.selectTemplate("sheet", "grace", "reset_all");
    assert.deepEqual(sectionWrites, []);
  });
});

describe("partial failure and cache", () => {
  it("a failed section write leaves the profile on the previous template", async () => {
    sections = SECTION_KEYS.map((key, i) => ({
      section_id: `id-${key}`,
      section_key: key,
      display_order: i,
      enabled: true,
    }));
    m.updateSection = async (_a: string, id: string) => {
      if (id === "id-story") throw new Error("sheets down");
    };
    await assert.rejects(
      CoupleWebsiteService.selectTemplate("sheet", "grace", "reset_all"),
      /sheets down/,
    );
    assert.equal(profileWrites.length, 0);
    assert.equal(createdSections.length, 0);
    assert.deepEqual(invalidated, ["sheet"], "cache still invalidated after a failure");
  });
  it("invalidates the couple's public cache on success", async () => {
    await CoupleWebsiteService.selectTemplate("sheet", "grace");
    assert.deepEqual(invalidated, ["sheet"]);
  });
  it("template writes invalidate the public catalog cache", async () => {
    templates[0]!.status = "active";
    assert.ok(await SiteTemplatesService.getPublicBySlug("grace"));
    templates[0]!.status = "inactive";
    await SiteTemplatesService.update("grace", { default_sections: DEFAULTS });
    assert.equal(await SiteTemplatesService.getPublicBySlug("grace"), null);
  });
});

describe("admin validation", () => {
  const base = {
    template_id: "n",
    name: "N",
    slug: "new-one",
    default_theme: {},
    default_components: {},
  };
  const bad = (e: unknown) => e instanceof SiteTemplateInputError && e.status === 400;

  it("create stores a valid list", async () => {
    await SiteTemplatesService.create({ ...base, default_sections: DEFAULTS });
    assert.deepEqual(createdTemplates[0]!.default_sections, DEFAULTS);
  });
  it("create without it stores null", async () => {
    await SiteTemplatesService.create(base);
    assert.equal(createdTemplates[0]!.default_sections, null);
  });
  it("empty array is stored as null (create and update)", async () => {
    await SiteTemplatesService.create({ ...base, default_sections: [] });
    assert.equal(createdTemplates[0]!.default_sections, null);
    await SiteTemplatesService.update("grace", { default_sections: [] });
    assert.equal(updatedTemplates[0]!.default_sections, null);
  });
  it("update with null clears; omitted leaves it out of the write", async () => {
    await SiteTemplatesService.update("grace", { default_sections: null });
    assert.equal(updatedTemplates[0]!.default_sections, null);
    await SiteTemplatesService.update("grace", { name: "x" });
    assert.ok(!("default_sections" in updatedTemplates[1]!));
  });
  for (const [label, value] of [
    ["non-array", { section_key: "hero", enabled: true }],
    ["string", "hero"],
    ["non-object item", ["hero"]],
    ["null item", [null]],
    ["unknown key", [{ section_key: "bogus", enabled: true }]],
    ["missing key", [{ enabled: true }]],
    ["non-boolean enabled", [{ section_key: "hero", enabled: "yes" }]],
    ["missing enabled", [{ section_key: "hero" }]],
    [
      "duplicate key",
      [
        { section_key: "hero", enabled: true },
        { section_key: "hero", enabled: false },
      ],
    ],
  ] as [string, unknown][]) {
    it(`rejects ${label} with 400 and writes nothing`, async () => {
      await assert.rejects(SiteTemplatesService.create({ ...base, default_sections: value }), bad);
      await assert.rejects(SiteTemplatesService.update("grace", { default_sections: value }), bad);
      assert.equal(createdTemplates.length + updatedTemplates.length, 0);
    });
  }

  it("controller maps it to a 400 over http", async () => {
    const app = express();
    app.use(express.json());
    app.patch("/t/:templateId", (req, res, next) => {
      SiteTemplatesController.update(req, res).catch(next);
    });
    const server = app.listen(0);
    try {
      const { port } = server.address() as AddressInfo;
      const res = await fetch(`http://127.0.0.1:${port}/t/grace`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ default_sections: "nope" }),
      });
      assert.equal(res.status, 400);
    } finally {
      server.close();
    }
  });
});

describe("read side", () => {
  it("public by-slug response does not expose default_sections", async () => {
    const row = await SiteTemplatesService.getPublicBySlug("grace");
    assert.ok(row);
    assert.ok(!("default_sections" in row));
  });
  it("couple catalog returns a normalised default_sections", async () => {
    templates[0]!.default_sections = [{ section_key: "bogus", enabled: true }, ...DEFAULTS];
    const { templates: out } = await CoupleWebsiteService.getCatalog();
    assert.deepEqual(out[0]!.default_sections, DEFAULTS);
    assert.equal(out[1]!.default_sections, null);
  });
  it("parseDefaultSections drops junk and repeats", () => {
    assert.equal(parseDefaultSections("{not json"), null);
    assert.equal(parseDefaultSections({}), null);
    assert.deepEqual(
      parseDefaultSections([
        { section_key: "hero", enabled: true },
        { section_key: "hero", enabled: false },
        { section_key: "story", enabled: "x" },
        null,
      ]),
      [{ section_key: "hero", enabled: true }],
    );
  });
});

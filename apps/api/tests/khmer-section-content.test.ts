import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import type { AddressInfo } from "node:net";
import {
  AGENDA_ICONS,
  LIMITS,
  validateHttpsUrl,
  validateSectionContent,
  validateStartsAt,
} from "../src/utils/section-content.js";
import { CoupleWebsiteModel } from "../src/modules/couple-website/couple-website.model.js";
import { CoupleWebsiteService, ContentValidationError } from "../src/modules/couple-website/couple-website.service.js";
import { CoupleWebsiteController } from "../src/modules/couple-website/couple-website.controller.js";
import { CoupleProfileModel } from "../src/modules/couple-profile/couple-profile.model.js";
import { CoupleProfileService, ProfileInputError } from "../src/modules/couple-profile/couple-profile.service.js";

const read = (rel: string) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");

describe("Khmer section content validation", () => {
  it("passes sections it does not own through untouched", () => {
    const content = { text: "x".repeat(5000), anything: true };
    assert.equal(validateSectionContent("verse", content), content);
    assert.equal(validateSectionContent("invitation", null), null);
  });

  it("rejects non-object content", () => {
    assert.throws(() => validateSectionContent("invitation", "nope"), /must be an object/);
    assert.throws(() => validateSectionContent("agenda", []), /must be an object/);
  });

  describe("startsAt", () => {
    it("accepts ISO with an offset or Z", () => {
      assert.equal(validateStartsAt("2026-05-29T17:00:00+07:00", "startsAt"), "2026-05-29T17:00:00+07:00");
      assert.equal(validateStartsAt("2026-05-29T10:00Z", "startsAt"), "2026-05-29T10:00Z");
      assert.equal(validateStartsAt("", "startsAt"), undefined);
    });
    it("rejects no offset, wrong shape and impossible dates", () => {
      for (const bad of ["2026-05-29T17:00:00", "2026-05-29", "tomorrow", "2026-13-40T10:00:00+07:00", 12345]) {
        assert.throws(() => validateStartsAt(bad, "startsAt"), /startsAt/, String(bad));
      }
    });
    it("is enforced through the invitation validator", () => {
      assert.throws(() => validateSectionContent("invitation", { startsAt: "2026-05-29 17:00" }), /startsAt/);
      const ok = validateSectionContent("invitation", { startsAt: "2026-05-29T17:00:00+07:00" }) as Record<string, unknown>;
      assert.equal(ok.startsAt, "2026-05-29T17:00:00+07:00");
    });
  });

  describe("https URLs", () => {
    it("accepts https and empty", () => {
      assert.equal(validateHttpsUrl(" https://maps.app.goo.gl/abc ", "map_url"), "https://maps.app.goo.gl/abc");
      assert.equal(validateHttpsUrl("", "map_url"), undefined);
      assert.equal(validateHttpsUrl(null, "map_url"), undefined);
    });
    it("rejects http, javascript:, data:, garbage, over-length", () => {
      for (const bad of ["http://x.com", "javascript:alert(1)", "data:text/html,hi", "not a url", `https://x.com/${"a".repeat(LIMITS.url)}`]) {
        assert.throws(() => validateHttpsUrl(bad, "map_url"), /map_url/, bad.slice(0, 30));
      }
      assert.throws(() => validateHttpsUrl(42, "map_url"), /string/);
    });
  });

  describe("invitation", () => {
    it("trims, drops empties and unknown keys", () => {
      const out = validateSectionContent("invitation", {
        groom: { nameEn: "  Sokha ", fatherEn: "", extra: "x" },
        bride: {},
        monogram: "S&D",
        evil: "<script>",
      });
      assert.deepEqual(out, { groom: { nameEn: "Sokha" }, monogram: "S&D" });
    });
    it("enforces length caps", () => {
      assert.throws(() => validateSectionContent("invitation", { monogram: "123456789" }), /at most 8/);
      assert.throws(() => validateSectionContent("invitation", { greetingKh: "x".repeat(LIMITS.greeting + 1) }), /greetingKh/);
      assert.throws(() => validateSectionContent("invitation", { groom: { nameKh: "x".repeat(LIMITS.name + 1) } }), /groom\.nameKh/);
      assert.throws(() => validateSectionContent("invitation", { lunarKh: 5 }), /must be a string/);
    });
  });

  describe("agenda", () => {
    const item = { time: "07:00", titleEn: "Procession", icon: "procession" };
    it("accepts a valid agenda", () => {
      const out = validateSectionContent("agenda", { days: [{ date: "2026-12-12", items: [item] }] });
      assert.deepEqual(out, { days: [{ date: "2026-12-12", items: [item] }] });
    });
    it("accepts empty days", () => {
      assert.deepEqual(validateSectionContent("agenda", {}), { days: [] });
    });
    it("rejects bad dates, icons, missing time and size limits", () => {
      assert.throws(() => validateSectionContent("agenda", { days: [{ date: "12/12/2026", items: [] }] }), /YYYY-MM-DD/);
      assert.throws(() => validateSectionContent("agenda", { days: [{ date: "2026-02-30", items: [] }] }), /real calendar date/);
      assert.throws(() => validateSectionContent("agenda", { days: [{ date: "2026-12-12", items: [{ ...item, icon: "bomb" }] }] }), /icon/);
      assert.throws(() => validateSectionContent("agenda", { days: [{ date: "2026-12-12", items: [{ titleEn: "x" }] }] }), /time is required/);
      assert.throws(
        () => validateSectionContent("agenda", { days: Array.from({ length: LIMITS.agendaDays + 1 }, () => ({ date: "2026-12-12", items: [] })) }),
        /at most 7/,
      );
      assert.throws(
        () => validateSectionContent("agenda", { days: [{ date: "2026-12-12", items: Array.from({ length: LIMITS.agendaItemsPerDay + 1 }, () => item) }] }),
        /at most 20/,
      );
      assert.throws(() => validateSectionContent("agenda", { days: "nope" }), /array/);
    });
  });

  describe("letters", () => {
    it("trims and caps", () => {
      assert.deepEqual(validateSectionContent("letters", { gratitudeEn: " Thank you ", apologyKh: "" }), { gratitudeEn: "Thank you" });
      assert.throws(() => validateSectionContent("letters", { gratitudeKh: "x".repeat(LIMITS.letter + 1) }), /at most 3000/);
    });
  });

  it("agenda icon list matches the templates package", () => {
    const src = read("../../../packages/templates/src/types.ts");
    const block = src.slice(src.indexOf("export const AGENDA_ICONS = ["));
    const list = [...block.slice(0, block.indexOf("] as const")).matchAll(/"([a-z]+)"/g)].map((m) => m[1]);
    assert.deepEqual(list, [...AGENDA_ICONS]);
  });

  it("new keys are in every key list used by the other guards", () => {
    const src = read("../../../packages/templates/src/types.ts");
    for (const key of ["invitation", "agenda", "letters"]) assert.match(src, new RegExp(`"${key}",`));
  });
});

// ---- wiring: couple-website service + controller, couple-profile service ----

type Row = Record<string, unknown>;
const wm = CoupleWebsiteModel as unknown as Record<string, unknown>;
const pm = CoupleProfileModel as unknown as Record<string, unknown>;

describe("section content wiring", () => {
  let rows: Record<string, Row>;
  let writes: { id: string; data: Row }[];
  let profileWrites: Row[];

  beforeEach(() => {
    rows = {
      s_inv: { section_id: "s_inv", section_key: "invitation", content: null },
      s_verse: { section_id: "s_verse", section_key: "verse", content: null },
    };
    writes = [];
    profileWrites = [];
    wm.findSectionById = async (_a: string, id: string) => rows[id] ?? null;
    wm.updateSection = async (_a: string, id: string, data: Row) => {
      writes.push({ id, data });
    };
    pm.findCatalogById = async () => ({});
    pm.findOwnProfile = async () => ({ profile_id: "p1" });
    pm.updateOwnProfile = async (_a: string, _id: string, data: Row) => {
      profileWrites.push(data);
    };
  });

  it("stores the cleaned content for a Khmer section", async () => {
    await CoupleWebsiteService.updateSection("sheet", "s_inv", { content: { monogram: " S&D ", junk: 1 } });
    assert.deepEqual(writes, [{ id: "s_inv", data: { content: { monogram: "S&D" } } }]);
  });

  it("rejects bad content before writing anything", async () => {
    await assert.rejects(
      CoupleWebsiteService.updateSection("sheet", "s_inv", { content: { startsAt: "nope" } }),
      ContentValidationError,
    );
    assert.equal(writes.length, 0);
  });

  it("leaves other sections and non-content patches untouched", async () => {
    const big = { text: "x".repeat(4000) };
    await CoupleWebsiteService.updateSection("sheet", "s_verse", { content: big });
    await CoupleWebsiteService.updateSection("sheet", "s_inv", { enabled: false });
    assert.deepEqual(writes, [
      { id: "s_verse", data: { content: big } },
      { id: "s_inv", data: { enabled: false } },
    ]);
  });

  it("controller maps a validation error to 400 over http", async () => {
    const app = express();
    app.use(express.json());
    app.patch("/s/:sectionId", (req, res, next) => {
      Object.assign(req, { coupleActorSheetId: "sheet" });
      CoupleWebsiteController.updateSection(req as never, res).catch(next);
    });
    const server = app.listen(0);
    try {
      const { port } = server.address() as AddressInfo;
      const res = await fetch(`http://127.0.0.1:${port}/s/s_inv`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: { monogram: "123456789" } }),
      });
      assert.equal(res.status, 400);
      assert.match(((await res.json()) as { error: string }).error, /monogram/);
    } finally {
      server.close();
    }
  });

  it("profile accepts https map_url / venue_image_url, clears empties, rejects the rest", async () => {
    await CoupleProfileService.update("c1", "sheet", { map_url: " https://maps.app.goo.gl/x ", venue_image_url: "" });
    assert.deepEqual(profileWrites[0], { map_url: "https://maps.app.goo.gl/x", venue_image_url: null });
    await assert.rejects(CoupleProfileService.update("c1", "sheet", { map_url: "http://x.com" }), ProfileInputError);
    await assert.rejects(
      CoupleProfileService.update("c1", "sheet", { venue_image_url: "javascript:alert(1)" }),
      ProfileInputError,
    );
    assert.equal(profileWrites.length, 1);
  });
});

describe("Registry gift content validation", () => {
  const ok = { khqrImageUrl: " https://cdn.test/qr.png ", bank: " ABA ", accountName: " Sun Chantha ", accountNumber: " 000 123-456 " };

  it("trims, keeps links untouched and drops unknown keys", () => {
    const links = [{ label: "Shop", url: "https://shop.test" }];
    assert.deepEqual(validateSectionContent("registry", { ...ok, links, extra: 1 }), {
      links,
      khqrImageUrl: "https://cdn.test/qr.png",
      bank: "ABA",
      accountName: "Sun Chantha",
      accountNumber: "000 123-456",
    });
  });

  it("legacy links-only content still passes", () => {
    const links = [{ label: "A", url: "https://a.test" }];
    assert.deepEqual(validateSectionContent("registry", { links }), { links });
  });

  it("rejects non-https images and bad account numbers", () => {
    assert.throws(() => validateSectionContent("registry", { khqrImageUrl: "http://x.test/a.png" }), /https/);
    assert.throws(() => validateSectionContent("registry", { khqrImageUrl: "javascript:alert(1)" }), /khqrImageUrl/);
    assert.throws(() => validateSectionContent("registry", { khqrImageUrl: "data:image/png;base64,AA" }), /khqrImageUrl/);
    assert.throws(() => validateSectionContent("registry", { accountNumber: "12AB34" }), /digits, spaces and hyphens/);
    assert.throws(() => validateSectionContent("registry", { accountNumber: "<script>" }), /digits, spaces and hyphens/);
    assert.throws(() => validateSectionContent("registry", { accountNumber: "1".repeat(LIMITS.accountNumber + 1) }), /at most/);
  });

  it("enforces length caps and types", () => {
    assert.throws(() => validateSectionContent("registry", { bank: "x".repeat(LIMITS.bank + 1) }), /at most/);
    assert.throws(() => validateSectionContent("registry", { accountName: "x".repeat(LIMITS.accountName + 1) }), /at most/);
    assert.throws(() => validateSectionContent("registry", { bank: 5 }), /must be a string/);
    assert.throws(() => validateSectionContent("registry", "nope"), /must be an object/);
  });

  it("empty strings drop the field (clearing the gift block)", () => {
    assert.deepEqual(validateSectionContent("registry", { bank: "", accountNumber: " ", khqrImageUrl: "" }), {});
  });
});

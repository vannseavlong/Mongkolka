import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultTabId } from "./panel-defaults";
import {
  isProfileSection,
  profileSectionErrors,
  profileSectionPayload,
  profileSectionValues,
} from "./profile-section-fields";
import type { PreviewProfile } from "./build-content";

const profile = {
  partner1_name: "Sok",
  partner2_name: null,
  wedding_date: "2027-01-10",
  love_story: null,
  cover_photo_url: null,
  ceremony_time: "9:00",
  ceremony_venue: null,
  ceremony_address: null,
  reception_time: null,
  reception_venue: null,
  reception_address: null,
  dress_code: null,
} as PreviewProfile;

describe("profile section fields", () => {
  it("knows which sections live in the profile", () => {
    assert.equal(isProfileSection("hero"), true);
    assert.equal(isProfileSection("details"), true);
    assert.equal(isProfileSection("gallery"), false);
    assert.equal(isProfileSection("opening"), false);
  });

  it("turns null and missing fields into empty strings", () => {
    const v = profileSectionValues("hero", profile);
    assert.deepEqual(v, { partner1_name: "Sok", partner2_name: "", wedding_date: "2027-01-10" });
    assert.equal(profileSectionValues("details", profile).map_url, "");
  });

  it("allows empty URLs, rejects non-https ones", () => {
    assert.deepEqual(profileSectionErrors("details", { map_url: "", venue_image_url: "  " }), {});
    assert.deepEqual(profileSectionErrors("details", { map_url: "http://x.com", venue_image_url: "javascript:alert(1)" }), {
      map_url: "Must start with https://",
      venue_image_url: "Must start with https://",
    });
    assert.deepEqual(profileSectionErrors("details", { map_url: "HTTPS://maps.app.goo.gl/x" }), {});
  });

  it("sends only the section's fields, trimmed, empty as null", () => {
    assert.deepEqual(profileSectionPayload("hero", { partner1_name: " Sok ", partner2_name: "", wedding_date: "2027-01-10", cover_photo_url: "x" }), {
      partner1_name: "Sok",
      partner2_name: null,
      wedding_date: "2027-01-10",
    });
  });
});

describe("defaultTabId", () => {
  it("prefers content, else the first tab, else undefined", () => {
    assert.equal(defaultTabId(["style", "content", "assets"]), "content");
    assert.equal(defaultTabId(["style", "assets"]), "style");
    assert.equal(defaultTabId([]), undefined);
  });
});

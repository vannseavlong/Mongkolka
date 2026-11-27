import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CoupleProfile } from "../data/schema";
import { profileFormSchema, toFormValues, toPayload } from "./profile-form";

const profile: CoupleProfile = {
  couple_id: "c1",
  partner1_name: "Sok",
  partner1_email: "sok@example.com",
  partner2_name: "Dara",
  partner2_email: null,
  slug: "sok-dara",
  wedding_date: "2027-01-10",
  status: "active",
  website_status: "draft",
  love_story: null,
  cover_photo_url: "http://localhost:4000/uploads/couples/c1/assets/a.jpg",
  ceremony_time: null,
  ceremony_venue: null,
  ceremony_address: null,
  reception_time: null,
  reception_venue: null,
  reception_address: null,
  dress_code: null,
};

describe("toFormValues", () => {
  it("turns optional columns the API leaves out into null", () => {
    const values = toFormValues(profile);
    assert.equal(values.venue_image_url, null);
    assert.equal(values.map_url, null);
  });
  it("does not carry fields the form does not edit", () => {
    assert.deepEqual(Object.keys(toFormValues(profile)).sort(), Object.keys(profileFormSchema.shape).sort());
  });
});

describe("profileFormSchema", () => {
  it("still requires https for the map link", () => {
    const base = toFormValues(profile);
    assert.equal(profileFormSchema.safeParse({ ...base, map_url: "http://maps.example.com" }).success, false);
    assert.ok(profileFormSchema.safeParse({ ...base, map_url: "https://maps.app.goo.gl/x" }).success);
    assert.ok(profileFormSchema.safeParse({ ...base, map_url: "" }).success);
  });
});

describe("toPayload", () => {
  it("sends a removed photo as an empty string so the API clears it", () => {
    const out = toPayload({ ...toFormValues(profile), cover_photo_url: null, venue_image_url: null });
    assert.equal(out.cover_photo_url, "");
    assert.equal(out.venue_image_url, "");
  });
  it("re-sends an unchanged photo URL exactly as the API gave it", () => {
    assert.equal(toPayload(toFormValues(profile)).cover_photo_url, profile.cover_photo_url);
  });
  it("leaves every other field alone, including empty ones", () => {
    const values = { ...toFormValues(profile), dress_code: "" };
    const out = toPayload(values);
    assert.equal(out.dress_code, "");
    assert.equal(out.partner1_name, "Sok");
    assert.equal(out.map_url, null);
  });
});

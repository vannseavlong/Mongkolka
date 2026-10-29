import type { CoupleInfo, GuestbookActions, GuestbookData, GuestbookResult, SectionKey } from "./types";

/**
 * Placeholder couple + section content for places that show a template without
 * a real couple's data (public template previews, and the builder's variant
 * browser when a couple has not filled a section in yet). Never use this on a
 * couple's published site.
 */
export const SAMPLE_COUPLE: CoupleInfo = {
  partner1Name: "Alex",
  partner2Name: "Sam",
  weddingDate: "2026-12-12",
};

export const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=60",
];

export const SAMPLE_CONTENT: Partial<Record<SectionKey, unknown>> = {
  hero: { coverPhotoUrl: SAMPLE_PHOTOS[0] },
  verse: {
    text: "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.",
    reference: "Genesis 2:24",
  },
  footer: { message: "Thank you for celebrating with us.", hashtag: "#AlexAndSam" },
  story: {
    loveStory:
      "We met on a rainy afternoon and haven't stopped talking since. This is where our story becomes yours to celebrate with us.",
  },
  gallery: { photos: SAMPLE_PHOTOS },
  details: {
    ceremonyTime: "4:00 PM",
    ceremonyVenue: "Riverside Garden",
    ceremonyAddress: "123 Riverside Ave, Phnom Penh",
    receptionTime: "6:30 PM",
    receptionVenue: "The Grand Hall",
    receptionAddress: "456 Grand Blvd, Phnom Penh",
    dressCode: "Formal — soft pastels welcome",
  },
  rsvp: { customMessage: "We can't wait to celebrate with you!", deadline: "2026-11-01" },
  registry: {
    links: [{ label: "Our registry", url: "#" }],
  },
  timeline: {
    chapters: [
      { year: "2021", title: "How We Met", text: "A chance encounter at a friend's birthday party." },
      { year: "2025", title: "The Proposal", text: "A sunset walk on the beach, and a question." },
      { year: "2026", title: "Looking Forward", text: "Our next chapter begins on our wedding day." },
    ],
  },
};

/** A sample guest wall (6 photos, 4 wishes) so the preview shows what a guestbook looks like. Not real guests. */
export const SAMPLE_GUESTBOOK: GuestbookData = {
  photos: [0, 1, 2, 3, 4, 5].map((i) => ({
    photo_id: `sample-photo-${i}`,
    url: SAMPLE_PHOTOS[i % SAMPLE_PHOTOS.length]!,
    uploader_name: ["Dara", "Mey", "Vireak", "Sophea", "Chantha", "Rith"][i] ?? null,
  })),
  wishes: [
    { wish_id: "sample-wish-1", name: "Dara", message: "Wishing you a lifetime of love and laughter. We are so happy for you both!", photo_id: "sample-photo-0" },
    { wish_id: "sample-wish-2", name: "Mey & Vireak", message: "May God bless your marriage with joy and peace.", photo_id: null },
    { wish_id: "sample-wish-3", name: "Sophea", message: "Congratulations! Can't wait to celebrate with you.", photo_id: "sample-photo-3" },
    { wish_id: "sample-wish-4", name: "Chantha", message: "Two beautiful hearts, one beautiful story.", photo_id: null },
  ],
};

export const SAMPLE_GUESTBOOK_ACTIONS: GuestbookActions = {
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Riverside%20Garden%20Phnom%20Penh",
  calendar: { title: "Alex & Sam's wedding", start: "2026-12-12T16:00:00", location: "Riverside Garden, Phnom Penh" },
};

/** Preview-only submit handler for the guestbook: resolves as if the couple must approve first. */
export async function sampleGuestbookSubmit(): Promise<GuestbookResult> {
  return { status: "pending" };
}

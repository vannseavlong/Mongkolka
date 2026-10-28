import type { CoupleInfo, SectionKey } from "./types";

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

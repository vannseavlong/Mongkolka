import type { SkinId } from "./sections/skins";
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

/** Preview couple for the Covenant template: names exactly as the client wants them in each language. */
export const COVENANT_SAMPLE_COUPLE: CoupleInfo = {
  partner1Name: "Vutha",
  partner2Name: "Nita",
  partner1NameKh: "វុត្ថា",
  partner2NameKh: "នីតា",
  weddingDate: "2027-01-07",
};

export function sampleCoupleFor(skin: SkinId | null | undefined): CoupleInfo {
  return skin === "covenant" ? COVENANT_SAMPLE_COUPLE : SAMPLE_COUPLE;
}

export const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=60",
];

/** Placeholder pattern (NOT a scannable code, not a real account) so the preview shows the gift card. */
const SAMPLE_KHQR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" shape-rendering="crispEdges"><rect width="21" height="21" fill="#fff"/><g fill="#222"><path d="M1 1h7v7H1zM13 1h7v7h-7zM1 13h7v7H1z"/></g><g fill="#fff"><path d="M2 2h5v5H2zM14 2h5v5h-5zM2 14h5v5H2z"/></g><g fill="#222"><path d="M3 3h3v3H3zM15 3h3v3h-3zM3 15h3v3H3zM10 1h2v2h-2zM9 4h2v2H9zM10 9h2v2h-2zM13 10h2v2h-2zM16 9h4v2h-4zM12 13h2v3h-2zM15 14h2v2h-2zM18 13h2v3h-2zM10 17h4v2h-4zM16 18h4v2h-4zM9 12h2v2H9z"/></g></svg>',
  );

export const SAMPLE_CONTENT: Partial<Record<SectionKey, unknown>> = {
  hero: { coverPhotoUrl: SAMPLE_PHOTOS[0] },
  verse: {
    text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
    reference: "1 Corinthians 13:4–8",
    meaning: "True love is patient, kind, and enduring.",
  },
  invitation: {
    groom: { nameKh: "សុខា", nameEn: "Sokha", fatherKh: "លោក សុខ វិសាល", fatherEn: "Mr. Sok Visal", motherKh: "លោកស្រី ចាន់ ស្រីមុំ", motherEn: "Mrs. Chan Sreymom" },
    bride: { nameKh: "ដារ៉ា", nameEn: "Dara", fatherKh: "លោក គង់ វណ្ណា", fatherEn: "Mr. Kong Vanna", motherKh: "លោកស្រី ហេង សុភា", motherEn: "Mrs. Heng Sopha" },
    monogram: "S&D",
    lunarKh: "ថ្ងៃសុក្រ ១៥កើត ខែពិសាខ ឆ្នាំម្សាញ់ សប្តស័ក ព.ស. ២៥៧០",
    solarKh: "ត្រូវនឹងថ្ងៃទី២៩ ខែឧសភា ឆ្នាំ២០២៦",
    startsAt: "2026-12-12T17:00:00+07:00",
    greetingEn: "Together with their families, request the honour of your presence at the wedding of their children.",
  },
  agenda: {
    days: [
      {
        date: "2026-12-12",
        items: [
          { time: "07:00", titleKh: "ពិធីហែជំនូន", titleEn: "Procession", icon: "procession" },
          { time: "09:00", titleKh: "ពិធីកាត់សក់បង្កក់សិរី", titleEn: "Hair-cutting", icon: "scissors" },
          { time: "11:00", titleKh: "ពិធីសែនចងដៃ", titleEn: "Wrist-tying blessing", icon: "thread" },
          { time: "17:00", titleKh: "ពិធីជប់លៀង", titleEn: "Reception", icon: "dinner" },
        ],
      },
    ],
  },
  letters: {
    gratitudeEn: "With heartfelt gratitude, we thank everyone who joined us and shared this day.",
    apologyEn: "We apologise if a printed invitation did not reach you; please accept this one with our warmest welcome.",
  },
  footer: { message: "Thank you for celebrating with us.", hashtag: "#AlexAndSam" },
  story: {
    loveStory:
      "We met on a rainy afternoon and haven't stopped talking since. This is where our story becomes yours to celebrate with us.",
  },
  gallery: { photos: SAMPLE_PHOTOS },
  video: { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", title: "Our story in moving pictures" },
  details: {
    ceremonyTime: "4:00 PM",
    ceremonyVenue: "Riverside Garden",
    ceremonyAddress: "123 Riverside Ave, Phnom Penh",
    receptionTime: "6:30 PM",
    receptionVenue: "The Grand Hall",
    receptionAddress: "456 Grand Blvd, Phnom Penh",
    dressCode: "Formal — soft pastels welcome",
    mapUrl: "https://maps.google.com/?q=Riverside+Garden+Phnom+Penh",
  },
  rsvp: { customMessage: "We can't wait to celebrate with you!", deadline: "2026-11-01" },
  registry: {
    links: [{ label: "Our registry", url: "#" }],
    khqrImageUrl: SAMPLE_KHQR,
    bank: "ABA Bank",
    accountName: "SUN CHANTHA",
    accountNumber: "000 123 456",
  },
  timeline: {
    chapters: [
      { year: "2021", title: "How We Met", text: "A chance encounter at a friend's birthday party." },
      { year: "2025", title: "The Proposal", text: "A sunset walk on the beach, and a question." },
      { year: "2026", title: "Looking Forward", text: "Our next chapter begins on our wedding day." },
    ],
  },
};

/**
 * Sample content for a template preview, per skin. Every skin shows the wedding sample except the birthday one,
 * whose story, RSVP note and footer would otherwise read as a wedding.
 */
const KIDS_SAMPLE_OVERRIDES: Partial<Record<SectionKey, unknown>> = {
  story: {
    loveStory:
      "Our little star is turning one! Twelve months of giggles, first steps and sleepy cuddles. Come and celebrate with cake, music and lots of balloons.",
  },
  rsvp: { customMessage: "Please let us know if you can join the party!", deadline: "2026-11-01" },
  footer: { message: "Thank you for sharing our little one's big day.", hashtag: "#AlexTurnsOne" },
};

/** Covenant preview: 7 January 2027, 5:00 PM, at Sen Sok Hall (វិមានសែនសុខ). */
const COVENANT_SAMPLE_OVERRIDES: Partial<Record<SectionKey, unknown>> = {
  invitation: { ...(SAMPLE_CONTENT.invitation as object), startsAt: "2027-01-07T17:00:00+07:00", lunarKh: undefined, solarKh: "ត្រូវនឹងថ្ងៃទី០៧ ខែមករា ឆ្នាំ២០២៧" },
  details: { ...(SAMPLE_CONTENT.details as object), ceremonyTime: "5:00 PM", ceremonyVenue: "វិមានសែនសុខ", ceremonyAddress: undefined, receptionTime: undefined, receptionVenue: undefined, receptionAddress: undefined, mapUrl: "https://maps.google.com/?q=%E1%9E%9C%E1%9E%B7%E1%9E%98%E1%9E%B6%E1%9E%93%E1%9E%9F%E1%9F%82%E1%9E%93%E1%9E%9F%E1%9E%BB%E1%9E%81" },
  agenda: { days: [{ date: "2027-01-07", items: [{ time: "17:00", titleKh: "ពិធីអាពាហ៍ពិពាហ៍", titleEn: "Wedding ceremony", icon: "ring" }, { time: "18:30", titleKh: "ពិធីជប់លៀង", titleEn: "Reception dinner", icon: "dinner" }] }] },
};

export function sampleContentFor(skin: SkinId | null | undefined): Partial<Record<SectionKey, unknown>> {
  if (skin === "covenant") return { ...SAMPLE_CONTENT, ...COVENANT_SAMPLE_OVERRIDES };
  return skin === "kids" ? { ...SAMPLE_CONTENT, ...KIDS_SAMPLE_OVERRIDES } : SAMPLE_CONTENT;
}

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

/**
 * What the couple types in the Opening section: the wording (one value per language) and the event details
 * the opening and the cover show. Empty wording uses the template's built-in text; empty names, date, time and
 * venue use the profile. Mirrors OpeningContent in @mongkolka/templates and the API's cleanOpening.
 */
export const OPENING_FIELDS = ["name1Kh", "name1En", "name2Kh", "name2En", "date", "time", "venue", "blessingKh", "blessingEn", "inviteKh", "inviteEn", "titleKh", "titleEn", "openKh", "openEn"] as const;
export type OpeningField = (typeof OPENING_FIELDS)[number];
export type OpeningFormValues = Record<OpeningField, string>;

/** Covenant's built-in wording, shown as placeholders so the couple sees what an empty field falls back to. */
export const OPENING_DEFAULTS: Record<"blessingKh" | "blessingEn" | "inviteKh" | "inviteEn" | "titleKh" | "titleEn" | "openKh" | "openEn", string> = {
  blessingKh: "សិរីសួស្ដីអាពាហ៍ពិពាហ៍ក្នុងព្រះអម្ចាស់ព្រះយេស៊ូវគ្រីស្ទ",
  blessingEn: "Wedding in the Lord Jesus Christ",
  inviteKh: "សូមគោរពអញ្ចើញ",
  inviteEn: "With honour, we invite",
  titleKh: "Invitation",
  titleEn: "",
  openKh: "បើកសំបុត្រអញ្ជើញ",
  openEn: "Open the invitation",
};

export const OPENING_LIMITS: Record<"name" | "time" | "venue" | "blessing" | "invite" | "title" | "open", number> = { name: 120, time: 40, venue: 160, blessing: 200, invite: 120, title: 60, open: 60 };

export function openingToForm(content: unknown): OpeningFormValues {
  const source = content && typeof content === "object" ? (content as Record<string, unknown>) : {};
  return Object.fromEntries(OPENING_FIELDS.map((f) => [f, typeof source[f] === "string" ? (source[f] as string) : ""])) as OpeningFormValues;
}

/** Trims every field and drops the empty ones, so a cleared field returns to the built-in text. */
export function openingToContent(values: OpeningFormValues): Partial<OpeningFormValues> {
  const out: Partial<OpeningFormValues> = {};
  for (const f of OPENING_FIELDS) {
    const v = values[f].trim();
    if (v) out[f] = v;
  }
  return out;
}

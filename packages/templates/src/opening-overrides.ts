import type { CoupleInfo, DetailsContent, OpeningContent } from "./types";

const text = (value: string | undefined): string | undefined => (typeof value === "string" && value.trim() ? value.trim() : undefined);

/**
 * Applies what the couple typed in the Opening section over the profile-derived couple and details, so the
 * opening and the cover show the same names, date, time and venue. Anything left empty keeps the profile's value.
 */
export function applyOpeningOverrides(
  couple: CoupleInfo,
  details: DetailsContent | undefined,
  content: OpeningContent | undefined,
): { couple: CoupleInfo; details: DetailsContent | undefined } {
  if (!content) return { couple, details };
  const name1Kh = text(content.name1Kh);
  const name1En = text(content.name1En);
  const name2Kh = text(content.name2Kh);
  const name2En = text(content.name2En);
  const date = text(content.date);
  const time = text(content.time);
  const venue = text(content.venue);

  const nextCouple: CoupleInfo = {
    ...couple,
    partner1Name: name1En ?? name1Kh ?? couple.partner1Name,
    // A name typed only in English replaces the profile's Khmer spelling too, so the Khmer view is not stale.
    partner1NameKh: name1Kh ?? (name1En ? undefined : couple.partner1NameKh),
    partner2Name: name2En ?? name2Kh ?? couple.partner2Name,
    partner2NameKh: name2Kh ?? (name2En ? undefined : couple.partner2NameKh),
    weddingDate: date ?? couple.weddingDate,
  };
  const nextDetails: DetailsContent | undefined =
    time || venue
      ? { ...details, ...(time && { ceremonyTime: time }), ...(venue && { ceremonyVenue: venue, ceremonyAddress: undefined }) }
      : details;
  return { couple: nextCouple, details: nextDetails };
}

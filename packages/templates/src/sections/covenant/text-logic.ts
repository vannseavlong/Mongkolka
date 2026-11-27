import { formatWeddingDate, localizeDigits } from "../../format";
import type { DetailsContent, LettersContent, MapContent, NoteContent } from "../../types";

type Language = "en" | "kh";

/** A bilingual field in the viewer's language; the other language when that one is empty; then `fallback`. */
export function pickText(kh: string | undefined, en: string | undefined, language: Language, fallback = ""): string {
  const own = (language === "kh" ? kh : en)?.trim();
  if (own) return own;
  const other = (language === "kh" ? en : kh)?.trim();
  return other || fallback;
}

/** Paragraphs split on blank lines; single line breaks stay inside a paragraph. */
export const paragraphs = (text: string): string[] => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

export interface LetterView {
  /** The thank-you letter's paragraphs (the built-in thanks when the couple wrote none). */
  thanks: string[];
  /** The couple's second note (apology) paragraphs, or none. */
  apology: string[];
}

export function letterView(content: LettersContent | undefined, language: Language, builtInThanks: string): LetterView {
  return {
    thanks: paragraphs(pickText(content?.gratitudeKh, content?.gratitudeEn, language, builtInThanks)),
    apology: paragraphs(pickText(content?.apologyKh, content?.apologyEn, language)),
  };
}

export interface NoteView {
  title: string;
  body: string[];
  /** True when the couple wrote nothing and the built-in "no alcohol" note is shown (it gets its own icon). */
  builtIn: boolean;
}

export function noteView(content: NoteContent | undefined, language: Language, builtIn: { title: string; body: string }): NoteView {
  const title = pickText(content?.titleKh, content?.titleEn, language);
  const body = pickText(content?.bodyKh, content?.bodyEn, language);
  const custom = !!(title || body);
  return { title: custom ? title : builtIn.title, body: paragraphs(custom ? body : builtIn.body), builtIn: !custom };
}

/** The map picture if it is an https or same-origin link, else null (nothing unsafe reaches an <img>). */
export function mapImage(content: MapContent | undefined): string | null {
  const url = content?.imageUrl?.trim();
  if (!url) return null;
  return /^(https:\/\/|http:\/\/localhost[:/]|\/)/i.test(url) ? url : null;
}

/** A directions link: https only. */
export function directionsUrl(url: string | undefined | null): string | null {
  const u = (url ?? "").trim();
  return /^https:\/\//i.test(u) ? u : null;
}

export interface VenueCard {
  name: string;
  address: string | null;
  date: string | null;
  time: string | null;
}

/** A typed address worth showing; couples sometimes paste a map link there, which is not one. */
const plainAddress = (value: string | undefined): string | null => {
  const text = value?.trim();
  return text && !/^(https?:\/\/|www\.|google\.)/i.test(text) ? text : null;
};

/** What the card beside the map says, from the details (ceremony first); null when there is no venue name. */
export function venueCard(details: DetailsContent | undefined, weddingDate: string | undefined, language: Language): VenueCard | null {
  const ceremony = !!details?.ceremonyVenue?.trim();
  const name = (ceremony ? details?.ceremonyVenue : details?.receptionVenue)?.trim();
  if (!name) return null;
  const time = (ceremony ? details?.ceremonyTime : details?.receptionTime)?.trim();
  return {
    name,
    address: plainAddress(ceremony ? details?.ceremonyAddress : details?.receptionAddress),
    date: formatWeddingDate(weddingDate, language),
    time: time ? localizeDigits(time, language) : null,
  };
}

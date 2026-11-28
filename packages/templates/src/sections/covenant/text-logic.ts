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
  /** The apology's paragraphs (the built-in apology when the couple wrote none). */
  apology: string[];
  /** The closing note, or "" when hidden or there is none. */
  note: string;
}

export function letterView(content: LettersContent | undefined, language: Language, builtInThanks: string, builtInApology = "", builtInNote = ""): LetterView {
  return {
    thanks: paragraphs(pickText(content?.gratitudeKh, content?.gratitudeEn, language, builtInThanks)),
    apology: paragraphs(pickText(content?.apologyKh, content?.apologyEn, language, builtInApology)),
    note: content?.hideNote ? "" : pickText(content?.noteKh, content?.noteEn, language, builtInNote),
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

export interface MapPlace {
  name: string | null;
  href: string | null;
}

/**
 * The line above the map picture. What the couple typed on the map wins; otherwise the reception (the meal is what guests
 * are invited to), then the ceremony venue, and the details map link.
 */
export function mapPlace(content: MapContent | undefined, details: DetailsContent | undefined, mapUrl: string | undefined): MapPlace {
  const name = [content?.placeName, details?.receptionVenue, details?.ceremonyVenue].map((value) => value?.trim()).find(Boolean);
  return { name: name ?? null, href: directionsUrl(content?.mapUrl) ?? directionsUrl(mapUrl) };
}

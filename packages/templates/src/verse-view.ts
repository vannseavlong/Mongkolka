import type { VerseContent } from "./types";

type Language = "en" | "kh";

export interface VerseView {
  text: string;
  reference: string;
  meaning: string;
}

const clean = (v: string | undefined): string => (typeof v === "string" ? v.trim() : "");

/** The viewer's language first, the other language when it is empty, so a verse typed in one language still shows in both. */
function pick(own: string | undefined, other: string | undefined): string {
  return clean(own) || clean(other);
}

/** The verse as one language reader sees it. `text` is "" when no verse is set (the section then renders nothing). */
export function verseView(content: VerseContent | undefined, language: Language): VerseView {
  const kh = language === "kh";
  return {
    text: kh ? pick(content?.textKh, content?.text) : pick(content?.text, content?.textKh),
    reference: kh ? pick(content?.referenceKh, content?.reference) : pick(content?.reference, content?.referenceKh),
    meaning: kh ? pick(content?.meaningKh, content?.meaning) : pick(content?.meaning, content?.meaningKh),
  };
}

import type { OpeningContent } from "../../types";

type Language = "en" | "kh";
type Field = "blessing" | "invite" | "title" | "open";

/** The couple's wording for one field in the viewer's language, or `fallback` (the built-in text) when they left it empty. */
export function openingText(content: OpeningContent | undefined, field: Field, language: Language, fallback: string): string {
  const key = `${field}${language === "kh" ? "Kh" : "En"}` as keyof OpeningContent;
  const value = content?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

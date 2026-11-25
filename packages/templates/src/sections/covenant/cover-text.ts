import type { CoverContent } from "../../types";

/** The couple's cover line for the viewer's language, or `fallback` (the built-in line) when they left it empty. */
export function coverTagline(content: CoverContent | undefined, language: "en" | "kh", fallback: string): string {
  const value = language === "kh" ? content?.taglineKh : content?.taglineEn;
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

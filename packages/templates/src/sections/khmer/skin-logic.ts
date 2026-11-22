import type { CoupleInfo } from "../../types";

/** Pure helpers for the skin stubs and shared Khmer sections. No JSX, no styling. */

/** Khmer text when the viewer reads Khmer and it exists, otherwise English, otherwise whatever is there. */
export function pickLang(language: "en" | "kh", kh?: string, en?: string): string {
  const k = kh?.trim();
  const e = en?.trim();
  if (language === "kh") return k || e || "";
  return e || k || "";
}

/** Couple initials for a monogram, e.g. "S & D". Falls back to "&" when no names are set. */
export function monogramOf(couple: Pick<CoupleInfo, "partner1Name" | "partner2Name">): string {
  const first = Array.from(couple.partner1Name?.trim() ?? "")[0]?.toUpperCase();
  const second = Array.from(couple.partner2Name?.trim() ?? "")[0]?.toUpperCase();
  if (first && second) return `${first} & ${second}`;
  return first ?? second ?? "&";
}

/** Only https links may become an href (the server enforces it too; this is the render-side belt). */
export function safeHttpsUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

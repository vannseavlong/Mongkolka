import type { CoupleInfo } from "../../types";

/** Pure helpers for the Sakura hero. */

/** Names to show, in order, dropping empty ones. */
export function heroNames(couple: Pick<CoupleInfo, "partner1Name" | "partner2Name">): string[] {
  return [couple.partner1Name, couple.partner2Name].map((n) => n?.trim() ?? "").filter(Boolean);
}

/** A portrait is shown only for a usable https or site-relative image URL (never `javascript:` or `data:` text). */
export function heroPhoto(url: string | undefined): string | null {
  const v = url?.trim();
  if (!v) return null;
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  try {
    return new URL(v).protocol === "https:" ? v : null;
  } catch {
    return null;
  }
}

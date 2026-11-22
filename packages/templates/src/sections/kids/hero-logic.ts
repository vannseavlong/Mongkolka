import type { CoupleInfo } from "../../types";

/** Pure view-model for the kids hero. */

export interface HeroView {
  name: string;
  /** "A & B" style names collapse to the first partner's initial for the portrait fallback. */
  initial: string;
  hasPhoto: boolean;
  photo: string | null;
}

/** Only https or site-relative images are shown; anything else falls back to the mascot. */
export function safePhoto(url: string | undefined): string | null {
  const v = url?.trim();
  if (!v) return null;
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  try {
    return new URL(v).protocol === "https:" ? v : null;
  } catch {
    return null;
  }
}

export function buildHeroView(couple: Pick<CoupleInfo, "partner1Name" | "partner2Name">, coverPhotoUrl: string | undefined): HeroView {
  const photo = safePhoto(coverPhotoUrl);
  const name = [couple.partner1Name, couple.partner2Name].map((n) => n?.trim()).filter(Boolean).join(" & ");
  return { name, initial: Array.from(couple.partner1Name?.trim() ?? "")[0]?.toUpperCase() ?? "", hasPhoto: Boolean(photo), photo };
}

/** Evenly spaced points on a circle, for the scalloped frame. */
export function ringPoints(count: number, radius: number, center: number): { x: number; y: number }[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.round((center + Math.cos(a) * radius) * 10) / 10, y: Math.round((center + Math.sin(a) * radius) * 10) / 10 };
  });
}

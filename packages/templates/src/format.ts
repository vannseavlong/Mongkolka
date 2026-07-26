import type { CoupleInfo } from "./types";

export function formatCoupleNames(couple: CoupleInfo): string {
  if (!couple.partner2Name) return couple.partner1Name;
  return `${couple.partner1Name} & ${couple.partner2Name}`;
}

export function formatWeddingDate(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

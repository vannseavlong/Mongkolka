import { formatWeddingDate } from "../../format";

const EN_MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] as const;

/**
 * The hero date line: `29 · MAY · 2026` in English, `២៩ · ឧសភា · ២០២៦` in Khmer. UTC parts, so server and
 * client always agree. Null when there is no usable date.
 */
export function dotDate(iso: string | undefined, language: "en" | "kh"): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  if (language === "kh") {
    const kh = formatWeddingDate(iso, "kh");
    return kh ? kh.split(" ").join(" · ") : null;
  }
  return `${String(date.getUTCDate()).padStart(2, "0")} · ${EN_MONTHS[date.getUTCMonth()]} · ${date.getUTCFullYear()}`;
}

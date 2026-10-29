import type { CoupleInfo } from "./types";

export function formatCoupleNames(couple: CoupleInfo): string {
  if (!couple.partner2Name) return couple.partner1Name;
  return `${couple.partner1Name} & ${couple.partner2Name}`;
}

const KH_MONTHS = [
  "មករា",
  "កុម្ភៈ",
  "មីនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆិកា",
  "ធ្នូ",
] as const;

const toKhmerDigits = (n: number) => String(n).replace(/\d/g, (d) => "០១២៣៤៥៦៧៨៩"[Number(d)] ?? d);

/**
 * `language` is optional so existing callers keep the runtime default locale.
 * With it, output is deterministic (UTC date, fixed en-US locale, and a built-in
 * Khmer formatter that does not depend on the runtime's ICU data), so server and
 * client renders cannot differ.
 */
export function formatWeddingDate(iso: string | undefined, language?: "en" | "kh"): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  if (language === "kh") {
    return `${toKhmerDigits(date.getUTCDate())} ${KH_MONTHS[date.getUTCMonth()]} ${toKhmerDigits(date.getUTCFullYear())}`;
  }
  const opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  if (language === "en") return date.toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
  return date.toLocaleDateString(undefined, opts);
}

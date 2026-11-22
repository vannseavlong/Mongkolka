import { localizeDigits } from "../../format";
import { PHNOM_PENH_OFFSET_MS } from "../../chrome/countdown";

/** Pure date/time wording for the invitation and agenda. Cambodia time, deterministic (no Intl, no ICU). */

type Language = "en" | "kh";

export const KH_WEEKDAYS = ["អាទិត្យ", "ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"] as const;
export const KH_MONTHS = [
  "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
] as const;
const EN_WEEKDAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;
const EN_MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
] as const;

export interface DateParts {
  year: number;
  /** 0-11 */
  month: number;
  day: number;
  /** 0 = Sunday */
  weekday: number;
  hour: number;
  minute: number;
}

/** Wall-clock parts of an instant in Asia/Phnom_Penh (UTC+7). Null if the ISO string is not a date. */
export function phnomPenhParts(iso: string | undefined): DateParts | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime();
  if (!Number.isFinite(ms)) return null;
  const d = new Date(ms + PHNOM_PENH_OFFSET_MS);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    weekday: d.getUTCDay(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
  };
}

/** Parts of a plain "YYYY-MM-DD" calendar date (no timezone shift). Null if malformed. */
export function calendarParts(date: string | undefined): DateParts | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date ?? "");
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (d.getUTCMonth() !== Number(m[2]) - 1) return null;
  return { year: d.getUTCFullYear(), month: d.getUTCMonth(), day: d.getUTCDate(), weekday: d.getUTCDay(), hour: 0, minute: 0 };
}

/** "ត្រូវនឹងថ្ងៃទី២៩ ខែឧសភា ឆ្នាំ២០២៦" */
export function khmerSolarLine(p: DateParts): string {
  return `ត្រូវនឹងថ្ងៃទី${localizeDigits(p.day, "kh")} ខែ${KH_MONTHS[p.month]} ឆ្នាំ${localizeDigits(p.year, "kh")}`;
}

function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${(["th", "st", "nd", "rd"] as const)[n % 10 > 3 ? 0 : n % 10]}`;
}

/** "THURSDAY 16th JANUARY 2025" */
export function englishDateLine(p: DateParts): string {
  return `${EN_WEEKDAYS[p.weekday]} ${ordinal(p.day)} ${EN_MONTHS[p.month]} ${p.year}`;
}

/** "5:00 PM" or "ម៉ោង ៥:០០ ល្ងាច". */
export function timeLine(p: DateParts, language: Language): string {
  const mm = String(p.minute).padStart(2, "0");
  if (language === "en") {
    const h12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
    return `${h12}:${mm} ${p.hour < 12 ? "AM" : "PM"}`;
  }
  const h12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
  const word = p.hour < 12 ? "ព្រឹក" : p.hour < 15 ? "រសៀល" : p.hour < 19 ? "ល្ងាច" : "យប់";
  return `ម៉ោង ${localizeDigits(`${h12}:${mm}`, "kh")} ${word}`;
}

/** Agenda day heading: "ថ្ងៃសុក្រ ២៩ ឧសភា ២០២៦" / "Friday, 29 May 2026". Falls back to the raw string. */
export function agendaDayHeading(date: string, language: Language): string {
  const p = calendarParts(date);
  if (!p) return date;
  if (language === "kh") {
    return `ថ្ងៃ${KH_WEEKDAYS[p.weekday]} ${localizeDigits(p.day, "kh")} ${KH_MONTHS[p.month]} ${localizeDigits(p.year, "kh")}`;
  }
  const w: string = EN_WEEKDAYS[p.weekday] ?? "";
  const month: string = EN_MONTHS[p.month] ?? "";
  return `${w[0]}${w.slice(1).toLowerCase()}, ${p.day} ${month[0]}${month.slice(1).toLowerCase()} ${p.year}`;
}

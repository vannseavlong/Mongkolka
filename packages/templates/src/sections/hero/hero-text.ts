"use client";

import type { CoupleInfo } from "../../types";
import { formatWeddingDate } from "../../format";
import { useLanguage } from "../../i18n";
import { coupleNamesFor } from "../covenant/names";

/** The names and date every hero shows, in the viewer's language (Khmer spelling and numerals when the page is Khmer). */
export function useHeroText(couple: CoupleInfo): { first: string; second?: string; date: string | null; kh: boolean } {
  const { language } = useLanguage();
  const { first, second } = coupleNamesFor(couple, language);
  return { first, second, date: formatWeddingDate(couple.weddingDate, language, { padDay: true }), kh: language === "kh" };
}

export const SCRIPT_FONT = 'var(--font-script), "Great Vibes", cursive';
export const KHMER_DISPLAY_FONT = 'var(--font-moul), "Moul", serif';

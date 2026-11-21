import type { CoupleInfo, InvitationContent } from "../../types";
import { englishDateLine, khmerSolarLine, phnomPenhParts, timeLine } from "./date-lines";
import { buildFamily, orderedLanguages, type FamilyView } from "./lineage";
import { monogramOf } from "./skin-logic";

type Language = "en" | "kh";

export interface InvitationBlock {
  lang: Language;
  greeting: string;
  groom: FamilyView | null;
  bride: FamilyView | null;
}

export interface InvitationView {
  monogram: string;
  blocks: InvitationBlock[];
  /** Shown when there are no families to introduce (a free-text greeting alone). */
  looseGreeting: string;
  lunar: string;
  solarKh: string;
  englishDate: string;
  timeKh: string;
  timeEn: string;
  startsAt: string | undefined;
  isEmpty: boolean;
}

const t = (v?: string) => v?.trim() ?? "";

/**
 * Everything the invitation shows, decided in one pure place: which languages appear (the viewer's
 * first, a language with no family data is left out), the greeting per block (the couple's own text,
 * else the formal default), and the date lines (typed text wins; otherwise derived from `startsAt`
 * in Cambodia time).
 */
export function buildInvitationView(
  content: InvitationContent | undefined,
  couple: Pick<CoupleInfo, "partner1Name" | "partner2Name">,
  viewer: Language,
  defaultGreeting: (lang: Language) => string,
): InvitationView {
  const c = content ?? {};
  const families: Record<Language, { groom: FamilyView | null; bride: FamilyView | null }> = {
    kh: { groom: buildFamily(c.groom, "groom", "kh"), bride: buildFamily(c.bride, "bride", "kh") },
    en: { groom: buildFamily(c.groom, "groom", "en"), bride: buildFamily(c.bride, "bride", "en") },
  };
  const has = { kh: Boolean(families.kh.groom || families.kh.bride), en: Boolean(families.en.groom || families.en.bride) };
  const blocks: InvitationBlock[] = orderedLanguages(viewer, has).map((lang) => ({
    lang,
    greeting: t(lang === "kh" ? c.greetingKh : c.greetingEn) || defaultGreeting(lang),
    ...families[lang],
  }));

  const parts = phnomPenhParts(c.startsAt);
  const solarKh = t(c.solarKh) || (parts ? khmerSolarLine(parts) : "");
  const lunar = t(c.lunarKh);
  const englishDate = parts ? englishDateLine(parts) : "";
  const looseGreeting = blocks.length === 0 ? (viewer === "kh" ? t(c.greetingKh) || t(c.greetingEn) : t(c.greetingEn) || t(c.greetingKh)) : "";

  return {
    monogram: t(c.monogram) || monogramOf(couple),
    blocks,
    looseGreeting,
    lunar,
    solarKh,
    englishDate,
    timeKh: parts ? timeLine(parts, "kh") : "",
    timeEn: parts ? timeLine(parts, "en") : "",
    startsAt: parts ? c.startsAt : undefined,
    isEmpty: blocks.length === 0 && !looseGreeting && !lunar && !solarKh && !englishDate,
  };
}

import type { CoupleInfo, InvitationContent } from "../../types";
import { englishDateLine, khmerSolarLine, phnomPenhParts, timeLine } from "../khmer/date-lines";
import { englishParentsLine, khmerParentLine } from "../khmer/lineage";
import { pickLang } from "../khmer/skin-logic";
import { honoreeName } from "./kids-logic";

type Language = "en" | "kh";

/**
 * Pure view-model for the kids invitation. A birthday reuses the shared `InvitationContent`:
 * `groom` is the child being celebrated (their name, and their parents as the hosts), `greeting*` is the
 * invitation message, `monogram` the crest letters, `startsAt` the party start. `bride` is ignored.
 */
export interface KidsInvitationView {
  monogram: string;
  name: string;
  otherName: string;
  greeting: string;
  hosts: string[];
  lunar: string;
  solarKh: string;
  englishDate: string;
  time: string;
  startsAt: string | undefined;
  isEmpty: boolean;
}

const t = (v?: string) => v?.trim() ?? "";

export function buildKidsInvitation(content: InvitationContent | undefined, couple: Pick<CoupleInfo, "partner1Name" | "partner2Name">, language: Language): KidsInvitationView {
  const c = content ?? {};
  const { name, other } = honoreeName(language, c.groom, couple.partner1Name);
  const hostsFor = (lang: Language): string[] =>
    lang === "kh"
      ? [khmerParentLine(c.groom?.fatherKh, "father"), khmerParentLine(c.groom?.motherKh, "mother")].filter(Boolean)
      : [englishParentsLine(c.groom?.fatherEn, c.groom?.motherEn)].filter(Boolean);
  const hosts = hostsFor(language).length > 0 ? hostsFor(language) : hostsFor(language === "kh" ? "en" : "kh");

  const parts = phnomPenhParts(c.startsAt);
  const solarKh = t(c.solarKh) || (parts ? khmerSolarLine(parts) : "");
  const lunar = t(c.lunarKh);
  const englishDate = parts ? englishDateLine(parts) : "";
  const greeting = pickLang(language, c.greetingKh, c.greetingEn);
  const monogram = t(c.monogram) || (Array.from(name)[0]?.toUpperCase() ?? "");

  return {
    monogram,
    name,
    otherName: other,
    greeting,
    hosts,
    lunar,
    solarKh,
    englishDate,
    time: parts ? timeLine(parts, language) : "",
    startsAt: parts ? c.startsAt : undefined,
    isEmpty: !t(c.groom?.nameKh) && !t(c.groom?.nameEn) && !greeting && hosts.length === 0 && !lunar && !solarKh && !englishDate,
  };
}

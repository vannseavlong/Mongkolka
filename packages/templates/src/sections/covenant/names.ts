import type { CoupleInfo } from "../../types";

export interface CovenantNames {
  first: string;
  second?: string;
}

/** The couple's names in the viewer's language: the Khmer spelling when the page is Khmer and one is set, otherwise the main name. */
export function coupleNamesFor(couple: CoupleInfo, language: "en" | "kh"): CovenantNames {
  const pick = (main: string | undefined, kh: string | undefined) => (language === "kh" && kh?.trim() ? kh.trim() : main);
  return { first: pick(couple.partner1Name, couple.partner1NameKh) ?? "", second: pick(couple.partner2Name, couple.partner2NameKh) };
}

export function joinNames(n: CovenantNames): string {
  return n.second ? `${n.first} & ${n.second}` : n.first;
}

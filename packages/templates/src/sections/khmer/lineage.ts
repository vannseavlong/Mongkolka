import type { InvitationParty } from "../../types";

/** Pure wording for the two families on the formal invitation. */

type Language = "en" | "kh";

const KH_HONORIFICS = ["លោក", "ឯកឧត្តម", "ឧកញ៉ា", "អ្នកឧកញ៉ា", "ឧបាសក", "ឧបាសិកា", "អ្នកស្រី", "អ្នក", "សម្ដេច", "សម្តេច", "ទីប្រឹក្សា"];
const EN_HONORIFIC = /^(mr|mrs|ms|miss|dr|prof|h\.?e|his|her|lok|neak)\b\.?/i;

const clean = (v?: string) => v?.trim() ?? "";

export function khmerParentLine(name: string | undefined, role: "father" | "mother"): string {
  const n = clean(name);
  if (!n) return "";
  return KH_HONORIFICS.some((h) => n.startsWith(h)) ? n : `${role === "father" ? "លោក" : "លោកស្រី"} ${n}`;
}

/** "Mr. Sun Sambath & Mrs. Chea Sophea"; one parent alone is fine; honorifics already typed are kept. */
export function englishParentsLine(father: string | undefined, mother: string | undefined): string {
  const f = clean(father);
  const m = clean(mother);
  const fa = f ? (EN_HONORIFIC.test(f) ? f : `Mr. ${f}`) : "";
  const mo = m ? (EN_HONORIFIC.test(m) ? m : `Mrs. ${m}`) : "";
  return [fa, mo].filter(Boolean).join(" & ");
}

export interface FamilyView {
  side: "groom" | "bride";
  /** Khmer: one line per parent; English: a single "Mr. … & Mrs. …" line. */
  parents: string[];
  name: string;
}

export function buildFamily(party: InvitationParty | undefined, side: FamilyView["side"], language: Language): FamilyView | null {
  if (!party) return null;
  const parents =
    language === "kh"
      ? [khmerParentLine(party.fatherKh, "father"), khmerParentLine(party.motherKh, "mother")].filter(Boolean)
      : [englishParentsLine(party.fatherEn, party.motherEn)].filter(Boolean);
  const name = clean(language === "kh" ? party.nameKh : party.nameEn);
  if (parents.length === 0 && !name) return null;
  return { side, parents, name };
}

/** Languages to show, the viewer's own first; a language with no data is left out. */
export function orderedLanguages(viewer: Language, has: Record<Language, boolean>): Language[] {
  const order: Language[] = viewer === "kh" ? ["kh", "en"] : ["en", "kh"];
  const present = order.filter((l) => has[l]);
  return present;
}

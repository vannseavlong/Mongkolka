import type { CoupleInfo, FooterContent } from "../../types";

export interface FooterBody {
  names: string;
  hasDate: boolean;
  message: string;
  hashtag: string;
}

/** Whether the footer has anything of its own to say (names, date, message or hashtag). */
export function footerHasBody(couple: CoupleInfo | undefined, content: FooterContent | undefined, date: string | null): boolean {
  return !!(couple?.partner1Name?.trim() || date || content?.message?.trim() || content?.hashtag?.trim());
}

/** Couple names as one line: "A & B", "A", or "". */
export function namesLine(couple: CoupleInfo | undefined): string {
  const a = couple?.partner1Name?.trim() ?? "";
  const b = couple?.partner2Name?.trim() ?? "";
  return a && b ? `${a} & ${b}` : a || b;
}

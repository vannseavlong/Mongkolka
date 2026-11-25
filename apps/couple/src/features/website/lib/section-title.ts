import type { WebsiteSection } from "../data/schema";

export interface TitleFormValues {
  kh: string;
  en: string;
}

export const TITLE_MAX = 80;

export function titleToForm(title: WebsiteSection["title"]): TitleFormValues {
  return { kh: title?.kh ?? "", en: title?.en ?? "" };
}

/** What to save: trimmed values, or null when both are empty so the section goes back to the template's wording. */
export function titleToPatch(values: TitleFormValues): { kh?: string; en?: string } | null {
  const kh = values.kh.trim();
  const en = values.en.trim();
  return kh || en ? { ...(kh && { kh }), ...(en && { en }) } : null;
}

export function titleChanged(saved: WebsiteSection["title"], values: TitleFormValues): boolean {
  const a = titleToPatch(titleToForm(saved));
  const b = titleToPatch(values);
  return JSON.stringify(a) !== JSON.stringify(b);
}

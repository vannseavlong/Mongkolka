import type { AgendaContent, AgendaIcon } from "../../types";
import { agendaDayHeading } from "./date-lines";

/** Pure view-model for the agenda timeline. */

type Language = "en" | "kh";

export interface AgendaItemView {
  time: string;
  title: string;
  /** The other language, shown smaller; empty when absent or identical. */
  subtitle: string;
  icon: AgendaIcon | null;
  /** True when the title came from the icon's default ritual name rather than the couple's text. */
  usedDefault: boolean;
}

export interface AgendaDayView {
  date: string;
  /** 1-based, in date order. */
  number: number;
  heading: string;
  items: AgendaItemView[];
}

export function iconTitleKey(icon: AgendaIcon): `khmer.agenda.icon.${AgendaIcon}` {
  return `khmer.agenda.icon.${icon}`;
}

const t = (v?: string) => v?.trim() ?? "";

/**
 * Days sorted by date; items keep the couple's order. An item with neither a title nor an icon is
 * dropped; an item with only an icon gets that icon's default ritual name (resolved by the caller
 * through `iconTitleKey`, so this file holds no UI text). Days left with no items are dropped.
 */
export function buildAgenda(
  content: AgendaContent | undefined,
  language: Language,
  defaultTitle: (icon: AgendaIcon) => string,
): AgendaDayView[] {
  const days = [...(content?.days ?? [])].sort((a, b) => a.date.localeCompare(b.date));
  const out: AgendaDayView[] = [];
  for (const day of days) {
    const items: AgendaItemView[] = [];
    for (const raw of day.items ?? []) {
      const own = language === "kh" ? t(raw.titleKh) : t(raw.titleEn);
      const other = language === "kh" ? t(raw.titleEn) : t(raw.titleKh);
      const icon = raw.icon ?? null;
      if (!own && !other && !icon) continue;
      const title = own || other || (icon ? defaultTitle(icon) : "");
      const subtitle = own && other && own !== other ? other : "";
      items.push({ time: t(raw.time), title, subtitle, icon, usedDefault: !own && !other });
    }
    if (items.length > 0) out.push({ date: day.date, number: out.length + 1, heading: agendaDayHeading(day.date, language), items });
  }
  return out;
}

// Pure mapping between the couple editor's form values and the stored content of the
// `invitation`, `agenda` and `letters` sections (shapes: InvitationContent, AgendaContent,
// LettersContent in @mongkolka/templates). No React here, so a rule change never touches
// a component. The API re-validates everything; these limits are UX only.
import type { AgendaContent, AgendaIcon, InvitationContent, InvitationParty, LettersContent } from "@mongkolka/templates";
import { AGENDA_ICONS } from "@mongkolka/templates";
import { asRecord } from "./section-content-save";

export const PHNOM_PENH_OFFSET = "+07:00";
const PHNOM_PENH_OFFSET_MINUTES = 7 * 60;

export const AGENDA_ICON_LABELS: Record<AgendaIcon, string> = {
  monk: "Monk blessing",
  procession: "Procession (ហែជំនូន)",
  scissors: "Hair-cutting (កាត់សក់)",
  thread: "Wrist-tying (សែនចងដៃ)",
  ring: "Ring exchange",
  tea: "Tea ceremony",
  dinner: "Reception / dinner",
  party: "Party",
  cake: "Cake",
};

const str = (v: unknown) => (typeof v === "string" ? v : "");
const clean = (v: string) => v.trim() || undefined;

/** "2026-05-29T17:00" (a datetime-local value, Cambodia time) to ISO with offset. */
export function toStartsAt(local: string): string | undefined {
  const v = local.trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) return undefined;
  return `${v}:00${PHNOM_PENH_OFFSET}`;
}

/** Stored ISO (any offset) to a datetime-local value in Cambodia time; "" when unusable. */
export function fromStartsAt(iso: unknown): string {
  if (typeof iso !== "string") return "";
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return "";
  return new Date(ms + PHNOM_PENH_OFFSET_MINUTES * 60_000).toISOString().slice(0, 16);
}

// ---- invitation -----------------------------------------------------------

export interface PartyFormValues {
  nameKh: string;
  nameEn: string;
  fatherKh: string;
  fatherEn: string;
  motherKh: string;
  motherEn: string;
}

export interface InvitationFormValues {
  groom: PartyFormValues;
  bride: PartyFormValues;
  monogram: string;
  lunarKh: string;
  solarKh: string;
  startsAt: string; // datetime-local, Cambodia time
  greetingKh: string;
  greetingEn: string;
  noticeKh: string;
  noticeEn: string;
  hideNotice: boolean;
}

const PARTY_KEYS = ["nameKh", "nameEn", "fatherKh", "fatherEn", "motherKh", "motherEn"] as const;

function partyToForm(value: unknown): PartyFormValues {
  const p = asRecord(value);
  return Object.fromEntries(PARTY_KEYS.map((k) => [k, str(p[k])])) as unknown as PartyFormValues;
}

function partyToContent(values: PartyFormValues): InvitationParty | undefined {
  const out: InvitationParty = {};
  for (const k of PARTY_KEYS) {
    const v = clean(values[k]);
    if (v) out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function invitationToForm(content: unknown): InvitationFormValues {
  const c = asRecord(content);
  return {
    groom: partyToForm(c.groom),
    bride: partyToForm(c.bride),
    monogram: str(c.monogram),
    lunarKh: str(c.lunarKh),
    solarKh: str(c.solarKh),
    startsAt: fromStartsAt(c.startsAt),
    greetingKh: str(c.greetingKh),
    greetingEn: str(c.greetingEn),
    noticeKh: str(c.noticeKh),
    noticeEn: str(c.noticeEn),
    hideNotice: c.hideNotice === true,
  };
}

export function invitationToContent(values: InvitationFormValues): InvitationContent {
  return {
    groom: partyToContent(values.groom),
    bride: partyToContent(values.bride),
    monogram: clean(values.monogram),
    lunarKh: clean(values.lunarKh),
    solarKh: clean(values.solarKh),
    startsAt: toStartsAt(values.startsAt),
    greetingKh: clean(values.greetingKh),
    greetingEn: clean(values.greetingEn),
    noticeKh: clean(values.noticeKh),
    noticeEn: clean(values.noticeEn),
    hideNotice: values.hideNotice || undefined,
  };
}

// ---- agenda ---------------------------------------------------------------

export interface AgendaFormValues {
  days: { date: string; items: { time: string; titleKh: string; titleEn: string; icon: AgendaIcon | "" }[] }[];
}

export function agendaToForm(content: unknown): AgendaFormValues {
  const days = asRecord(content).days;
  if (!Array.isArray(days)) return { days: [] };
  return {
    days: days.map((rawDay) => {
      const day = asRecord(rawDay);
      const items = Array.isArray(day.items) ? day.items : [];
      return {
        date: str(day.date),
        items: items.map((rawItem) => {
          const item = asRecord(rawItem);
          const icon = str(item.icon);
          return {
            time: str(item.time),
            titleKh: str(item.titleKh),
            titleEn: str(item.titleEn),
            icon: (AGENDA_ICONS as readonly string[]).includes(icon) ? (icon as AgendaIcon) : "",
          };
        }),
      };
    }),
  };
}

export function agendaToContent(values: AgendaFormValues): AgendaContent {
  return {
    days: values.days.map((day) => ({
      date: day.date.trim(),
      items: day.items.map((item) => ({
        time: item.time.trim(),
        titleKh: clean(item.titleKh),
        titleEn: clean(item.titleEn),
        icon: item.icon || undefined,
      })),
    })),
  };
}

// ---- letters --------------------------------------------------------------

export type LettersFormValues = Required<LettersContent>;

export function lettersToForm(content: unknown): LettersFormValues {
  const c = asRecord(content);
  return {
    gratitudeKh: str(c.gratitudeKh),
    gratitudeEn: str(c.gratitudeEn),
    apologyKh: str(c.apologyKh),
    apologyEn: str(c.apologyEn),
  };
}

export function lettersToContent(values: LettersFormValues): LettersContent {
  return {
    gratitudeKh: clean(values.gratitudeKh),
    gratitudeEn: clean(values.gratitudeEn),
    apologyKh: clean(values.apologyKh),
    apologyEn: clean(values.apologyEn),
  };
}

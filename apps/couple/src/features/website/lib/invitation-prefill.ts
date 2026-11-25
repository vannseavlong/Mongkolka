import type { InvitationFormValues } from "./khmer-content";

/** The profile fields the invitation can be started from. */
export interface InvitationPrefillSource {
  partner1_name: string | null;
  partner2_name: string | null;
  wedding_date: string | null;
  ceremony_time: string | null;
}

const KHMER = /[ក-៿᧠-᧿]/;
const hasKhmer = (text: string) => KHMER.test(text);

/** "5:00pm", "5 PM", "5.30 pm", "17:00" -> "17:00" / "17:30"; null when it is not a clock time. */
export function parseClockTime(text: string | null | undefined): string | null {
  const m = /^\s*(\d{1,2})(?:[:.](\d{2}))?\s*([ap]\.?m\.?)?\s*$/i.exec(text ?? "");
  if (!m) return null;
  let hour = Number(m[1]);
  const minute = Number(m[2] ?? "0");
  const meridiem = m[3]?.[0]?.toLowerCase();
  if (minute > 59) return null;
  if (meridiem) {
    if (hour < 1 || hour > 12) return null;
    hour = (hour % 12) + (meridiem === "p" ? 12 : 0);
  } else if (hour > 23) return null;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** Initials for the crest from the two names, e.g. "V&S" (first letter of each, up to 8 characters). */
export function monogramFor(first: string | null, second: string | null): string {
  const initial = (name: string | null) => Array.from((name ?? "").trim())[0]?.toLocaleUpperCase() ?? "";
  const a = initial(first);
  const b = initial(second);
  return [a, b].filter(Boolean).join("&").slice(0, 8);
}

/** True when any invitation field already has something in it. */
export function hasInvitationContent(form: InvitationFormValues): boolean {
  const parties = [form.groom, form.bride].flatMap((p) => Object.values(p));
  return [...parties, form.monogram, form.lunarKh, form.solarKh, form.startsAt, form.greetingKh, form.greetingEn].some((v) => v.trim() !== "");
}

/**
 * Starts an empty invitation from the profile: partner 1 is the groom (left), partner 2 the bride (right); a Khmer
 * name goes in the Khmer box and any other in the English box; the monogram is their initials; the event start is the
 * wedding date at the ceremony time (09:00 when that time is not a clock time). Only empty boxes are filled.
 */
export function prefillInvitation(form: InvitationFormValues, profile: InvitationPrefillSource): InvitationFormValues {
  const fillParty = (party: InvitationFormValues["groom"], name: string | null) => {
    const value = (name ?? "").trim();
    if (!value) return party;
    return hasKhmer(value) ? { ...party, nameKh: party.nameKh || value } : { ...party, nameEn: party.nameEn || value };
  };
  const date = /^(\d{4}-\d{2}-\d{2})/.exec(profile.wedding_date ?? "")?.[1];
  return {
    ...form,
    groom: fillParty(form.groom, profile.partner1_name),
    bride: fillParty(form.bride, profile.partner2_name),
    monogram: form.monogram || monogramFor(profile.partner1_name, profile.partner2_name),
    startsAt: form.startsAt || (date ? `${date}T${parseClockTime(profile.ceremony_time) ?? "09:00"}` : ""),
  };
}

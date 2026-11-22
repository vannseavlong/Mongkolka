import type { RsvpSubmission } from "../rsvp/Classic";

export const MAX_GUESTS = 10;
export const MAX_NAME = 80;
export const MAX_MESSAGE = 500;

export function clampGuests(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_GUESTS, Math.max(1, Math.trunc(n)));
}

export interface RsvpDraft {
  name: string;
  attending: boolean | null;
  guests: number;
  message: string;
}

export interface RsvpErrors {
  name: boolean;
  attending: boolean;
}

export function rsvpErrors(draft: Pick<RsvpDraft, "name" | "attending">): RsvpErrors {
  return { name: !draft.name.trim(), attending: draft.attending === null };
}

export function isRsvpValid(draft: Pick<RsvpDraft, "name" | "attending">): boolean {
  const e = rsvpErrors(draft);
  return !e.name && !e.attending;
}

/**
 * What the app's `onSubmit` receives. The API only knows `plusOne`, so a party larger than one is also
 * written as a fixed, language-neutral "Guests: N" line the couple (and any parser) can read.
 */
export function buildRsvpSubmission(draft: RsvpDraft): RsvpSubmission {
  const attending = draft.attending === true;
  const guests = clampGuests(draft.guests);
  const party = attending && guests > 1 ? `Guests: ${guests}` : "";
  const note = [draft.message.trim().slice(0, MAX_MESSAGE), party].filter(Boolean).join("\n");
  return {
    name: draft.name.trim().slice(0, MAX_NAME),
    attending,
    plusOne: attending && guests > 1,
    message: note || undefined,
  };
}

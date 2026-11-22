import { localizeDigits } from "../format";

/**
 * Countdown logic, pure so it is testable without rendering. All "which day is it" decisions use
 * Cambodia time (Asia/Phnom_Penh, UTC+7, no DST), because the event is held there whatever
 * timezone the guest's phone is in. Pass the target as an ISO string WITH an offset
 * ("2026-05-29T17:00:00+07:00"); a date-only string is read as UTC midnight (07:00 in Phnom Penh).
 */

export type CountdownStatus =
  /** Before the event day. */
  | "upcoming"
  /** The event day, before the start time ("Wedding Day"). */
  | "day"
  /** The start time has passed, still the event day ("Event Started"). */
  | "started"
  /** The event day is over; callers normally hide the countdown. */
  | "ended"
  /** Missing or unparsable target. */
  | "invalid";

export interface Countdown {
  status: CountdownStatus;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const PHNOM_PENH_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const dayNumber = (ms: number) => Math.floor((ms + PHNOM_PENH_OFFSET_MS) / DAY_MS);

const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function getCountdown(targetIso: string | null | undefined, nowMs: number): Countdown {
  const target = targetIso ? new Date(targetIso).getTime() : NaN;
  if (!Number.isFinite(target) || !Number.isFinite(nowMs)) return { status: "invalid", ...ZERO };

  const diff = target - nowMs;
  const sameDay = dayNumber(nowMs) === dayNumber(target);

  if (diff <= 0) return { status: sameDay ? "started" : "ended", ...ZERO };

  const totalSeconds = Math.floor(diff / 1000);
  return {
    status: sameDay ? "day" : "upcoming",
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** Whether the clock still needs a 1s tick (false once there is nothing left to count). */
export function isCountdownLive(status: CountdownStatus): boolean {
  return status === "upcoming" || status === "day";
}

/** Two-digit unit in the page language: "07" / "០៧". Days are not padded below 2 digits either. */
export function formatCountdownUnit(value: number, language: "en" | "kh"): string {
  return localizeDigits(String(Math.max(0, Math.trunc(value))).padStart(2, "0"), language);
}

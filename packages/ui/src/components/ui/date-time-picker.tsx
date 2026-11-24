"use client";

import * as React from "react";

import { cn } from "./utils";
import { DatePicker } from "./date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

/** Every half hour, "00:00" to "23:30". */
export const TIME_SLOTS: string[] = Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);

/** Splits "2026-05-29T17:00" into its date and time parts; either may be "". */
export function splitDateTime(value: string | null | undefined): { date: string; time: string } {
  const match = /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2}))?/.exec(value ?? "");
  return { date: match?.[1] ?? "", time: match?.[2] ?? "" };
}

/** Joins a date and a time into "YYYY-MM-DDTHH:mm". No date means no value; a date without a time uses `fallbackTime`. */
export function joinDateTime(date: string, time: string, fallbackTime = "09:00"): string {
  return date ? `${date}T${time || fallbackTime}` : "";
}

/** A date picker plus a time dropdown (30-minute steps). `value` is "YYYY-MM-DDTHH:mm", like `<input type="datetime-local">`. */
function DateTimePicker({
  value,
  onChange,
  id,
  disabled,
  className,
}: {
  value: string | null | undefined;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
}) {
  const { date, time } = splitDateTime(value);
  // A stored time that is not on the half hour (e.g. 17:15) is still shown and kept.
  const slots = time && !TIME_SLOTS.includes(time) ? [...TIME_SLOTS, time].sort() : TIME_SLOTS;

  return (
    <div className={cn("grid gap-2 sm:grid-cols-[1fr_8rem]", className)}>
      <DatePicker id={id} value={date} disabled={disabled} onChange={(next) => onChange(joinDateTime(next, time))} />
      <Select value={time || undefined} disabled={disabled || !date} onValueChange={(next) => onChange(joinDateTime(date, next))}>
        <SelectTrigger className="w-full" aria-label="Time">
          <SelectValue placeholder="Time" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {slots.map((slot) => (
            <SelectItem key={slot} value={slot}>
              {slot}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { DateTimePicker };

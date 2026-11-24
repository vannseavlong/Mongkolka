"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

/** "2027-01-07" (or an ISO timestamp starting with it) to a local Date at midnight, or undefined. Local, so no timezone shift. */
export function parseDateValue(value: string | null | undefined): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
  if (!match) return undefined;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) || date.getMonth() !== Number(match[2]) - 1 ? undefined : date;
}

/** A Date to "YYYY-MM-DD" using its local calendar day. */
export function toDateValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const LONG_DATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/**
 * shadcn date picker: a button that opens a calendar with month and year dropdowns.
 * `value` and `onChange` use "YYYY-MM-DD" ("" = no date), the same as an `<input type="date">`.
 */
function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  id,
  disabled,
  clearable = true,
  fromYear = 1990,
  toYear = 2100,
  className,
  ...props
}: {
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  clearable?: boolean;
  fromYear?: number;
  toYear?: number;
  className?: string;
} & Omit<React.ComponentProps<"button">, "value" | "onChange">) {
  const [open, setOpen] = React.useState(false);
  const date = parseDateValue(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          data-empty={!date}
          className={cn("w-full justify-start gap-2 px-3 font-normal data-[empty=true]:text-muted-foreground", className)}
          {...props}
        >
          <CalendarIcon className="size-4 shrink-0 opacity-70" />
          <span className="truncate">{date ? LONG_DATE.format(date) : placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={(next) => {
            onChange(next ? toDateValue(next) : "");
            setOpen(false);
          }}
          captionLayout="dropdown-buttons"
          fromYear={fromYear}
          toYear={toYear}
          initialFocus
        />
        {clearable && date && (
          <div className="border-t p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };

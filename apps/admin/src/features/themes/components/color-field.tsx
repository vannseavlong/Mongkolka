"use client";

import { Info } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mongkolka/ui/tooltip";

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function toSwatchColor(value: string, fallback?: string): string {
  if (HEX_COLOR.test(value)) return value;
  if (fallback && HEX_COLOR.test(fallback)) return fallback;
  return "#ffffff";
}

/**
 * A paired `<input type="color">` picker + free-text input (hex or oklch())
 * kept in sync through the same react-hook-form field. There's no color-input
 * primitive in @mongkolka/ui yet, so this stays local to the themes feature.
 */
export function ColorField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  hint,
  fallback,
}: {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  /** Plain-language explanation of what this color controls — e.g. "Buttons, links & highlights" for Primary — shown in a tooltip on hover so admins without design background know what they're changing. */
  hint?: string;
  /** Shown as placeholder/swatch when the field is left blank — mirrors the matching core color. */
  fallback?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = typeof field.value === "string" ? field.value : "";
        return (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              {label}
              {hint && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>{hint}</TooltipContent>
                </Tooltip>
              )}
            </FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label={`${label} color picker`}
                  className="size-9 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1"
                  value={toSwatchColor(value, fallback)}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                <Input
                  value={value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={fallback || "#ffffff or oklch(...)"}
                  className="font-mono text-sm"
                />
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}

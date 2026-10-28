"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { contrastRatio, FONT_STYLES, MIN_TEXT_CONTRAST, THEME_PRESETS } from "@mongkolka/templates";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { cn } from "@mongkolka/ui/utils";
import { api, ApiError } from "@/lib/api";
import type { Theme } from "../data/schema";

const COLOR_KEYS = ["bg_color", "text_color", "accent_color", "font_style"] as const;

export function ThemeEditor({
  theme,
  templateDefault,
  onPreview,
}: {
  /** Resolved site theme (template default + saved override). */
  theme: Theme;
  /** The template's own theme, what "Reset to template" returns to. */
  templateDefault: Theme;
  /** Fired on every field change, before Save — lets the caller reflect
   * in-progress edits in the live preview instead of the couple having to
   * save-and-wait to see a color take effect. */
  onPreview?: (theme: Theme) => void;
}) {
  const form = useForm<Theme>({ values: theme });
  const watched = useWatch({ control: form.control });

  useEffect(() => {
    // form.getValues() (not the `theme` prop) so this only reacts to actual
    // field edits (via `watched`) — depending on `theme` directly would rerun
    // on every parent render, since index.tsx recreates that object each time.
    onPreview?.(form.getValues());
  }, [watched, form, onPreview]);

  const ratio = contrastRatio(watched.text_color ?? theme.text_color, watched.bg_color ?? theme.bg_color);
  const lowContrast = ratio < MIN_TEXT_CONTRAST;

  function applyPreset(preset: Theme) {
    for (const key of COLOR_KEYS) form.setValue(key, preset[key], { shouldDirty: true });
  }

  async function onSubmit(values: Theme) {
    // Partial override: only keys that differ from the template, so a later
    // template switch still brings its own colors for everything left alone.
    const override: Partial<Theme> = {};
    for (const key of COLOR_KEYS) if (values[key] !== templateDefault[key]) override[key] = values[key];
    try {
      await api.patch("/couple/api/website/theme", { theme_override: override });
      toast.success("Theme saved");
      mutate("/couple/api/website/settings");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save theme");
    }
  }

  // The API rejects theme_override: null (400), so "no override" is saved as {}.
  async function resetToTemplate() {
    try {
      await api.patch("/couple/api/website/theme", { theme_override: {} });
      form.reset(templateDefault);
      toast.success("Colors reset to the template");
      mutate("/couple/api/website/settings");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to reset colors");
    }
  }

  const current = form.getValues();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">Palettes</legend>
          <p className="text-xs text-muted-foreground">Hover or focus a palette to preview it on the page. Click to use it, then Save.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {THEME_PRESETS.map((preset) => {
              const active = COLOR_KEYS.every((k) => current[k] === preset.theme[k]);
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => applyPreset(preset.theme)}
                  onMouseEnter={() => onPreview?.(preset.theme)}
                  onFocus={() => onPreview?.(preset.theme)}
                  onMouseLeave={() => onPreview?.(form.getValues())}
                  onBlur={() => onPreview?.(form.getValues())}
                  className={cn(
                    "flex flex-col gap-1.5 rounded-md border p-2 text-left text-xs outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
                    active && "border-primary ring-1 ring-primary",
                  )}
                >
                  <span
                    className="flex h-8 items-center justify-between rounded px-2"
                    style={{ background: preset.theme.bg_color, color: preset.theme.text_color, fontFamily: preset.theme.font_style === "serif" ? "serif" : "sans-serif" }}
                  >
                    <span className="text-sm font-semibold">Aa</span>
                    <span className="size-3 rounded-full" style={{ background: preset.theme.accent_color }} />
                  </span>
                  <span className="flex items-center justify-between gap-1">
                    <span className="truncate">{preset.name}</span>
                    {active && <Check className="size-3 shrink-0" aria-label="Selected" />}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bg_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accent_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accent</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="font_style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font style</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FONT_STYLES.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <p role="status" className={cn("text-xs", lowContrast ? "text-destructive" : "text-muted-foreground")}>
          Text on background contrast {ratio.toFixed(1)}:1
          {lowContrast ? ` (below ${MIN_TEXT_CONTRAST}:1, may be hard to read)` : " (good)"}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" aria-disabled={form.formState.isSubmitting}
            onClick={(e) => form.formState.isSubmitting && e.preventDefault()}
            className="w-fit"
          >
            Save colors
          </Button>
          <Button type="button" variant="outline" onClick={resetToTemplate}>
            Reset to template
          </Button>
        </div>
      </form>
    </Form>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { Palette } from "lucide-react";
import { sameColor } from "@mongkolka/templates";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@mongkolka/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { api, ApiError } from "@/lib/api";
import { SECTIONS_KEY } from "../lib/keys";
import type { Theme, WebsiteSection } from "../data/schema";


/**
 * Per-section variant of ThemeEditor.tsx — same 4 fields (bg/text/accent color +
 * font style), same react-hook-form `values:` live-sync pattern, but scoped to
 * PATCHing one section's `color_override` instead of the whole-site theme.
 * `color_override` cascades over `couple_profile.theme_override` which cascades
 * over the template default (see packages/templates/src/theme.ts) — this popover
 * only ever writes/clears the section's own layer of that cascade.
 */
export function SectionColorPopover({
  section,
  effectiveTheme,
}: {
  section: WebsiteSection;
  /** What this section resolves to today with no override of its own — used to
   * pre-fill the form with the colors it would otherwise inherit. */
  effectiveTheme: Theme;
}) {
  const hasOverride = !!section.color_override;
  const form = useForm<Theme>({
    values: { ...effectiveTheme, ...(section.color_override ?? {}) },
  });

  // Functional-updater form of mutate() since this component only has its own
  // section, not the full list — it patches whichever cached list is there
  // rather than needing the list threaded down as a prop. Same
  // update-now/reconcile-after-the-round-trip pattern as SectionsList.
  function setOverrideOptimistically(colorOverride: Theme | null) {
    mutate(
      SECTIONS_KEY,
      (current?: { sections: WebsiteSection[] }) =>
        current && {
          sections: current.sections.map((s) =>
            s.section_id === section.section_id ? { ...s, color_override: colorOverride } : s,
          ),
        },
      { revalidate: false },
    );
  }

  async function save(values: Theme) {
    // Store only keys that differ from the saved site theme, same as the Colors tab.
    const diff: Partial<Theme> = {};
    for (const k of Object.keys(values) as (keyof Theme)[]) {
      if (k === "font_style" ? values[k] !== effectiveTheme[k] : !sameColor(values[k], effectiveTheme[k])) diff[k] = values[k];
    }
    const next = Object.keys(diff).length ? diff : null;
    setOverrideOptimistically(next as Theme | null);
    try {
      await api.patch(`/couple/api/website/sections/${section.section_id}`, { color_override: next });
      toast.success("Section colors saved");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save section colors");
    } finally {
      mutate(SECTIONS_KEY);
    }
  }

  async function clearOverride() {
    setOverrideOptimistically(null);
    try {
      await api.patch(`/couple/api/website/sections/${section.section_id}`, { color_override: null });
      toast.success("Section now uses the site theme");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to reset section colors");
    } finally {
      mutate(SECTIONS_KEY);
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant={hasOverride ? "secondary" : "outline"}>
          <Palette className="size-3" /> Custom colors
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(20rem,calc(100vw-2rem))]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(save)} className="flex flex-col gap-4">
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
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="sans">Sans</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-disabled={!hasOverride}
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                onClick={() => hasOverride && clearOverride()}
              >
                Use site theme
              </Button>
              <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

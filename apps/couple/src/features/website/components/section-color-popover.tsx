"use client";

import { useForm } from "react-hook-form";
import { Palette } from "lucide-react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@mongkolka/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { api, ApiError } from "@/lib/api";
import type { Theme, WebsiteSection } from "../data/schema";

const SECTIONS_KEY = "/couple/api/website/sections";

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

  async function save(values: Theme) {
    try {
      await api.patch(`/couple/api/website/sections/${section.section_id}`, { color_override: values });
      toast.success("Section colors saved");
      mutate(SECTIONS_KEY);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save section colors");
    }
  }

  async function clearOverride() {
    try {
      await api.patch(`/couple/api/website/sections/${section.section_id}`, { color_override: null });
      toast.success("Reset to template colors");
      mutate(SECTIONS_KEY);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to reset section colors");
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant={hasOverride ? "secondary" : "outline"}>
          <Palette className="size-3" /> Custom colors
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
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
                disabled={!hasOverride}
                onClick={clearOverride}
              >
                Use template default
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

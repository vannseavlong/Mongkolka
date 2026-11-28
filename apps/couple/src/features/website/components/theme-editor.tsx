"use client";

import { useEffect } from "react";
import { DECOR_KEYS, FONT_KEYS, FONT_PRESETS, FONT_ROLES, FONT_STYLES, fontStack, PATTERN_OPTIONS, resolveDecor, sameColor, THEME_PRESETS } from "@mongkolka/templates";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Switch } from "@mongkolka/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { api, ApiError } from "@/lib/api";
import type { Theme } from "../data/schema";
import { FONT_PRESET_KEYS, THEME_PRESET_KEYS, isPresetActive, presetPatch } from "../lib/design-presets";
import { ContrastNote } from "./contrast-note";
import { PresetGrid } from "./preset-grid";

/** Optional choices: empty means "keep the template's own". */
const CHOICE_KEYS = [...FONT_KEYS, ...DECOR_KEYS] as const;
/** Select cannot hold an empty value, so "template default" has its own. */
const TEMPLATE_CHOICE = "default";

export function ThemeEditor({
  theme,
  templateDefault,
  skin,
  onPreview,
}: {
  /** Resolved site theme (template default + saved override). */
  theme: Theme;
  /** The template's own theme, what "Reset to template" returns to. */
  templateDefault: Theme;
  /** The template's skin, which decides what is decorated by default. */
  skin: string | null | undefined;
  /** Fired on every field change, before Save — lets the caller reflect
   * in-progress edits in the live preview instead of the couple having to
   * save-and-wait to see a color take effect. */
  onPreview?: (theme: Theme | null) => void;
}) {
  const form = useForm<Theme>({ values: theme });
  const watched = useWatch({ control: form.control });

  useEffect(() => {
    // form.getValues() (not the `theme` prop) so this only reacts to actual
    // field edits (via `watched`) — depending on `theme` directly would rerun
    // on every parent render, since index.tsx recreates that object each time.
    onPreview?.(form.getValues());
  }, [watched, form, onPreview]);

  function applyPreset(patch: Partial<Theme>) {
    for (const [key, value] of Object.entries(patch)) form.setValue(key as keyof Theme, value, { shouldDirty: true });
  }

  function previewPreset(patch: Partial<Theme>) {
    onPreview?.({ ...form.getValues(), ...patch });
  }

  function endPreview() {
    onPreview?.(form.getValues());
  }

  // Drop the unsaved preview when the editor goes away (panel collapsed,
  // template switched), including a hover preview still in progress.
  useEffect(() => () => onPreview?.(null), [onPreview]);

  async function onSubmit(values: Theme) {
    // Partial override. The three colors are a readable set (text on bg), so
    // they are stored together whenever any differs from the template; font is
    // independent. Untouched parts keep following the template.
    const override: Partial<Theme> = {};
    const palette = ["bg_color", "text_color", "accent_color"] as const;
    if (palette.some((k) => !sameColor(values[k], templateDefault[k]))) {
      for (const k of palette) override[k] = values[k];
    }
    if (values.font_style !== templateDefault.font_style) override.font_style = values.font_style;
    for (const k of CHOICE_KEYS) if (values[k]) override[k] = values[k];
    try {
      await api.patch("/couple/api/website/theme", { theme_override: override });
      toast.success("Design saved");
      mutate("/couple/api/website/settings");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save the design");
    }
  }

  // The API rejects theme_override: null (400), so "no override" is saved as {}.
  async function resetToTemplate() {
    try {
      await api.patch("/couple/api/website/theme", { theme_override: {} });
      form.reset({ ...templateDefault, ...Object.fromEntries(CHOICE_KEYS.map((k) => [k, templateDefault[k] ?? ""])) });
      toast.success("Design reset to the template");
      mutate("/couple/api/website/settings");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to reset the design");
    }
  }

  const current = form.getValues();
  const themePresets = THEME_PRESETS.map((preset) => ({
    id: preset.id,
    name: preset.name,
    patch: presetPatch(THEME_PRESET_KEYS, preset.theme),
    active: isPresetActive(THEME_PRESET_KEYS, preset.theme, current),
  }));
  // "Template default" clears every font choice, so a couple can get back without resetting colors.
  const templateFonts = { font_style: templateDefault.font_style, ...Object.fromEntries(FONT_KEYS.map((k) => [k, templateDefault[k]])) };
  const fontPresets = [{ id: "template", name: "Template default", fonts: templateFonts as Partial<Theme> }, ...FONT_PRESETS].map((preset) => ({
    id: preset.id,
    name: preset.name,
    patch: presetPatch(FONT_PRESET_KEYS, preset.fonts),
    active: isPresetActive(FONT_PRESET_KEYS, preset.fonts, current),
  }));
  const patchOf = (list: { id: string; patch: Partial<Theme> }[], id: string) => list.find((p) => p.id === id)?.patch ?? {};
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">Theme presets</legend>
          <p className="text-xs text-muted-foreground">Colors and background. Your fonts stay. Hover or focus to preview, click to use, then Save.</p>
          <PresetGrid
            tiles={themePresets.map(({ id, name, active, patch }) => ({
              id,
              name,
              active,
              sample: (
                <span className="flex h-8 items-center justify-between rounded border px-2" style={{ background: patch.bg_color, color: patch.text_color }}>
                  <span className="text-sm font-semibold">Aa កខ</span>
                  <span className="size-3 rounded-full" style={{ background: patch.accent_color }} />
                </span>
              ),
            }))}
            onPick={(id) => applyPreset(patchOf(themePresets, id))}
            onPreview={(id) => previewPreset(patchOf(themePresets, id))}
            onPreviewEnd={endPreview}
          />
        </fieldset>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
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
          </div>
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-sm font-medium">Background</legend>
            <FormField
              control={form.control}
              name="pattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pattern</FormLabel>
                  <Select value={field.value || TEMPLATE_CHOICE} onValueChange={(v) => field.onChange(v === TEMPLATE_CHOICE ? "" : v)}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TEMPLATE_CHOICE}>Template default</SelectItem>
                      {PATTERN_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="corners"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-3">
                  <FormLabel>Gold corners</FormLabel>
                  <FormControl>
                    <Switch checked={resolveDecor({ corners: field.value }, skin).corners} onCheckedChange={(on) => field.onChange(on ? "on" : "off")} />
                  </FormControl>
                </FormItem>
              )}
            />
          </fieldset>
        </div>
        <fieldset className="flex flex-col gap-2 border-t pt-4">
          <legend className="mb-1 text-sm font-medium">Font presets</legend>
          <p className="text-xs text-muted-foreground">Fonts only. Your colors and background stay.</p>
          <PresetGrid
            tiles={fontPresets.map(({ id, name, active, patch }) => {
              const family = patch.font_style === "serif" ? "serif" : "sans-serif";
              return {
                id,
                name,
                active,
                sample: (
                  <span className="flex h-8 items-center justify-between gap-1 overflow-hidden rounded bg-muted px-2 text-sm" style={{ fontFamily: family }}>
                    <span style={{ fontFamily: fontStack("font_en_heading", patch.font_en_heading) ?? undefined }}>Aa</span>
                    <span style={{ fontFamily: fontStack("font_kh_heading", patch.font_kh_heading) ?? undefined }}>កខ</span>
                    <span style={{ fontFamily: fontStack("font_en_script", patch.font_en_script) ?? undefined }}>Love</span>
                  </span>
                ),
              };
            })}
            onPick={(id) => applyPreset(patchOf(fontPresets, id))}
            onPreview={(id) => previewPreset(patchOf(fontPresets, id))}
            onPreviewEnd={endPreview}
          />
        </fieldset>
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm font-medium">Each font</legend>
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
          {FONT_ROLES.map((role) => (
            <FormField
              key={role.key}
              control={form.control}
              name={role.key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{role.label}</FormLabel>
                  <Select value={field.value || TEMPLATE_CHOICE} onValueChange={(v) => field.onChange(v === TEMPLATE_CHOICE ? "" : v)}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TEMPLATE_CHOICE}>Template default</SelectItem>
                      {role.options.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name} <span style={{ fontFamily: fontStack(role.key, option.id) ?? undefined }}>{role.sample}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          ))}
        </fieldset>
        <ContrastNote theme={{ bg_color: current.bg_color, text_color: current.text_color, accent_color: current.accent_color }} />
        <div className="flex flex-wrap gap-2">
          <Button type="submit" aria-disabled={form.formState.isSubmitting}
            onClick={(e) => form.formState.isSubmitting && e.preventDefault()}
            className="w-fit aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            Save design
          </Button>
          <Button type="button" variant="outline" onClick={resetToTemplate}>
            Reset to template
          </Button>
        </div>
      </form>
    </Form>
  );
}

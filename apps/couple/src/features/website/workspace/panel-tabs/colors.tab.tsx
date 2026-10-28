"use client";

import { useState } from "react";
import { toast } from "sonner";
import { contrastRatio, FONT_STYLES, MIN_TEXT_CONTRAST, resolveTheme } from "@mongkolka/templates";
import type { Theme } from "@mongkolka/templates";
import { Button } from "@mongkolka/ui/button";
import { Input } from "@mongkolka/ui/input";
import { Label } from "@mongkolka/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import type { SectionPanelContext, SectionPanelTab } from "./types";

const FIELDS: { key: keyof Theme; label: string }[] = [
  { key: "bg_color", label: "Background" },
  { key: "text_color", label: "Text" },
  { key: "accent_color", label: "Accent" },
];

function ColorsPanel({ context }: { context: SectionPanelContext }) {
  const { section, template, themeOverride, patchSection } = context;
  const inherited = resolveTheme(template.default_theme, themeOverride, null);
  const override = section.color_override ?? null;
  const [busy, setBusy] = useState(false);
  // Pickers fire on every drag step; keep the in-progress value here and save
  // once on blur/commit instead of PATCHing per step.
  const [drafts, setDrafts] = useState<Partial<Theme>>({});

  async function save(next: Partial<Theme> | null, message: string) {
    if (busy) return;
    setBusy(true);
    const ok = await patchSection({ color_override: next }, "Failed to save section colors");
    setBusy(false);
    if (ok && message) toast.success(message);
  }

  // Only keys that differ from what the section would inherit are stored, so
  // a later site-wide change still flows through for untouched keys.
  function setKey(key: keyof Theme, value: string) {
    const next: Partial<Theme> = { ...(override ?? {}) };
    if (value === inherited[key]) delete next[key];
    else next[key] = value;
    setDrafts((d) => {
      const rest = { ...d };
      delete rest[key];
      return rest;
    });
    return save(Object.keys(next).length ? next : null, "");
  }

  const effective = resolveTheme(template.default_theme, themeOverride, override);
  const ratio = contrastRatio(effective.text_color, effective.bg_color);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {override
          ? "This section has its own colors. Reset to follow the site theme again."
          : "This section follows the site theme. Change a color to give it its own."}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FIELDS.map(({ key, label }) => {
          const overridden = !!override && override[key] !== undefined;
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={`sec-${section.section_id}-${key}`} className="flex items-center justify-between">
                {label}
                <span className="text-xs font-normal text-muted-foreground">{overridden ? "Custom" : "Site theme"}</span>
              </Label>
              <Input
                id={`sec-${section.section_id}-${key}`}
                type="color"
                value={drafts[key] ?? effective[key]}
                aria-disabled={busy}
                onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                onBlur={(e) => drafts[key] !== undefined && e.target.value !== effective[key] && setKey(key, e.target.value)}
              />
              {overridden && (
                <p className="text-xs text-muted-foreground">
                  Site theme: <span className="inline-block size-2.5 rounded-sm border align-middle" style={{ background: inherited[key] }} /> {inherited[key]}
                </p>
              )}
            </div>
          );
        })}
        <div className="flex flex-col gap-1.5">
          <Label>Font style</Label>
          <Select
            value={effective.font_style}
            onValueChange={(v) => setKey("font_style", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_STYLES.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {override?.font_style !== undefined && (
            <p className="text-xs text-muted-foreground">Site theme: {inherited.font_style}</p>
          )}
        </div>
      </div>
      <p role="status" className={ratio < MIN_TEXT_CONTRAST ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
        Text on background contrast {ratio.toFixed(1)}:1
        {ratio < MIN_TEXT_CONTRAST ? " (may be hard to read)" : " (good)"}
      </p>
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        aria-disabled={!override || busy}
        onClick={() => override && save(null, "Section now uses the site theme")}
      >
        Use site theme
      </Button>
    </div>
  );
}

export const tab: SectionPanelTab = {
  id: "colors",
  label: "Colors",
  order: 40,
  Component: ({ context }) => <ColorsPanel key={context.section.section_id} context={context} />,
};

"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FONT_STYLES, normalizeColor, resolveTheme, sameColor } from "@mongkolka/templates";
import type { PartialTheme, Theme } from "@mongkolka/templates";
import { Button } from "@mongkolka/ui/button";
import { Input } from "@mongkolka/ui/input";
import { Label } from "@mongkolka/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { useApiQuery } from "@/lib/use-api-query";
import { ContrastNote } from "../../components/contrast-note";
import type { WebsiteSettings } from "../../data/schema";
import type { SectionPanelContext, SectionPanelTab } from "./types";

const FIELDS: { key: "bg_color" | "text_color" | "accent_color"; label: string }[] = [
  { key: "bg_color", label: "Background" },
  { key: "text_color", label: "Text" },
  { key: "accent_color", label: "Accent" },
];
const DEBOUNCE_MS = 600;

function ColorsPanel({ context }: { context: SectionPanelContext }) {
  const { section, template, themeOverride, patchSection } = context;
  // Prune against the SAVED site theme, not the unsaved draft on the canvas.
  const { data: settingsData } = useApiQuery<{ settings: WebsiteSettings }>("/couple/api/website/settings");
  const savedOverride = settingsData ? (settingsData.settings.theme_override ?? null) : themeOverride;
  const inherited = resolveTheme(template.default_theme, savedOverride, null);
  const override = section.color_override ?? null;

  // Saves are serialized through a promise chain. `latest` is the override as
  // of the last queued save (the SWR cache only updates when a queued patch
  // starts), so back-to-back edits build on each other instead of the stale prop.
  const chain = useRef<Promise<unknown>>(Promise.resolve());
  const latest = useRef<{ value: PartialTheme | null } | null>(null);
  const [pending, setPending] = useState(0);
  const [drafts, setDrafts] = useState<Partial<Theme>>({});
  // Keys edited but not yet committed (so blur after Enter does not save twice).
  const dirty = useRef(new Set<keyof Theme>());
  const timers = useRef<Partial<Record<keyof Theme, ReturnType<typeof setTimeout>>>>({});

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach((id) => clearTimeout(id));
  }, []);

  function enqueue(next: PartialTheme | null, onDone: () => void, message?: string) {
    latest.current = { value: next };
    setPending((n) => n + 1);
    chain.current = chain.current
      .then(() => patchSection({ color_override: next }, "Failed to save section colors"))
      .then((ok) => {
        if (ok && message) toast.success(message);
      })
      .finally(() => {
        onDone();
        setPending((n) => {
          if (n === 1) latest.current = null;
          return n - 1;
        });
      });
  }

  function clearTimer(key: keyof Theme) {
    clearTimeout(timers.current[key]);
    delete timers.current[key];
  }

  function dropDraft(key: keyof Theme, onlyIfValue?: string) {
    setDrafts((d) => {
      if (d[key] === undefined || (onlyIfValue !== undefined && d[key] !== onlyIfValue)) return d;
      const rest = { ...d };
      delete rest[key];
      return rest;
    });
  }

  // Only keys that differ from the saved site theme are stored, so later
  // site-wide changes still flow through for untouched keys.
  function commit(key: keyof Theme, value: string) {
    clearTimer(key);
    dirty.current.delete(key);
    const base = latest.current ? latest.current.value : override;
    const next: PartialTheme = { ...(base ?? {}) };
    const same = key === "font_style" ? value === inherited[key] : sameColor(value, inherited[key]);
    if (same) delete next[key];
    else next[key] = value;
    enqueue(Object.keys(next).length ? next : null, () => dropDraft(key, value));
  }

  function edit(key: keyof Theme, value: string) {
    dirty.current.add(key);
    setDrafts((d) => ({ ...d, [key]: value }));
    clearTimer(key);
    timers.current[key] = setTimeout(() => commit(key, value), DEBOUNCE_MS);
  }

  function cancel(key: keyof Theme) {
    clearTimer(key);
    dirty.current.delete(key);
    dropDraft(key);
  }

  function resetToSiteTheme() {
    if (!resettable) return;
    (Object.keys(timers.current) as (keyof Theme)[]).forEach(clearTimer);
    dirty.current.clear();
    setDrafts({});
    enqueue(null, () => {}, "Section now uses the site theme");
  }

  const effective = resolveTheme(template.default_theme, themeOverride, override);
  const shown = { ...effective, ...drafts };
  const resettable = !!override || pending > 0 || Object.keys(drafts).length > 0;

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
          const id = `sec-${section.section_id}-${key}`;
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={id} className="flex items-center justify-between">
                {label}
                <span className="text-xs font-normal text-muted-foreground">{overridden ? "Custom" : "Site theme"}</span>
              </Label>
              <Input
                id={id}
                type="color"
                value={normalizeColor(shown[key])}
                onChange={(e) => edit(key, e.target.value)}
                onBlur={(e) => dirty.current.has(key) && commit(key, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (dirty.current.has(key)) commit(key, e.currentTarget.value);
                  } else if (e.key === "Escape" && dirty.current.has(key)) {
                    e.preventDefault();
                    e.stopPropagation();
                    cancel(key);
                  }
                }}
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
          <Label htmlFor={`sec-${section.section_id}-font`}>Font style</Label>
          <Select value={shown.font_style} onValueChange={(v) => commit("font_style", v)}>
            <SelectTrigger id={`sec-${section.section_id}-font`} aria-label="Font style" className="w-full">
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
      <p className="text-xs text-muted-foreground">Enter saves a color, Escape discards it. Edits also save after a short pause.</p>
      <ContrastNote theme={shown} />
      <Button
        type="button"
        variant="outline"
        className="w-fit aria-disabled:pointer-events-none aria-disabled:opacity-50"
        aria-disabled={!resettable}
        onClick={resetToSiteTheme}
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

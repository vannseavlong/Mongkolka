"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { mutate } from "swr";
import { ChevronDown, Copy } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@mongkolka/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mongkolka/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mongkolka/ui/tooltip";
import { api, ApiError } from "@/lib/api";
import type { Theme, ThemeTokens } from "../data/schema";
import { ColorField } from "./color-field";

const themeTokensFormSchema = z.object({
  background: z.string().optional(),
  foreground: z.string().optional(),
  card: z.string().optional(),
  primary: z.string().optional(),
  primaryForeground: z.string().optional(),
  secondary: z.string().optional(),
  muted: z.string().optional(),
  mutedForeground: z.string().optional(),
  accent: z.string().optional(),
  accentForeground: z.string().optional(),
  border: z.string().optional(),
  ring: z.string().optional(),
  sidebar: z.string().optional(),
  sidebarForeground: z.string().optional(),
  sidebarPrimary: z.string().optional(),
  sidebarPrimaryForeground: z.string().optional(),
  sidebarAccent: z.string().optional(),
  sidebarAccentForeground: z.string().optional(),
  sidebarBorder: z.string().optional(),
  sidebarRing: z.string().optional(),
});

const themeFormSchema = z.object({
  theme_id: z
    .string()
    .min(1, "Theme ID is required")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  tokens: themeTokensFormSchema,
});

type ThemeFormValues = z.infer<typeof themeFormSchema>;

// Sage-inspired starting point for a brand-new theme — the sidebar section
// is left blank so it mirrors the core colors below until an admin
// customizes it (see buildTokens()).
const DEFAULT_TOKENS: ThemeFormValues["tokens"] = {
  background: "#f5ebdd",
  foreground: "#3b3b3b",
  card: "#fffdf9",
  primary: "#6f8f72",
  primaryForeground: "#fffdf9",
  secondary: "#ede1d1",
  muted: "#ede1d1",
  mutedForeground: "#6b6b6b",
  accent: "#c9a86a",
  accentForeground: "#3b3b3b",
  border: "rgba(59, 59, 59, 0.12)",
  ring: "#6f8f72",
  sidebar: "",
  sidebarForeground: "",
  sidebarPrimary: "",
  sidebarPrimaryForeground: "",
  sidebarAccent: "",
  sidebarAccentForeground: "",
  sidebarBorder: "",
  sidebarRing: "",
};

function defaultFormValues(currentRow?: Theme): ThemeFormValues {
  if (!currentRow) {
    return { theme_id: "", name: "", description: "", tokens: DEFAULT_TOKENS };
  }
  const t = currentRow.tokens ?? {};
  return {
    theme_id: currentRow.theme_id,
    name: currentRow.name,
    description: currentRow.description ?? "",
    tokens: {
      background: t.background ?? "",
      foreground: t.foreground ?? "",
      card: t.card ?? "",
      primary: t.primary ?? "",
      primaryForeground: t.primaryForeground ?? "",
      secondary: t.secondary ?? "",
      muted: t.muted ?? "",
      mutedForeground: t.mutedForeground ?? "",
      accent: t.accent ?? "",
      accentForeground: t.accentForeground ?? "",
      border: t.border ?? "",
      ring: t.ring ?? "",
      sidebar: t.sidebar ?? "",
      sidebarForeground: t.sidebarForeground ?? "",
      sidebarPrimary: t.sidebarPrimary ?? "",
      sidebarPrimaryForeground: t.sidebarPrimaryForeground ?? "",
      sidebarAccent: t.sidebarAccent ?? "",
      sidebarAccentForeground: t.sidebarAccentForeground ?? "",
      sidebarBorder: t.sidebarBorder ?? "",
      sidebarRing: t.sidebarRing ?? "",
    },
  };
}

// Expands the 20 form-exposed fields into the full 24-key ThemeTokens shape:
// a handful of "paired" fields (cardForeground, popover, ...) always mirror a
// core color, and any sidebar field left blank falls back to its matching
// core color so admins don't have to fill in every field.
function buildTokens(values: ThemeFormValues): ThemeTokens {
  const t = values.tokens;
  return {
    background: t.background,
    foreground: t.foreground,
    card: t.card,
    cardForeground: t.foreground,
    popover: t.card,
    popoverForeground: t.foreground,
    primary: t.primary,
    primaryForeground: t.primaryForeground,
    secondary: t.secondary,
    secondaryForeground: t.foreground,
    muted: t.muted,
    mutedForeground: t.mutedForeground,
    accent: t.accent,
    accentForeground: t.accentForeground,
    border: t.border,
    inputBackground: t.card,
    ring: t.ring,
    sidebar: t.sidebar || t.card,
    sidebarForeground: t.sidebarForeground || t.foreground,
    sidebarPrimary: t.sidebarPrimary || t.primary,
    sidebarPrimaryForeground: t.sidebarPrimaryForeground || t.primaryForeground,
    sidebarAccent: t.sidebarAccent || t.accent,
    sidebarAccentForeground: t.sidebarAccentForeground || t.accentForeground,
    sidebarBorder: t.sidebarBorder || t.border,
    sidebarRing: t.sidebarRing || t.ring,
  };
}

// The 20 form-exposed token keys — a paste can hand back either this exact
// shape or the full 24-key stored ThemeTokens (with the derived pairs like
// cardForeground/popover included); unknown keys are simply ignored.
const TOKEN_FORM_KEYS = Object.keys(
  themeTokensFormSchema.shape,
) as (keyof ThemeFormValues["tokens"])[];

// Accepts either `{ background, primary, ... }` directly or a full theme
// record shaped `{ name, description, tokens: {...} }` — unwraps to
// whichever object actually holds the color keys.
function extractTokenCandidate(parsed: unknown): Record<string, unknown> | null {
  if (typeof parsed !== "object" || parsed === null) return null;
  const record = parsed as Record<string, unknown>;
  if (typeof record.tokens === "object" && record.tokens !== null) {
    return record.tokens as Record<string, unknown>;
  }
  return record;
}

export function ThemesActionDialog({
  open,
  onOpenChange,
  currentRow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Theme;
}) {
  const isEdit = !!currentRow;

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: defaultFormValues(currentRow),
  });

  // Re-seed the form whenever the dialog opens (create vs. edit share this
  // component, so a fresh reset is needed each time rather than only on
  // first mount).
  useEffect(() => {
    if (open) {
      form.reset(defaultFormValues(currentRow));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentRow]);

  const card = useWatch({ control: form.control, name: "tokens.card" });
  const foreground = useWatch({ control: form.control, name: "tokens.foreground" });
  const primary = useWatch({ control: form.control, name: "tokens.primary" });
  const primaryForeground = useWatch({ control: form.control, name: "tokens.primaryForeground" });
  const accent = useWatch({ control: form.control, name: "tokens.accent" });
  const accentForeground = useWatch({ control: form.control, name: "tokens.accentForeground" });
  const border = useWatch({ control: form.control, name: "tokens.border" });
  const ring = useWatch({ control: form.control, name: "tokens.ring" });

  function handleOpenChange(state: boolean) {
    if (!state) form.reset();
    onOpenChange(state);
  }

  async function copyTokens() {
    const tokens = buildTokens(form.getValues());
    try {
      await navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
      toast.success("Tokens copied — edit with an AI, then paste (⌘V / Ctrl+V) anywhere in this dialog");
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }

  // Lets an admin paste a full tokens JSON blob (e.g. one an AI generated
  // from the copied sample) anywhere in the dialog and have it fill every
  // color field at once, instead of pasting hex values one by one. A normal
  // paste of a single value (a hex code into one field) isn't valid JSON, so
  // it falls through untouched and the browser's default paste still applies.
  function handleFormPaste(event: React.ClipboardEvent<HTMLFormElement>) {
    const text = event.clipboardData.getData("text");
    if (!text) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return;
    }

    const candidate = extractTokenCandidate(parsed);
    if (!candidate) return;

    let applied = 0;
    for (const key of TOKEN_FORM_KEYS) {
      const value = candidate[key];
      if (typeof value === "string" && value.trim()) {
        form.setValue(`tokens.${key}`, value, { shouldDirty: true });
        applied++;
      }
    }

    if (applied > 0) {
      event.preventDefault();
      toast.success(`Pasted ${applied} color${applied === 1 ? "" : "s"} from clipboard`);
    }
  }

  async function onSubmit(values: ThemeFormValues) {
    const tokens = buildTokens(values);
    try {
      if (isEdit && currentRow) {
        await api.patch(`/admin/api/themes/${currentRow.theme_id}`, {
          name: values.name,
          description: values.description,
          tokens,
        });
        toast.success("Theme updated");
      } else {
        await api.post("/admin/api/themes", {
          theme_id: values.theme_id,
          name: values.name,
          description: values.description,
          tokens,
        });
        toast.success("Theme created");
      }
      mutate("/admin/api/themes");
      handleOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : `Failed to ${isEdit ? "update" : "create"} theme`,
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit theme" : "New theme"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="theme-form"
            onSubmit={form.handleSubmit(onSubmit)}
            onPaste={handleFormPaste}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="theme_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme ID</FormLabel>
                  <FormControl>
                    <Input placeholder="midnight_garden" disabled={isEdit} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input placeholder="Midnight Garden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Shown to admins picking a theme" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Core colors</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={copyTokens}
                    >
                      <Copy className="size-4" />
                      <span className="sr-only">Copy tokens as JSON</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Copy tokens as JSON — edit with an AI, then paste (⌘V / Ctrl+V) anywhere in this
                    dialog to fill every field
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ColorField
                  control={form.control}
                  name="tokens.background"
                  label="Background"
                  hint="Page background"
                />
                <ColorField
                  control={form.control}
                  name="tokens.foreground"
                  label="Foreground"
                  hint="Main text color"
                />
                <ColorField
                  control={form.control}
                  name="tokens.card"
                  label="Card"
                  hint="Card & panel backgrounds"
                />
                <ColorField
                  control={form.control}
                  name="tokens.primary"
                  label="Primary"
                  hint="Buttons, links & highlights"
                />
                <ColorField
                  control={form.control}
                  name="tokens.primaryForeground"
                  label="Primary foreground"
                  hint="Text on primary buttons"
                />
                <ColorField
                  control={form.control}
                  name="tokens.secondary"
                  label="Secondary"
                  hint="Secondary buttons & tags"
                />
                <ColorField
                  control={form.control}
                  name="tokens.muted"
                  label="Muted"
                  hint="Subtle backgrounds, input fields"
                />
                <ColorField
                  control={form.control}
                  name="tokens.mutedForeground"
                  label="Muted foreground"
                  hint="Placeholder & helper text"
                />
                <ColorField
                  control={form.control}
                  name="tokens.accent"
                  label="Accent"
                  hint="Hover states & accents"
                />
                <ColorField
                  control={form.control}
                  name="tokens.accentForeground"
                  label="Accent foreground"
                  hint="Text on accent-colored elements"
                />
                <ColorField
                  control={form.control}
                  name="tokens.border"
                  label="Border"
                  hint="Borders & dividers"
                />
                <ColorField
                  control={form.control}
                  name="tokens.ring"
                  label="Ring"
                  hint="Focus outline around inputs"
                />
              </div>
            </div>

            {/* Remounted (via key) each time the dialog opens so it always starts collapsed. */}
            <Collapsible key={open ? "advanced-open" : "advanced-closed"} defaultOpen={false}>
              <CollapsibleTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="group w-fit gap-1 px-0">
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                  Advanced: sidebar colors
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-3 pt-3">
                <p className="text-xs text-muted-foreground">
                  Leave blank to mirror the matching core color above.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <ColorField
                    control={form.control}
                    name="tokens.sidebar"
                    label="Sidebar"
                    hint="Sidebar background"
                    fallback={card}
                  />
                  <ColorField
                    control={form.control}
                    name="tokens.sidebarForeground"
                    label="Sidebar foreground"
                    hint="Sidebar text"
                    fallback={foreground}
                  />
                  <ColorField
                    control={form.control}
                    name="tokens.sidebarPrimary"
                    label="Sidebar primary"
                    hint="Active menu item"
                    fallback={primary}
                  />
                  <ColorField
                    control={form.control}
                    name="tokens.sidebarPrimaryForeground"
                    label="Sidebar primary foreground"
                    hint="Text on active menu item"
                    fallback={primaryForeground}
                  />
                  <ColorField
                    control={form.control}
                    name="tokens.sidebarAccent"
                    label="Sidebar accent"
                    hint="Menu item hover"
                    fallback={accent}
                  />
                  <ColorField
                    control={form.control}
                    name="tokens.sidebarAccentForeground"
                    label="Sidebar accent foreground"
                    hint="Text on menu item hover"
                    fallback={accentForeground}
                  />
                  <ColorField
                    control={form.control}
                    name="tokens.sidebarBorder"
                    label="Sidebar border"
                    hint="Sidebar dividers"
                    fallback={border}
                  />
                  <ColorField
                    control={form.control}
                    name="tokens.sidebarRing"
                    label="Sidebar ring"
                    hint="Sidebar focus outline"
                    fallback={ring}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="theme-form" disabled={form.formState.isSubmitting}>
            {isEdit ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

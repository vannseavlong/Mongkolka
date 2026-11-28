"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SEAL_TEXT_MAX } from "@mongkolka/templates";
import { Button } from "@mongkolka/ui/button";
import { Input } from "@mongkolka/ui/input";
import { Label } from "@mongkolka/ui/label";
import { ApiError } from "@/lib/api";
import type { WebsiteSection } from "../data/schema";
import { asRecord, saveContent } from "../lib/section-content-save";

const str = (v: unknown) => (typeof v === "string" ? v : "");
const COLORS = [
  { key: "sealColor", label: "Seal color", auto: "Theme accent" },
  { key: "sealTextColor", label: "Letter color", auto: "Automatic" },
] as const;

/** The envelope's seal badge. Empty values stay automatic; saving keeps the rest of the hero content (banners). */
export function SealBadgeForm({ section }: { section: WebsiteSection }) {
  const content = asRecord(section.content);
  const [values, setValues] = useState(() => ({ sealText: str(content.sealText), sealColor: str(content.sealColor), sealTextColor: str(content.sealTextColor) }));
  const [saving, setSaving] = useState(false);
  const id = `seal-${section.section_id}`;

  async function save() {
    setSaving(true);
    try {
      await saveContent(section.section_id, {
        ...asRecord(section.content),
        sealText: values.sealText.trim() || undefined,
        sealColor: values.sealColor || undefined,
        sealTextColor: values.sealTextColor || undefined,
      });
      toast.success("Badge updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save the badge");
    } finally {
      setSaving(false);
    }
  }

  return (
    <fieldset className="flex flex-col gap-3 rounded-md border p-3">
      <legend className="px-1 text-sm font-medium">Envelope badge</legend>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-text`}>Badge text</Label>
        <Input id={`${id}-text`} value={values.sealText} maxLength={SEAL_TEXT_MAX} placeholder="Your initials" onChange={(e) => setValues((v) => ({ ...v, sealText: e.target.value }))} />
        <p className="text-xs text-muted-foreground">Up to {SEAL_TEXT_MAX} characters. Empty uses your initials.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {COLORS.map(({ key, label, auto }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-${key}`}>{label}</Label>
            {/* A color input cannot be empty, so "automatic" is its own state with a button back to it. */}
            <Input id={`${id}-${key}`} type="color" value={values[key] || "#888888"} className={values[key] ? "" : "opacity-40"} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))} />
            {values[key] ? (
              <Button type="button" variant="ghost" size="sm" className="h-7 w-fit px-2 text-xs" onClick={() => setValues((v) => ({ ...v, [key]: "" }))}>
                Use {auto.toLowerCase()}
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">{auto}</p>
            )}
          </div>
        ))}
      </div>
      <Button type="button" size="sm" className="w-fit" disabled={saving} onClick={() => void save()}>
        Save badge
      </Button>
    </fieldset>
  );
}

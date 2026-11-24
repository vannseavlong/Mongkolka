"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { ImagePlus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { DialogFooter } from "@mongkolka/ui/dialog";
import { DatePicker } from "@mongkolka/ui/date-picker";
import { Input } from "@mongkolka/ui/input";
import { Label } from "@mongkolka/ui/label";
import { Textarea } from "@mongkolka/ui/textarea";
import { api, ApiError } from "@/lib/api";
import type { PreviewProfile } from "../lib/build-content";
import {
  profileSectionErrors,
  profileSectionPayload,
  profileSectionValues,
  type ProfileSectionKey,
  type ProfileSectionValues,
} from "../lib/profile-section-fields";
import { PROFILE_KEY } from "./asset-library-api";
import { AssetPicker } from "./asset-picker";

type FieldSpec = { name: string; label: string; type?: string; placeholder?: string; hint?: string; multiline?: boolean };

const FIELDS: Record<ProfileSectionKey, FieldSpec[]> = {
  hero: [
    { name: "partner1_name", label: "Partner 1" },
    { name: "partner2_name", label: "Partner 2" },
    { name: "wedding_date", label: "Wedding date", type: "date" },
  ],
  story: [{ name: "love_story", label: "Love story", multiline: true, placeholder: "How you met, the proposal, what this day means…" }],
  details: [
    { name: "ceremony_time", label: "Ceremony time", placeholder: "9:00 AM" },
    { name: "ceremony_venue", label: "Ceremony venue" },
    { name: "ceremony_address", label: "Ceremony address", hint: "Used for the “Get directions” button." },
    { name: "reception_time", label: "Reception time", placeholder: "6:00 PM" },
    { name: "reception_venue", label: "Reception venue" },
    { name: "reception_address", label: "Reception address" },
    { name: "dress_code", label: "Dress code", placeholder: "e.g. Black tie · jewel tones welcome" },
    { name: "map_url", label: "Map link", placeholder: "https://maps.app.goo.gl/…", hint: "A Google Maps share link. https only." },
    { name: "venue_image_url", label: "Venue photo URL", placeholder: "https://…" },
  ],
};

/** Edit form for hero, story and details. Saves to the couple profile (their canonical home) and refreshes the canvas. */
export function ProfileSectionForm({ sectionKey, profile, onSaved }: { sectionKey: ProfileSectionKey; profile: PreviewProfile; onSaved: () => void }) {
  const [values, setValues] = useState<ProfileSectionValues>(() => profileSectionValues(sectionKey, profile));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerButtonRef = useRef<HTMLButtonElement>(null);

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = profileSectionErrors(sectionKey, values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      await api.patch(PROFILE_KEY, profileSectionPayload(sectionKey, values));
      await mutate(PROFILE_KEY);
      toast.success("Saved");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {FIELDS[sectionKey].map((f) => {
        const id = `profile-${f.name}`;
        const error = errors[f.name];
        const describedBy = error ? `${id}-error` : f.hint ? `${id}-hint` : undefined;
        return (
          <div key={f.name} className="flex flex-col gap-1.5">
            <Label htmlFor={id}>{f.label}</Label>
            {f.multiline ? (
              <Textarea id={id} rows={8} placeholder={f.placeholder} value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} aria-describedby={describedBy} />
            ) : (
              <div className="flex gap-2">
                {f.type === "date" ? (
                  <DatePicker id={id} value={values[f.name] ?? ""} onChange={(next) => set(f.name, next)} aria-invalid={!!error} aria-describedby={describedBy} />
                ) : (
                <Input
                  id={id}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={describedBy}
                />
                )}
                {f.name === "venue_image_url" && (
                  <Button ref={pickerButtonRef} type="button" variant="outline" onClick={() => setPickerOpen(true)}>
                    <ImagePlus className="size-4" /> Library
                  </Button>
                )}
              </div>
            )}
            {f.hint && !error && <p id={`${id}-hint`} className="text-xs text-muted-foreground">{f.hint}</p>}
            {error && <p id={`${id}-error`} role="alert" className="text-xs text-destructive">{error}</p>}
          </div>
        );
      })}
      <AssetPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        title="Choose a venue photo"
        multiple={false}
        returnFocusRef={pickerButtonRef}
        onConfirm={(urls) => urls[0] && set("venue_image_url", urls[0])}
      />
      <DialogFooter>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}

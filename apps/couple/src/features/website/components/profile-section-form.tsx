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

type FieldSpec = { name: string; label: string; type?: string; placeholder?: string; hint?: string; multiline?: boolean; narrow?: boolean };
type Group = { title?: string; fields: FieldSpec[] };

/** Fields grouped the way a couple thinks about them: one card per part of the day, then the place itself. */
const GROUPS: Record<ProfileSectionKey, Group[]> = {
  hero: [
    {
      fields: [
        { name: "partner1_name", label: "Partner 1" },
        { name: "partner2_name", label: "Partner 2" },
        { name: "wedding_date", label: "Wedding date", type: "date" },
      ],
    },
  ],
  details: [
    {
      title: "Ceremony",
      fields: [
        { name: "ceremony_time", label: "Time", placeholder: "9:00 AM", narrow: true },
        { name: "ceremony_venue", label: "Venue" },
        { name: "ceremony_address", label: "Address", placeholder: "Used for the directions button" },
      ],
    },
    {
      title: "Reception",
      fields: [
        { name: "reception_time", label: "Time", placeholder: "6:00 PM", narrow: true },
        { name: "reception_venue", label: "Venue" },
        { name: "reception_address", label: "Address" },
      ],
    },
    {
      title: "More",
      fields: [
        { name: "dress_code", label: "Dress code", placeholder: "e.g. Black tie" },
        { name: "map_url", label: "Map link", placeholder: "https://maps.app.goo.gl/…" },
        { name: "venue_image_url", label: "Venue photo", placeholder: "https://…" },
      ],
    },
  ],
};

/** Edit form for hero and details. Saves to the couple profile (their canonical home) and refreshes the canvas. */
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
      {GROUPS[sectionKey].map((group, gi) => (
        <fieldset key={group.title ?? gi} className={group.title ? "flex flex-col gap-3 rounded-lg border p-3" : "flex flex-col gap-3 border-0 p-0"}>
          {group.title && <legend className="px-1 text-sm font-semibold">{group.title}</legend>}
          {group.fields.map((f) => {
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
                        className={f.narrow ? "max-w-40" : undefined}
                      />
                    )}
                    {f.name === "venue_image_url" && (
                      <Button ref={pickerButtonRef} type="button" variant="outline" className="shrink-0" onClick={() => setPickerOpen(true)}>
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
        </fieldset>
      ))}
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

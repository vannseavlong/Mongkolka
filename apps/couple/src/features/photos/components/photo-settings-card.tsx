"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import { Input } from "@mongkolka/ui/input";
import { Label } from "@mongkolka/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { api, ApiError } from "@/lib/api";
import { PHOTO_CEILINGS, type PhotoSettings, type PhotoUploadMode } from "../data/schema";

const MODE_LABELS: Record<PhotoUploadMode, { label: string; hint: string }> = {
  off: { label: "Off", hint: "Guests can't upload photos." },
  pending: { label: "Review first", hint: "Photos stay hidden until you approve them." },
  auto: { label: "Show automatically", hint: "Photos appear on your site straight away." },
};

export const PROFILE_KEY = "/couple/api/profile";

export function PhotoSettingsCard({ settings }: { settings: PhotoSettings }) {
  const [mode, setMode] = useState<PhotoUploadMode>(settings.photo_uploads ?? "pending");
  const [perGuest, setPerGuest] = useState(String(settings.photo_max_per_guest ?? 5));
  const [sizeMb, setSizeMb] = useState(String(settings.photo_max_size_mb ?? 8));
  const [rate, setRate] = useState(String(settings.photo_rate_per_ip_per_hour ?? 30));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await api.patch(PROFILE_KEY, {
        photo_uploads: mode,
        photo_max_per_guest: Number(perGuest),
        photo_max_size_mb: Number(sizeMb),
        photo_rate_per_ip_per_hour: Number(rate),
      });
      await mutate(PROFILE_KEY);
      toast.success("Photo settings saved");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="text-lg font-semibold">Guest uploads</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Let guests add photos to your wedding website. You always keep the last word: hide or delete
        any photo below.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="photo-mode">When a guest uploads a photo</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as PhotoUploadMode)}>
            <SelectTrigger id="photo-mode" className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(MODE_LABELS) as PhotoUploadMode[]).map((m) => (
                <SelectItem key={m} value={m}>
                  {MODE_LABELS[m].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1.5 text-xs text-muted-foreground">{MODE_LABELS[mode].hint}</p>
        </div>

        <div>
          <Label htmlFor="photo-per-guest">Photos per guest</Label>
          <Input
            id="photo-per-guest"
            type="number"
            min={1}
            max={PHOTO_CEILINGS.maxPerGuest}
            value={perGuest}
            onChange={(e) => setPerGuest(e.target.value)}
            className="mt-1.5"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">Up to {PHOTO_CEILINGS.maxPerGuest}.</p>
        </div>
        <div>
          <Label htmlFor="photo-size">Largest photo (MB)</Label>
          <Input
            id="photo-size"
            type="number"
            min={1}
            max={PHOTO_CEILINGS.maxSizeMb}
            value={sizeMb}
            onChange={(e) => setSizeMb(e.target.value)}
            className="mt-1.5"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">Up to {PHOTO_CEILINGS.maxSizeMb} MB.</p>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="photo-rate">Uploads per hour from one connection</Label>
          <Input
            id="photo-rate"
            type="number"
            min={1}
            max={PHOTO_CEILINGS.ratePerIpPerHour}
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="mt-1.5 sm:max-w-48"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Guests at the venue share one Wi-Fi connection, so keep this generous (up to{" "}
            {PHOTO_CEILINGS.ratePerIpPerHour}).
          </p>
        </div>
      </div>

      <Button className="mt-5" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save settings"}
      </Button>
    </section>
  );
}

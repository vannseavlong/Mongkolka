"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { CheckCircle2, ShieldCheck, Zap, Ban } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Input } from "@mongkolka/ui/input";
import { Label } from "@mongkolka/ui/label";
import { api, ApiError } from "@/lib/api";
import { PHOTO_CEILINGS, type PhotoSettings, type PhotoUploadMode } from "../data/schema";

const MODES: { value: PhotoUploadMode; title: string; hint: string; icon: typeof Zap }[] = [
  {
    value: "pending",
    title: "Review first",
    hint: "Guest photos and wishes stay hidden until you approve them.",
    icon: ShieldCheck,
  },
  {
    value: "auto",
    title: "Show automatically",
    hint: "Everything appears on your website straight away. You can still hide or delete.",
    icon: Zap,
  },
  { value: "off", title: "Turned off", hint: "Guests can't send photos or wishes.", icon: Ban },
];

export const PROFILE_KEY = "/couple/api/profile";

function NumberField({
  id,
  label,
  unit,
  value,
  max,
  hint,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  max: number;
  hint: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-1.5">
        <Input
          id={id}
          type="number"
          min={1}
          max={max}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="pr-20"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
          {unit}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function PhotoSettingsCard({ settings }: { settings: PhotoSettings }) {
  const [mode, setMode] = useState<PhotoUploadMode>(settings.photo_uploads ?? "pending");
  const [perGuest, setPerGuest] = useState(String(settings.photo_max_per_guest ?? 5));
  const [sizeMb, setSizeMb] = useState(String(settings.photo_max_size_mb ?? 8));
  const [rate, setRate] = useState(String(settings.photo_rate_per_ip_per_hour ?? 30));
  const [saving, setSaving] = useState(false);

  const dirty =
    mode !== (settings.photo_uploads ?? "pending") ||
    Number(perGuest) !== (settings.photo_max_per_guest ?? 5) ||
    Number(sizeMb) !== (settings.photo_max_size_mb ?? 8) ||
    Number(rate) !== (settings.photo_rate_per_ip_per_hour ?? 30);
  const off = mode === "off";

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
      toast.success("Guest upload settings saved");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold">Guest contributions</h2>
        <p className="text-sm text-muted-foreground">
          Choose how guests can add photos and wishes to your wedding website.
        </p>
      </div>

      <div className="grid gap-6 p-5">
        <div role="radiogroup" aria-label="Guest uploads" className="grid gap-3 sm:grid-cols-3">
          {MODES.map((m) => {
            const active = mode === m.value;
            return (
              <button
                key={m.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setMode(m.value)}
                className={`relative flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition ${
                  active ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-foreground/30"
                }`}
              >
                {active && <CheckCircle2 className="absolute right-3 top-3 size-5 text-primary" />}
                <m.icon className={`size-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className="font-medium">{m.title}</span>
                <span className="text-xs text-muted-foreground">{m.hint}</span>
              </button>
            );
          })}
        </div>

        <div className={off ? "opacity-50" : undefined}>
          <h3 className="mb-3 text-sm font-medium">Limits</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField
              id="photo-per-guest"
              label="Per guest"
              unit="photos"
              value={perGuest}
              max={PHOTO_CEILINGS.maxPerGuest}
              hint={`Up to ${PHOTO_CEILINGS.maxPerGuest}. Also caps wishes per guest.`}
              onChange={setPerGuest}
              disabled={off}
            />
            <NumberField
              id="photo-size"
              label="Largest photo"
              unit="MB"
              value={sizeMb}
              max={PHOTO_CEILINGS.maxSizeMb}
              hint={`Up to ${PHOTO_CEILINGS.maxSizeMb} MB. Photos are shrunk on the guest's phone first.`}
              onChange={setSizeMb}
              disabled={off}
            />
            <NumberField
              id="photo-rate"
              label="Per connection"
              unit="per hour"
              value={rate}
              max={PHOTO_CEILINGS.ratePerIpPerHour}
              hint="Guests at the venue share one Wi-Fi, so keep this generous."
              onChange={setRate}
              disabled={off}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t bg-muted/30 px-5 py-3">
        <p className="text-xs text-muted-foreground">
          {dirty ? "You have unsaved changes." : "Settings apply to your website immediately."}
        </p>
        <Button onClick={save} disabled={saving || !dirty}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </section>
  );
}

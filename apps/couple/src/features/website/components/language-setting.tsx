"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Languages } from "lucide-react";
import { mutate } from "swr";
import { cn } from "@mongkolka/ui/utils";
import { api, ApiError } from "@/lib/api";
import type { SiteLanguage } from "../data/schema";

const SETTINGS_KEY = "/couple/api/website/settings";
const OPTIONS: readonly { value: SiteLanguage; label: string }[] = [
  { value: "kh", label: "ខ្មែរ" },
  { value: "en", label: "English" },
];

/** The language the public site opens in. Guests can still switch; a `?lang=` link overrides it. */
export function LanguageSetting({ language }: { language: SiteLanguage }) {
  const [busy, setBusy] = useState(false);

  async function choose(next: SiteLanguage) {
    if (busy || next === language) return;
    setBusy(true);
    try {
      await api.patch("/couple/api/website/language", { language: next });
      await mutate(SETTINGS_KEY);
      toast.success(next === "kh" ? "Your site now opens in Khmer" : "Your site now opens in English");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't change the language");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5" title="The language your website opens in. Guests can switch.">
      <Languages className="size-4 text-muted-foreground" aria-hidden />
      <div className="flex gap-0.5 rounded-lg bg-muted p-0.5" role="group" aria-label="Website opens in">
        {OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={language === value}
            aria-disabled={busy}
            onClick={() => choose(value)}
            className={cn(
              "h-7 rounded-md px-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
              language === value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

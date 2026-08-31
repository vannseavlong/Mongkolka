"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import { Input } from "@mongkolka/ui/input";
import { api, ApiError } from "@/lib/api";
import { ROOT_DOMAIN, siteHost } from "@/lib/site-url";

const SETTINGS_KEY = "/couple/api/website/settings";

// Mirrors the API's isValidCustomSlug (apps/api/src/utils/slug.ts) so the
// input can be auto-cleaned as the couple types instead of round-tripping to
// the server on every keystroke.
function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function SlugEditor({ slug }: { slug: string | null }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(slug ?? "");
  const [saving, setSaving] = useState(false);

  if (!editing) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground">
          {slug ? siteHost(slug) : "Choose your link"}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          onClick={() => {
            setValue(slug ?? "");
            setEditing(true);
          }}
        >
          <Pencil className="size-3" />
          <span className="sr-only">Edit link</span>
        </Button>
      </div>
    );
  }

  async function save() {
    const cleaned = slugify(value);
    if (cleaned.length < 3) {
      toast.error("Link must be at least 3 characters");
      return;
    }
    setSaving(true);
    try {
      await api.patch("/couple/api/website/slug", { slug: cleaned });
      toast.success("Link updated");
      mutate(SETTINGS_KEY);
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update link");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="vutha-nita"
        className="h-8 w-32"
        disabled={saving}
      />
      <span className="text-sm text-muted-foreground">.{ROOT_DOMAIN}</span>
      <Button size="sm" onClick={save} disabled={saving}>
        Save
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
        Cancel
      </Button>
    </div>
  );
}

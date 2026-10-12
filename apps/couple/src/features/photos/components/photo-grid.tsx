"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, EyeOff, Trash2 } from "lucide-react";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import { Checkbox } from "@mongkolka/ui/checkbox";
import { api, ApiError } from "@/lib/api";
import type { Photo, PhotoStatus } from "../data/schema";

const STATUS_STYLES: Record<PhotoStatus, string> = {
  pending: "bg-amber-100 text-amber-900 hover:bg-amber-100",
  approved: "bg-emerald-100 text-emerald-900 hover:bg-emerald-100",
  hidden: "bg-muted text-muted-foreground hover:bg-muted",
};

export function PhotoGrid({ photos, onChanged }: { photos: Photo[]; onChanged: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    try {
      await action();
      toast.success(success);
      setSelected(new Set());
      onChanged();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const setStatus = (id: string, status: PhotoStatus) =>
    run(() => api.patch(`/couple/api/photos/${id}`, { status }), status === "approved" ? "Photo approved" : "Photo hidden");
  const remove = (id: string) => run(() => api.delete(`/couple/api/photos/${id}`), "Photo deleted");
  const removeSelected = () =>
    run(
      () => api.post("/couple/api/photos/bulk-delete", { ids: [...selected] }),
      `Deleted ${selected.size} photo${selected.size === 1 ? "" : "s"}`,
    );

  if (photos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
        No guest photos yet. They&apos;ll show up here as guests upload them.
      </p>
    );
  }

  return (
    <div>
      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2">
          <span className="text-sm">{selected.size} selected</span>
          <Button size="sm" variant="destructive" disabled={busy} onClick={removeSelected}>
            <Trash2 className="size-4" /> Delete selected
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      )}

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => (
          <li key={photo.photo_id} className="overflow-hidden rounded-lg border bg-card">
            <div className="relative aspect-square bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.uploader_name ? `Photo from ${photo.uploader_name}` : "Guest photo"}
                className="size-full object-cover"
                loading="lazy"
              />
              <Checkbox
                aria-label="Select photo"
                checked={selected.has(photo.photo_id)}
                onCheckedChange={() => toggle(photo.photo_id)}
                className="absolute left-2 top-2 bg-background"
              />
              <Badge className={`absolute right-2 top-2 ${STATUS_STYLES[photo.status]}`}>
                {photo.queued ? "saving…" : photo.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-2 p-2">
              <span className="truncate text-xs text-muted-foreground">
                {photo.uploader_name ?? "Guest"}
              </span>
              <div className="flex shrink-0">
                {photo.status !== "approved" && (
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Approve"
                    disabled={busy}
                    onClick={() => setStatus(photo.photo_id, "approved")}
                  >
                    <Check className="size-4" />
                  </Button>
                )}
                {photo.status !== "hidden" && (
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Hide from website"
                    disabled={busy}
                    onClick={() => setStatus(photo.photo_id, "hidden")}
                  >
                    <EyeOff className="size-4" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  title="Delete permanently"
                  disabled={busy}
                  onClick={() => remove(photo.photo_id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

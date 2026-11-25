"use client";

import { useState } from "react";
import { AlertTriangle, Check, ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Progress } from "@mongkolka/ui/progress";
import { cancelAllUploads, clearFinished, useUploadQueue } from "./upload-queue";
import { summarize } from "./upload-progress";

/**
 * Floating status for the upload queue, so uploading carries on after the library dialog is closed. Shows the
 * total progress; expand for the file list. Hidden when there is nothing to show.
 */
export function UploadDock() {
  const { items, viewers } = useUploadQueue();
  const [open, setOpen] = useState(false);
  const s = summarize(items);
  if (s.total === 0 || viewers > 0) return null;
  const busy = s.active > 0;
  return (
    <div role="status" aria-live="polite" className="fixed right-4 bottom-4 z-[60] w-72 rounded-lg border bg-popover p-3 text-sm shadow-lg">
      <div className="flex items-center gap-2">
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : s.failed ? <AlertTriangle className="size-4 text-destructive" aria-hidden /> : <Check className="size-4 text-primary" aria-hidden />}
        <span className="min-w-0 flex-1 truncate font-medium">
          {busy ? `Uploading ${s.done + s.failed + 1 > s.total ? s.total : s.done + s.failed + 1} of ${s.total}` : s.failed ? `${s.done} uploaded, ${s.failed} failed` : `${s.done} uploaded`}
        </span>
        <span className="text-xs text-muted-foreground">{s.percent}%</span>
        <Button type="button" size="icon" variant="ghost" className="size-6" aria-label={open ? "Hide files" : "Show files"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
        </Button>
        <Button type="button" size="icon" variant="ghost" className="size-6" aria-label={busy ? "Cancel all uploads" : "Dismiss"} onClick={() => (busy ? cancelAllUploads() : clearFinished())}>
          <X className="size-4" />
        </Button>
      </div>
      <Progress value={s.percent} className="mt-2" aria-label="Total upload progress" />
      {open && (
        <ul className="mt-2 flex max-h-48 flex-col gap-1 overflow-y-auto">
          {items.map((u) => (
            <li key={u.id} className="flex items-center gap-2 text-xs">
              <span className="min-w-0 flex-1 truncate">{u.name}</span>
              <span className={u.status === "error" ? "text-destructive" : "text-muted-foreground"}>
                {u.status === "queued" ? "Waiting" : u.status === "uploading" ? `${u.percent}%` : u.status === "done" ? "Done" : u.error ?? "Failed"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@mongkolka/ui/dialog";
import { Textarea } from "@mongkolka/ui/textarea";
import { NOTE_MAX, noteError } from "../lib/assist-state";

interface AskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy: boolean;
  error: string | null;
  /** Resolves true when the request was sent, so the dialog can close. */
  onSubmit: (note: string) => Promise<boolean>;
}

export function AskDialog({ open, onOpenChange, busy, error, onSubmit }: AskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {/* Remounted per open, so the note starts empty each time. */}
        {open && <AskBody busy={busy} error={error} onSubmit={onSubmit} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function AskBody({ busy, error, onSubmit, onClose }: Omit<AskDialogProps, "open" | "onOpenChange"> & { onClose: () => void }) {
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const problem = noteError(note);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (problem || busy) return;
    if (await onSubmit(note.trim())) onClose();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Ask Mongkolka to help</DialogTitle>
        <DialogDescription>
          Tell us what you need. If we accept, someone from our team can edit your site for 7 days. You can end it any time.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="assist-note" className="text-sm font-medium">
          What do you need help with?
        </label>
        <Textarea
          id="assist-note"
          rows={5}
          value={note}
          maxLength={NOTE_MAX + 100}
          aria-invalid={touched && !!problem}
          aria-describedby="assist-note-hint"
          placeholder="For example: please add our photos to the gallery and set the cover."
          onChange={(e) => setNote(e.target.value)}
        />
        <p id="assist-note-hint" className="flex justify-between gap-2 text-xs">
          <span className={touched && problem ? "text-destructive" : "text-muted-foreground"}>{touched && problem ? problem : "Be as specific as you can."}</span>
          <span className="text-muted-foreground">
            {note.trim().length}/{NOTE_MAX}
          </span>
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" disabled={busy} onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />} Send request
        </Button>
      </DialogFooter>
    </form>
  );
}

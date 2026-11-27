"use client";

import { useState } from "react";
import { Button } from "@mongkolka/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@mongkolka/ui/dialog";
import { Label } from "@mongkolka/ui/label";
import { Textarea } from "@mongkolka/ui/textarea";
import { REASON_MAX, reasonError } from "../lib/assist-rules";

export function DeclineDialog({
  coupleName,
  busy,
  onCancel,
  onDecline,
}: {
  coupleName: string;
  busy: boolean;
  onCancel: () => void;
  onDecline: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [tried, setTried] = useState(false);
  const error = tried ? reasonError(reason) : null;

  return (
    <Dialog open onOpenChange={(next) => !next && !busy && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="break-words">Decline {coupleName}?</DialogTitle>
          <DialogDescription>The couple sees your reason.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setTried(true);
            if (!busy && !reasonError(reason)) onDecline(reason);
          }}
        >
          <Label htmlFor="decline-reason">Reason</Label>
          <Textarea
            id="decline-reason"
            rows={4}
            value={reason}
            maxLength={REASON_MAX}
            aria-invalid={error !== null}
            aria-describedby="decline-reason-hint"
            onChange={(event) => setReason(event.target.value)}
          />
          <p id="decline-reason-hint" className={error ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
            {error ?? `${reason.length}/${REASON_MAX}`}
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              Decline
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

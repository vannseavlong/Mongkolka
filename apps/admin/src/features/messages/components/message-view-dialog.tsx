"use client";

import { useEffect } from "react";
import { mutate } from "swr";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mongkolka/ui/dialog";
import { api } from "@/lib/api";
import type { ContactMessage } from "../data/schema";

export function MessageViewDialog({
  open,
  onOpenChange,
  currentRow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: ContactMessage;
}) {
  // Opening a message is how an admin acknowledges it — mark it read as soon
  // as the dialog opens, same as any inbox.
  useEffect(() => {
    if (open && currentRow.status === "unread") {
      api
        .patch(`/admin/api/contact-messages/${currentRow.message_id}`, { status: "read" })
        .then(() => mutate("/admin/api/contact-messages"))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentRow.message_id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentRow.subject || "(No subject)"}
            {currentRow.status === "unread" && <Badge>Unread</Badge>}
          </DialogTitle>
          <DialogDescription>
            {currentRow.name} · {currentRow.email}
            {currentRow._created_at && ` · ${new Date(currentRow._created_at).toLocaleString()}`}
          </DialogDescription>
        </DialogHeader>
        <p className="whitespace-pre-wrap text-sm">{currentRow.message}</p>
        <DialogFooter>
          <Button variant="outline" asChild>
            <a
              href={`mailto:${currentRow.email}${
                currentRow.subject ? `?subject=${encodeURIComponent(`Re: ${currentRow.subject}`)}` : ""
              }`}
            >
              Reply by email
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

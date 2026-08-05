"use client";

import { toast } from "sonner";
import { mutate } from "swr";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@mongkolka/ui/alert-dialog";
import { api, ApiError } from "@/lib/api";
import type { ContactMessage } from "../data/schema";

export function MessagesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: ContactMessage;
}) {
  async function remove() {
    try {
      await api.delete(`/admin/api/contact-messages/${currentRow.message_id}`);
      toast.success("Message deleted");
      mutate("/admin/api/contact-messages");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete message");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this message?</AlertDialogTitle>
          <AlertDialogDescription>
            The message from {currentRow.name} ({currentRow.email}) will be permanently removed. This
            can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

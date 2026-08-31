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
import type { ChecklistItem } from "../data/schema";

export function ChecklistDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: ChecklistItem;
}) {
  async function remove() {
    try {
      await api.delete(`/couple/api/checklist-items/${currentRow.item_id}`);
      toast.success("Task removed");
      mutate("/couple/api/checklist-items");
      // The removed task's budget_spent no longer counts toward its
      // category's computed "spent" total — refresh Budget's cache too.
      mutate("/couple/api/budget-categories");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to remove task");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove &ldquo;{currentRow.text}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={remove}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

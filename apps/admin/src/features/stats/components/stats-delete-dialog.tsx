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
import type { Stat } from "../data/schema";

export function StatsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Stat;
}) {
  async function remove() {
    try {
      await api.delete(`/admin/api/stats/${currentRow.stat_id}`);
      toast.success("Stat deleted");
      mutate("/admin/api/stats");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete stat");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{currentRow.label}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the stat card from the About page immediately. This can&apos;t be undone.
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

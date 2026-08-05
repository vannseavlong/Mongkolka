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
import type { Theme } from "../data/schema";

export function ThemesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Theme;
}) {
  async function remove() {
    try {
      await api.delete(`/admin/api/themes/${currentRow.theme_id}`);
      toast.success("Theme deleted");
      mutate("/admin/api/themes");
      onOpenChange(false);
    } catch (err) {
      // The API rejects deleting the currently active theme with a 400 —
      // surface that message (or any other failure) as a toast.
      toast.error(err instanceof ApiError ? err.message : "Failed to delete theme");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{currentRow.name}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This can&apos;t be undone. The active theme can&apos;t be deleted — set another theme
            active first if you need to remove this one.
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

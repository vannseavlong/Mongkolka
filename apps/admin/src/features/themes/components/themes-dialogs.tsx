"use client";

import { ThemesActionDialog } from "./themes-action-dialog";
import { ThemesDeleteDialog } from "./themes-delete-dialog";
import { useThemes } from "./themes-provider";

export function ThemesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useThemes();

  return (
    <>
      <ThemesActionDialog
        key="theme-create"
        open={open === "create"}
        onOpenChange={(state) => setOpen(state ? "create" : null)}
      />

      {currentRow && (
        <ThemesActionDialog
          key={`theme-edit-${currentRow.theme_id}`}
          open={open === "edit"}
          onOpenChange={(state) => {
            setOpen(state ? "edit" : null);
            if (!state) setTimeout(() => setCurrentRow(null), 500);
          }}
          currentRow={currentRow}
        />
      )}

      {currentRow && (
        <ThemesDeleteDialog
          key={`theme-delete-${currentRow.theme_id}`}
          open={open === "delete"}
          onOpenChange={(state) => {
            setOpen(state ? "delete" : null);
            if (!state) setTimeout(() => setCurrentRow(null), 500);
          }}
          currentRow={currentRow}
        />
      )}
    </>
  );
}

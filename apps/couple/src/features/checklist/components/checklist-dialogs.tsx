"use client";

import { ChecklistActionDialog } from "./checklist-action-dialog";
import { ChecklistDeleteDialog } from "./checklist-delete-dialog";
import { useChecklist } from "./checklist-provider";

export function ChecklistDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useChecklist();

  function clearRowAfterClose(state: boolean) {
    if (!state) setTimeout(() => setCurrentRow(null), 500);
  }

  return (
    <>
      <ChecklistActionDialog
        key="checklist-create"
        open={open === "create"}
        onOpenChange={(state) => setOpen(state ? "create" : null)}
      />

      {currentRow && (
        <ChecklistActionDialog
          key={`checklist-edit-${currentRow.item_id}`}
          open={open === "edit"}
          onOpenChange={(state) => {
            setOpen(state ? "edit" : null);
            clearRowAfterClose(state);
          }}
          currentRow={currentRow}
        />
      )}

      {currentRow && (
        <ChecklistDeleteDialog
          key={`checklist-delete-${currentRow.item_id}`}
          open={open === "delete"}
          onOpenChange={(state) => {
            setOpen(state ? "delete" : null);
            clearRowAfterClose(state);
          }}
          currentRow={currentRow}
        />
      )}
    </>
  );
}

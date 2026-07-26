"use client";

import { MilestonesActionDialog } from "./milestones-action-dialog";
import { MilestonesDeleteDialog } from "./milestones-delete-dialog";
import { useMilestones } from "./milestones-provider";

export function MilestonesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useMilestones();

  function clearRowAfterClose(state: boolean) {
    if (!state) setTimeout(() => setCurrentRow(null), 500);
  }

  return (
    <>
      <MilestonesActionDialog
        key="milestone-create"
        open={open === "create"}
        onOpenChange={(state) => setOpen(state ? "create" : null)}
      />

      {currentRow && (
        <MilestonesActionDialog
          key={`milestone-edit-${currentRow.milestone_id}`}
          open={open === "edit"}
          onOpenChange={(state) => {
            setOpen(state ? "edit" : null);
            clearRowAfterClose(state);
          }}
          currentRow={currentRow}
        />
      )}

      {currentRow && (
        <MilestonesDeleteDialog
          key={`milestone-delete-${currentRow.milestone_id}`}
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

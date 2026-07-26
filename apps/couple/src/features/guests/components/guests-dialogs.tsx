"use client";

import { GuestsActionDialog } from "./guests-action-dialog";
import { GuestsDeleteDialog } from "./guests-delete-dialog";
import { useGuests } from "./guests-provider";

export function GuestsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useGuests();

  function clearRowAfterClose(state: boolean) {
    if (!state) setTimeout(() => setCurrentRow(null), 500);
  }

  return (
    <>
      <GuestsActionDialog
        key="guest-create"
        open={open === "create"}
        onOpenChange={(state) => setOpen(state ? "create" : null)}
      />

      {currentRow && (
        <GuestsActionDialog
          key={`guest-edit-${currentRow.guest_id}`}
          open={open === "edit"}
          onOpenChange={(state) => {
            setOpen(state ? "edit" : null);
            clearRowAfterClose(state);
          }}
          currentRow={currentRow}
        />
      )}

      {currentRow && (
        <GuestsDeleteDialog
          key={`guest-delete-${currentRow.guest_id}`}
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

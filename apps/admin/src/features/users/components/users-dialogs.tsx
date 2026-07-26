"use client";

import { UsersDeactivateDialog } from "./users-deactivate-dialog";
import { useUsers } from "./users-provider";

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers();

  return (
    <>
      {currentRow && (
        <UsersDeactivateDialog
          key={`user-deactivate-${currentRow.user_id}`}
          open={open === "deactivate"}
          onOpenChange={(state) => {
            setOpen(state ? "deactivate" : null);
            if (!state) setTimeout(() => setCurrentRow(null), 500);
          }}
          currentRow={currentRow}
        />
      )}
    </>
  );
}

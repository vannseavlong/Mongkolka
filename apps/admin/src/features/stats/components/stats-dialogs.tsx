"use client";

import { StatsActionDialog } from "./stats-action-dialog";
import { StatsDeleteDialog } from "./stats-delete-dialog";
import { useStats } from "./stats-provider";

export function StatsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStats();

  return (
    <>
      <StatsActionDialog
        key="stat-create"
        open={open === "create"}
        onOpenChange={(state) => setOpen(state ? "create" : null)}
      />

      {currentRow && (
        <>
          <StatsActionDialog
            key={`stat-edit-${currentRow.stat_id}`}
            open={open === "edit"}
            onOpenChange={(state) => {
              setOpen(state ? "edit" : null);
              if (!state) setTimeout(() => setCurrentRow(null), 500);
            }}
            currentRow={currentRow}
          />
          <StatsDeleteDialog
            key={`stat-delete-${currentRow.stat_id}`}
            open={open === "delete"}
            onOpenChange={(state) => {
              setOpen(state ? "delete" : null);
              if (!state) setTimeout(() => setCurrentRow(null), 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}

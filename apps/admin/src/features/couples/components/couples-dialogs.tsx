"use client";

import { CouplesSuspendDialog } from "./couples-suspend-dialog";
import { useCouples } from "./couples-provider";

export function CouplesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCouples();

  return (
    <>
      {currentRow && (
        <CouplesSuspendDialog
          key={`couple-suspend-${currentRow.couple_id}`}
          open={open === "suspend"}
          onOpenChange={(state) => {
            setOpen(state ? "suspend" : null);
            if (!state) setTimeout(() => setCurrentRow(null), 500);
          }}
          currentRow={currentRow}
        />
      )}
    </>
  );
}

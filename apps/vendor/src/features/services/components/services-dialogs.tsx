"use client";

import { ServicesActionDialog } from "./services-action-dialog";
import { ServicesDeleteDialog } from "./services-delete-dialog";
import { useServices } from "./services-provider";

export function ServicesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useServices();

  return (
    <>
      <ServicesActionDialog
        key="service-create"
        open={open === "create"}
        onOpenChange={(state) => setOpen(state ? "create" : null)}
      />

      {currentRow && (
        <ServicesDeleteDialog
          key={`service-delete-${currentRow.service_id}`}
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

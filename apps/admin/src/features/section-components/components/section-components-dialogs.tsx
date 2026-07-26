"use client";

import { SectionComponentsActionDialog } from "./section-components-action-dialog";
import { SectionComponentsDeleteDialog } from "./section-components-delete-dialog";
import { useSectionComponents } from "./section-components-provider";

export function SectionComponentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSectionComponents();

  return (
    <>
      <SectionComponentsActionDialog
        key="section-component-create"
        open={open === "create"}
        onOpenChange={(state) => setOpen(state ? "create" : null)}
      />

      {currentRow && (
        <SectionComponentsDeleteDialog
          key={`section-component-delete-${currentRow.component_id}`}
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

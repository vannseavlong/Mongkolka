"use client";

import { SiteTemplatesActionDialog } from "./site-templates-action-dialog";
import { SiteTemplatesDeleteDialog } from "./site-templates-delete-dialog";
import { useSiteTemplates } from "./site-templates-provider";

export function SiteTemplatesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSiteTemplates();

  return (
    <>
      <SiteTemplatesActionDialog
        key="site-template-create"
        open={open === "create"}
        onOpenChange={(state) => setOpen(state ? "create" : null)}
      />

      {currentRow && (
        <SiteTemplatesDeleteDialog
          key={`site-template-delete-${currentRow.template_id}`}
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

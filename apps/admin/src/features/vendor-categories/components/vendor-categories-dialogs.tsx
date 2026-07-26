"use client";

import { VendorCategoriesActionDialog } from "./vendor-categories-action-dialog";
import { VendorCategoriesDeleteDialog } from "./vendor-categories-delete-dialog";
import { useVendorCategories } from "./vendor-categories-provider";

export function VendorCategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useVendorCategories();

  return (
    <>
      <VendorCategoriesActionDialog
        key="vendor-category-create"
        open={open === "create"}
        onOpenChange={(state) => setOpen(state ? "create" : null)}
      />

      {currentRow && (
        <VendorCategoriesDeleteDialog
          key={`vendor-category-delete-${currentRow.category_id}`}
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

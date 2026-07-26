"use client";

import { BudgetActionDialog } from "./budget-action-dialog";
import { BudgetDeleteDialog } from "./budget-delete-dialog";
import { useBudget } from "./budget-provider";

export function BudgetDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBudget();

  function clearRowAfterClose(state: boolean) {
    if (!state) setTimeout(() => setCurrentRow(null), 500);
  }

  return (
    <>
      <BudgetActionDialog
        key="budget-category-create"
        open={open === "create"}
        onOpenChange={(state) => setOpen(state ? "create" : null)}
      />

      {currentRow && (
        <BudgetActionDialog
          key={`budget-category-edit-${currentRow.category_id}`}
          open={open === "edit"}
          onOpenChange={(state) => {
            setOpen(state ? "edit" : null);
            clearRowAfterClose(state);
          }}
          currentRow={currentRow}
        />
      )}

      {currentRow && (
        <BudgetDeleteDialog
          key={`budget-category-delete-${currentRow.category_id}`}
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

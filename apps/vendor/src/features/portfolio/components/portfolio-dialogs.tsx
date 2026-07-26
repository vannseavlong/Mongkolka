"use client";

import { PortfolioActionDialog } from "./portfolio-action-dialog";
import { PortfolioDeleteDialog } from "./portfolio-delete-dialog";
import { usePortfolio } from "./portfolio-provider";

export function PortfolioDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePortfolio();

  return (
    <>
      <PortfolioActionDialog
        key="portfolio-create"
        open={open === "create"}
        onOpenChange={(state) => setOpen(state ? "create" : null)}
      />

      {currentRow && (
        <PortfolioDeleteDialog
          key={`portfolio-delete-${currentRow.item_id}`}
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

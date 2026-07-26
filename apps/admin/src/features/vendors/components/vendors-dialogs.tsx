"use client";

import { VendorsSuspendDialog } from "./vendors-suspend-dialog";
import { useVendors } from "./vendors-provider";

export function VendorsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useVendors();

  return (
    <>
      {currentRow && (
        <VendorsSuspendDialog
          key={`vendor-suspend-${currentRow.vendor_id}`}
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

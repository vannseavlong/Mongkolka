"use client";

import { ApprovalsRejectDialog } from "./approvals-reject-dialog";
import { useApprovals } from "./approvals-provider";

export function ApprovalsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useApprovals();

  return (
    <>
      {currentRow && (
        <ApprovalsRejectDialog
          key={`approval-reject-${currentRow.user_id}`}
          open={open === "reject"}
          onOpenChange={(state) => {
            setOpen(state ? "reject" : null);
            if (!state) setTimeout(() => setCurrentRow(null), 500);
          }}
          currentRow={currentRow}
        />
      )}
    </>
  );
}

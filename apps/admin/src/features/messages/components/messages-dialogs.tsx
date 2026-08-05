"use client";

import { MessageViewDialog } from "./message-view-dialog";
import { MessagesDeleteDialog } from "./messages-delete-dialog";
import { useMessages } from "./messages-provider";

export function MessagesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useMessages();

  if (!currentRow) return null;

  return (
    <>
      <MessageViewDialog
        key={`message-view-${currentRow.message_id}`}
        open={open === "view"}
        onOpenChange={(state) => {
          setOpen(state ? "view" : null);
          if (!state) setTimeout(() => setCurrentRow(null), 500);
        }}
        currentRow={currentRow}
      />
      <MessagesDeleteDialog
        key={`message-delete-${currentRow.message_id}`}
        open={open === "delete"}
        onOpenChange={(state) => {
          setOpen(state ? "delete" : null);
          if (!state) setTimeout(() => setCurrentRow(null), 500);
        }}
        currentRow={currentRow}
      />
    </>
  );
}

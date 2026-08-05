"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { ContactMessage } from "../data/schema";

type MessagesDialogType = "view" | "delete";

type MessagesContextType = {
  open: MessagesDialogType | null;
  setOpen: (value: MessagesDialogType | null) => void;
  currentRow: ContactMessage | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<ContactMessage | null>>;
};

const MessagesContext = React.createContext<MessagesContextType | null>(null);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<MessagesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<ContactMessage | null>(null);

  return (
    <MessagesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const ctx = React.useContext(MessagesContext);
  if (!ctx) throw new Error("useMessages must be used within <MessagesProvider>");
  return ctx;
}

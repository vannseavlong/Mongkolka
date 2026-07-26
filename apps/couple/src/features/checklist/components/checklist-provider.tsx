"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { ChecklistItem } from "../data/schema";

type ChecklistDialogType = "create" | "edit" | "delete";

type ChecklistContextType = {
  open: ChecklistDialogType | null;
  setOpen: (value: ChecklistDialogType | null) => void;
  currentRow: ChecklistItem | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<ChecklistItem | null>>;
};

const ChecklistContext = React.createContext<ChecklistContextType | null>(null);

export function ChecklistProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ChecklistDialogType>(null);
  const [currentRow, setCurrentRow] = useState<ChecklistItem | null>(null);

  return (
    <ChecklistContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ChecklistContext.Provider>
  );
}

export function useChecklist() {
  const ctx = React.useContext(ChecklistContext);
  if (!ctx) throw new Error("useChecklist must be used within <ChecklistProvider>");
  return ctx;
}

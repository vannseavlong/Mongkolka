"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { User } from "@/features/users/data/schema";

type ApprovalsDialogType = "reject";

type ApprovalsContextType = {
  open: ApprovalsDialogType | null;
  setOpen: (value: ApprovalsDialogType | null) => void;
  currentRow: User | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>;
};

const ApprovalsContext = React.createContext<ApprovalsContextType | null>(null);

export function ApprovalsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ApprovalsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<User | null>(null);

  return (
    <ApprovalsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ApprovalsContext.Provider>
  );
}

export function useApprovals() {
  const ctx = React.useContext(ApprovalsContext);
  if (!ctx) throw new Error("useApprovals must be used within <ApprovalsProvider>");
  return ctx;
}

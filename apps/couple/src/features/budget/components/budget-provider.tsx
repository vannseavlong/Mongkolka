"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { BudgetCategory } from "../data/schema";

type BudgetDialogType = "create" | "edit" | "delete";

type BudgetContextType = {
  open: BudgetDialogType | null;
  setOpen: (value: BudgetDialogType | null) => void;
  currentRow: BudgetCategory | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<BudgetCategory | null>>;
};

const BudgetContext = React.createContext<BudgetContextType | null>(null);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BudgetDialogType>(null);
  const [currentRow, setCurrentRow] = useState<BudgetCategory | null>(null);

  return (
    <BudgetContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = React.useContext(BudgetContext);
  if (!ctx) throw new Error("useBudget must be used within <BudgetProvider>");
  return ctx;
}

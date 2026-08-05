"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { Stat } from "../data/schema";

type StatsDialogType = "create" | "edit" | "delete";

type StatsContextType = {
  open: StatsDialogType | null;
  setOpen: (value: StatsDialogType | null) => void;
  currentRow: Stat | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Stat | null>>;
};

const StatsContext = React.createContext<StatsContextType | null>(null);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<StatsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Stat | null>(null);

  return (
    <StatsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const ctx = React.useContext(StatsContext);
  if (!ctx) throw new Error("useStats must be used within <StatsProvider>");
  return ctx;
}

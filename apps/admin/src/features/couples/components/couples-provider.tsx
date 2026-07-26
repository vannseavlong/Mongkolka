"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { Couple } from "../data/schema";

type CouplesDialogType = "suspend";

type CouplesContextType = {
  open: CouplesDialogType | null;
  setOpen: (value: CouplesDialogType | null) => void;
  currentRow: Couple | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Couple | null>>;
};

const CouplesContext = React.createContext<CouplesContextType | null>(null);

export function CouplesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CouplesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Couple | null>(null);

  return (
    <CouplesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CouplesContext.Provider>
  );
}

export function useCouples() {
  const ctx = React.useContext(CouplesContext);
  if (!ctx) throw new Error("useCouples must be used within <CouplesProvider>");
  return ctx;
}

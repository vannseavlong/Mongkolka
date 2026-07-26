"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { Guest } from "../data/schema";

type GuestsDialogType = "create" | "edit" | "delete";

type GuestsContextType = {
  open: GuestsDialogType | null;
  setOpen: (value: GuestsDialogType | null) => void;
  currentRow: Guest | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Guest | null>>;
};

const GuestsContext = React.createContext<GuestsContextType | null>(null);

export function GuestsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<GuestsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Guest | null>(null);

  return (
    <GuestsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </GuestsContext.Provider>
  );
}

export function useGuests() {
  const ctx = React.useContext(GuestsContext);
  if (!ctx) throw new Error("useGuests must be used within <GuestsProvider>");
  return ctx;
}

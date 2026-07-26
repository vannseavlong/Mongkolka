"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { Milestone } from "../data/schema";

type MilestonesDialogType = "create" | "edit" | "delete";

type MilestonesContextType = {
  open: MilestonesDialogType | null;
  setOpen: (value: MilestonesDialogType | null) => void;
  currentRow: Milestone | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Milestone | null>>;
};

const MilestonesContext = React.createContext<MilestonesContextType | null>(null);

export function MilestonesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<MilestonesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Milestone | null>(null);

  return (
    <MilestonesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </MilestonesContext.Provider>
  );
}

export function useMilestones() {
  const ctx = React.useContext(MilestonesContext);
  if (!ctx) throw new Error("useMilestones must be used within <MilestonesProvider>");
  return ctx;
}

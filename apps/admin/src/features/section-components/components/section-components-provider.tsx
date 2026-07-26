"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { SectionComponent } from "../data/schema";

type SectionComponentsDialogType = "create" | "delete";

type SectionComponentsContextType = {
  open: SectionComponentsDialogType | null;
  setOpen: (value: SectionComponentsDialogType | null) => void;
  currentRow: SectionComponent | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<SectionComponent | null>>;
};

const SectionComponentsContext = React.createContext<SectionComponentsContextType | null>(null);

export function SectionComponentsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<SectionComponentsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<SectionComponent | null>(null);

  return (
    <SectionComponentsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SectionComponentsContext.Provider>
  );
}

export function useSectionComponents() {
  const ctx = React.useContext(SectionComponentsContext);
  if (!ctx) throw new Error("useSectionComponents must be used within <SectionComponentsProvider>");
  return ctx;
}

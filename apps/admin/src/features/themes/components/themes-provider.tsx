"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { Theme } from "../data/schema";

type ThemesDialogType = "create" | "edit" | "delete";

type ThemesContextType = {
  open: ThemesDialogType | null;
  setOpen: (value: ThemesDialogType | null) => void;
  currentRow: Theme | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Theme | null>>;
};

const ThemesContext = React.createContext<ThemesContextType | null>(null);

export function ThemesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ThemesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Theme | null>(null);

  return (
    <ThemesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ThemesContext.Provider>
  );
}

export function useThemes() {
  const ctx = React.useContext(ThemesContext);
  if (!ctx) throw new Error("useThemes must be used within <ThemesProvider>");
  return ctx;
}

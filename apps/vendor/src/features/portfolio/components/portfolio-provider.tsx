"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { PortfolioItem } from "../data/schema";

type PortfolioDialogType = "create" | "delete";

type PortfolioContextType = {
  open: PortfolioDialogType | null;
  setOpen: (value: PortfolioDialogType | null) => void;
  currentRow: PortfolioItem | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<PortfolioItem | null>>;
};

const PortfolioContext = React.createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<PortfolioDialogType>(null);
  const [currentRow, setCurrentRow] = useState<PortfolioItem | null>(null);

  return (
    <PortfolioContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = React.useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within <PortfolioProvider>");
  return ctx;
}

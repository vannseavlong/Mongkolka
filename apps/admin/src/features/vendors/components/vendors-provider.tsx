"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { Vendor } from "../data/schema";

type VendorsDialogType = "suspend";

type VendorsContextType = {
  open: VendorsDialogType | null;
  setOpen: (value: VendorsDialogType | null) => void;
  currentRow: Vendor | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Vendor | null>>;
};

const VendorsContext = React.createContext<VendorsContextType | null>(null);

export function VendorsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<VendorsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Vendor | null>(null);

  return (
    <VendorsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </VendorsContext.Provider>
  );
}

export function useVendors() {
  const ctx = React.useContext(VendorsContext);
  if (!ctx) throw new Error("useVendors must be used within <VendorsProvider>");
  return ctx;
}

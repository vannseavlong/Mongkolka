"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { VendorCategory } from "../data/schema";

type VendorCategoriesDialogType = "create" | "delete";

type VendorCategoriesContextType = {
  open: VendorCategoriesDialogType | null;
  setOpen: (value: VendorCategoriesDialogType | null) => void;
  currentRow: VendorCategory | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<VendorCategory | null>>;
};

const VendorCategoriesContext = React.createContext<VendorCategoriesContextType | null>(null);

export function VendorCategoriesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<VendorCategoriesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<VendorCategory | null>(null);

  return (
    <VendorCategoriesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </VendorCategoriesContext.Provider>
  );
}

export function useVendorCategories() {
  const ctx = React.useContext(VendorCategoriesContext);
  if (!ctx) throw new Error("useVendorCategories must be used within <VendorCategoriesProvider>");
  return ctx;
}

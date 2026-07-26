"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { Service } from "../data/schema";

type ServicesDialogType = "create" | "delete";

type ServicesContextType = {
  open: ServicesDialogType | null;
  setOpen: (value: ServicesDialogType | null) => void;
  currentRow: Service | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Service | null>>;
};

const ServicesContext = React.createContext<ServicesContextType | null>(null);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ServicesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Service | null>(null);

  return (
    <ServicesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const ctx = React.useContext(ServicesContext);
  if (!ctx) throw new Error("useServices must be used within <ServicesProvider>");
  return ctx;
}

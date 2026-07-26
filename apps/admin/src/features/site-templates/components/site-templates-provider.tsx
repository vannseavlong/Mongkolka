"use client";

import React, { useState } from "react";
import { useDialogState } from "@mongkolka/ui/hooks/use-dialog-state";
import type { SiteTemplate } from "../data/schema";

type SiteTemplatesDialogType = "create" | "delete";

type SiteTemplatesContextType = {
  open: SiteTemplatesDialogType | null;
  setOpen: (value: SiteTemplatesDialogType | null) => void;
  currentRow: SiteTemplate | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<SiteTemplate | null>>;
};

const SiteTemplatesContext = React.createContext<SiteTemplatesContextType | null>(null);

export function SiteTemplatesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<SiteTemplatesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<SiteTemplate | null>(null);

  return (
    <SiteTemplatesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SiteTemplatesContext.Provider>
  );
}

export function useSiteTemplates() {
  const ctx = React.useContext(SiteTemplatesContext);
  if (!ctx) throw new Error("useSiteTemplates must be used within <SiteTemplatesProvider>");
  return ctx;
}

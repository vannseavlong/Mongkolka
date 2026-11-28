"use client";

import { createContext, useContext, useState } from "react";
import { useAssistActions } from "../lib/use-assist-actions";

export type DialogKind = "accept" | "decline" | "revoke";

type RequestsContextValue = ReturnType<typeof useAssistActions> & {
  dialog: { kind: DialogKind; requestId: string } | null;
  setDialog: (dialog: { kind: DialogKind; requestId: string } | null) => void;
};

const RequestsContext = createContext<RequestsContextValue | null>(null);

/** Shared by the row menus and the dialogs, which live outside the table so a refresh cannot close them. */
export function RequestsProvider({ refresh, children }: { refresh: () => Promise<unknown>; children: React.ReactNode }) {
  const actions = useAssistActions(refresh);
  const [dialog, setDialog] = useState<RequestsContextValue["dialog"]>(null);
  return <RequestsContext value={{ ...actions, dialog, setDialog }}>{children}</RequestsContext>;
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (!context) throw new Error("useRequests must be used within <RequestsProvider>");
  return context;
}

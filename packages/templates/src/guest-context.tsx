"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * The invited guest's name from the personalised link (`?to=Name`). Provided once by
 * SiteRenderer so any section can greet them or prefill forms, without every section
 * having to take a guest prop.
 */
const GuestContext = createContext<{ name?: string }>({});

export function GuestProvider({ name, children }: { name?: string; children: ReactNode }) {
  return <GuestContext.Provider value={{ name: name?.trim() || undefined }}>{children}</GuestContext.Provider>;
}

export function useGuest() {
  return useContext(GuestContext);
}

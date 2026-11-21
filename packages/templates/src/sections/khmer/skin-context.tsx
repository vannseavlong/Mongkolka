"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SkinId } from "../skins";
import { DEFAULT_ORNAMENTS } from "./ornaments/default-ornaments";
import { ornamentsFor } from "./skin-ornaments";
import type { SkinOrnaments } from "./skin-ornament-types";

const SkinContext = createContext<SkinOrnaments>(DEFAULT_ORNAMENTS);

/** Provided by SiteRenderer from the template's skin; outside it the shared default set is used. */
export function SkinProvider({ skin, children }: { skin: SkinId | null; children: ReactNode }) {
  return <SkinContext.Provider value={ornamentsFor(skin)}>{children}</SkinContext.Provider>;
}

export function useSkinOrnaments(): SkinOrnaments {
  return useContext(SkinContext);
}

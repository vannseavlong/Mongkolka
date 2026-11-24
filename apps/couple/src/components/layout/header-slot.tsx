"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const SLOT_ID = "app-header-slot";

const subscribe = () => () => {};
const getSlot = () => document.getElementById(SLOT_ID);
const getServerSlot = () => null;

/** Empty area of the app header that a page can fill (see HeaderContent). */
export function HeaderSlot() {
  return <div id={SLOT_ID} className="flex min-w-0 flex-1 items-center gap-3" />;
}

/** Renders children into the app header, on the same line as the sidebar toggle. */
export function HeaderContent({ children }: { children: ReactNode }) {
  const slot = useSyncExternalStore(subscribe, getSlot, getServerSlot);
  return slot ? createPortal(children, slot) : null;
}

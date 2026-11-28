"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const SLOT_ID = "app-header-slot";

const subscribe = () => () => {};
const getSlot = () => document.getElementById(SLOT_ID);
const getServerSlot = () => null;

/** The area of the app header, next to the sidebar toggle, that the current page fills. Goes inside `Header`. */
export function HeaderSlot() {
  return <div id={SLOT_ID} className="flex min-w-0 flex-1 items-center gap-3" />;
}

/** Renders children into the app header. For a page with its own header controls; otherwise use `PageHeader`. */
export function HeaderContent({ children }: { children: ReactNode }) {
  const slot = useSyncExternalStore(subscribe, getSlot, getServerSlot);
  return slot ? createPortal(children, slot) : null;
}

/** The page title in the app header, with page actions on the right. The same on every portal. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <HeaderContent>
      {/* w-0: a long description must truncate, not widen the whole page. */}
      <div className="w-0 min-w-0 flex-1">
        <h1 className="truncate text-lg leading-tight font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="truncate text-sm text-muted-foreground max-sm:hidden" title={description}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </HeaderContent>
  );
}

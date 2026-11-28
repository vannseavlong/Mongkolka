"use client";

import { useEffect, useRef } from "react";

const MARK = "mkOverlay";
/** A step back that is still waiting: an overlay reopened at once (React's double mount in dev) takes the entry over. */
let pendingBack: ReturnType<typeof setTimeout> | undefined;

/**
 * Makes the browser's (and phone's) Back close an overlay instead of leaving the page: opening adds one history entry,
 * Back pops it and calls `onClose`, and closing any other way removes the entry again.
 */
export function useBackCloses(onClose: () => void) {
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (pendingBack !== undefined) {
      clearTimeout(pendingBack);
      pendingBack = undefined;
    } else {
      window.history.pushState({ ...window.history.state, [MARK]: true }, "");
    }
    const onPop = () => close.current();
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      // Back already removed the entry; X, Escape or a tap outside did not.
      if (window.history.state?.[MARK]) {
        pendingBack = setTimeout(() => {
          pendingBack = undefined;
          window.history.back();
        });
      }
    };
  }, []);
}

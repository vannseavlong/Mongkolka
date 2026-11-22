"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cleanPhotos, visiblePhotos } from "./gallery-layout";

const EMPTY: ReadonlySet<string> = new Set();

/**
 * State of the photo gallery: the cleaned list, photos that failed to load (hidden), which photo
 * is open in the viewer, and focus returning to the tile that opened it. No JSX.
 */
export function useGallery(raw: unknown) {
  const all = cleanPhotos(raw);
  const listKey = all.join("\n");
  const [failedState, setFailedState] = useState<{ key: string; set: ReadonlySet<string> }>({ key: listKey, set: EMPTY });
  const failed = failedState.key === listKey ? failedState.set : EMPTY;
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  const tileRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const returnTo = useRef<string | null>(null);
  const wasOpen = useRef(false);

  const fail = useCallback(
    (src: string) =>
      setFailedState((prev) => {
        const base = prev.key === listKey ? prev.set : EMPTY;
        return base.has(src) ? prev : { key: listKey, set: new Set(base).add(src) };
      }),
    [listKey],
  );

  const close = useCallback(() => {
    setOpenSrc((cur) => {
      if (cur != null) returnTo.current = cur;
      return null;
    });
  }, []);

  // Return focus to the tile that opened the viewer.
  useEffect(() => {
    if (openSrc != null) {
      wasOpen.current = true;
      return;
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      (returnTo.current ? tileRefs.current.get(returnTo.current) : undefined)?.focus();
    }
  }, [openSrc]);

  // If the photo that is open disappears from the list, close the viewer.
  useEffect(() => {
    if (openSrc != null && !listKey.split("\n").includes(openSrc)) setOpenSrc(null);
  }, [openSrc, listKey]);

  const registerTile = useCallback(
    (src: string) => (el: HTMLButtonElement | null) => {
      if (el) tileRefs.current.set(src, el);
      else tileRefs.current.delete(src);
    },
    [],
  );

  const photos = visiblePhotos(all, failed);
  const viewerPhotos = visiblePhotos(all, failed, openSrc);
  const viewerIndex = openSrc != null ? viewerPhotos.indexOf(openSrc) : -1;

  return {
    photos,
    total: photos.length,
    fail,
    open: setOpenSrc,
    close,
    registerTile,
    viewerPhotos,
    viewerIndex,
    isOpen: openSrc != null,
    setViewerIndex: (i: number) => setOpenSrc(viewerPhotos[i] ?? null),
  };
}

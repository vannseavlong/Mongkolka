"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { api, ApiError } from "@/lib/api";
import type { WebsiteSection } from "../data/schema";
import { SECTIONS_KEY } from "../lib/keys";
import { sectionLabel } from "./section-labels";
import { applyPatch, reorderSections, rollbackFields } from "./section-actions-logic";

type SectionsCache = { sections: WebsiteSection[] };

// Writes in flight against the sections list. Only the last one to settle
// revalidates, so an early response cannot overwrite a later optimistic edit
// with stale server data.
let inFlight = 0;
const settle = () => {
  inFlight -= 1;
  if (inFlight === 0) mutate(SECTIONS_KEY);
};

/**
 * Optimistic writes for website sections. Each one updates the SWR cache first
 * (revalidate: false) so the rail and canvas react immediately, then calls the
 * API; on failure only the fields it touched are restored and a toast says so.
 */
export function useSectionActions(sections: WebsiteSection[]) {
  const [reordering, setReordering] = useState(false);
  const reorderingRef = useRef(false);
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set());
  // Screen-reader announcement for the polite live region.
  const [announcement, setAnnouncement] = useState("");

  function setPendingId(id: string, on: boolean) {
    setPending((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function patchSection(sectionId: string, data: Partial<WebsiteSection>, failure = "Failed to update section") {
    const before = sections.find((s) => s.section_id === sectionId);
    mutate(SECTIONS_KEY, (current?: SectionsCache) => current && { sections: applyPatch(current.sections, sectionId, data) }, {
      revalidate: false,
    });
    inFlight += 1;
    setPendingId(sectionId, true);
    try {
      await api.patch(`/couple/api/website/sections/${sectionId}`, data);
      return true;
    } catch (err) {
      if (before) {
        const touched = Object.keys(data) as (keyof WebsiteSection)[];
        mutate(
          SECTIONS_KEY,
          (current?: SectionsCache) => current && { sections: rollbackFields(current.sections, before, touched) },
          { revalidate: false },
        );
      }
      toast.error(err instanceof ApiError ? err.message : failure);
      return false;
    } finally {
      setPendingId(sectionId, false);
      settle();
    }
  }

  async function move(index: number, direction: -1 | 1) {
    if (reorderingRef.current) return;
    const result = reorderSections(sections, index, direction);
    if (!result) return;
    const previous: SectionsCache = { sections };
    mutate(SECTIONS_KEY, { sections: result.optimistic }, { revalidate: false });
    reorderingRef.current = true;
    setReordering(true);
    inFlight += 1;
    try {
      await api.post("/couple/api/website/sections/reorder", { section_ids: result.sectionIds });
      setAnnouncement(`${sectionLabel(sections[index].section_key)} moved to position ${result.position}`);
    } catch (err) {
      mutate(SECTIONS_KEY, previous, { revalidate: false });
      toast.error(err instanceof ApiError ? err.message : "Failed to reorder sections");
    } finally {
      settle();
      reorderingRef.current = false;
      setReordering(false);
    }
  }

  return { patchSection, move, reordering, pending, announcement };
}

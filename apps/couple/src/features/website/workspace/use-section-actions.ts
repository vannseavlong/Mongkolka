"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { api, ApiError } from "@/lib/api";
import type { WebsiteSection } from "../data/schema";

export const SECTIONS_KEY = "/couple/api/website/sections";

type SectionsCache = { sections: WebsiteSection[] };

/**
 * Optimistic writes for website sections. Each one updates the SWR cache first
 * (revalidate: false) so the rail and canvas react immediately, then calls the
 * API; on failure the cache is put back to the snapshot taken before the edit
 * and a toast says so. A final revalidate re-syncs with the server either way.
 */
export function useSectionActions(sections: WebsiteSection[]) {
  // Blocks a second reorder while the first is in flight (Sheets-backed writes
  // are slow, and two overlapping reorders would race).
  const [reordering, setReordering] = useState(false);

  async function patchSection(sectionId: string, data: Partial<WebsiteSection>, failure = "Failed to update section") {
    const previous: SectionsCache = { sections };
    mutate(
      SECTIONS_KEY,
      (current?: SectionsCache) =>
        current && { sections: current.sections.map((s) => (s.section_id === sectionId ? { ...s, ...data } : s)) },
      { revalidate: false },
    );
    try {
      await api.patch(`/couple/api/website/sections/${sectionId}`, data);
      return true;
    } catch (err) {
      mutate(SECTIONS_KEY, previous, { revalidate: false });
      toast.error(err instanceof ApiError ? err.message : failure);
      return false;
    } finally {
      mutate(SECTIONS_KEY);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    if (reordering) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const previous: SectionsCache = { sections };
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    mutate(SECTIONS_KEY, { sections: reordered.map((s, i) => ({ ...s, display_order: i })) }, { revalidate: false });
    setReordering(true);
    try {
      await api.post("/couple/api/website/sections/reorder", { section_ids: reordered.map((s) => s.section_id) });
    } catch (err) {
      mutate(SECTIONS_KEY, previous, { revalidate: false });
      toast.error(err instanceof ApiError ? err.message : "Failed to reorder sections");
    } finally {
      mutate(SECTIONS_KEY);
      setReordering(false);
    }
  }

  return { patchSection, move, reordering };
}

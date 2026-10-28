"use client";

import { CoverAssets } from "../../components/asset-picker-cover";
import { GalleryAssets } from "../../components/asset-picker-gallery";
import type { SectionPanelTab } from "./types";

/** Only hero (cover photo) and gallery (photos) hold images, so the tab is hidden elsewhere. */
export const tab: SectionPanelTab = {
  id: "assets",
  label: "Assets",
  order: 30,
  appliesTo: (section) => section.section_key === "hero" || section.section_key === "gallery",
  Component: ({ context }) =>
    context.section.section_key === "hero" ? <CoverAssets context={context} /> : <GalleryAssets context={context} />,
};

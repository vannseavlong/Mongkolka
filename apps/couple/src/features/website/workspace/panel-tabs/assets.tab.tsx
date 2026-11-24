"use client";

import { CoverAssets } from "../../components/asset-picker-cover";
import { GalleryAssets } from "../../components/asset-picker-gallery";
import { VenueAssets } from "../../components/asset-picker-venue";
import type { SectionPanelTab } from "./types";

/** Only hero (cover photo), gallery (photos) and details (venue photo) hold images, so the tab is hidden elsewhere. */
export const tab: SectionPanelTab = {
  id: "assets",
  label: "Assets",
  order: 30,
  appliesTo: (section) => ["hero", "gallery", "details"].includes(section.section_key),
  Component: ({ context }) => {
    switch (context.section.section_key) {
      case "hero":
        return <CoverAssets context={context} />;
      case "details":
        return <VenueAssets context={context} />;
      default:
        return <GalleryAssets context={context} />;
    }
  },
};

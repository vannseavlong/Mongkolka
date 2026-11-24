"use client";

import { HeroBannerAssets } from "../../components/hero-banner-assets";
import { GalleryAssets } from "../../components/asset-picker-gallery";
import { VenueAssets } from "../../components/asset-picker-venue";
import type { SectionPanelTab } from "./types";

/** Only hero (banners), gallery (photos) and details (venue photo) hold images, so the tab is hidden elsewhere. */
export const tab: SectionPanelTab = {
  id: "assets",
  label: "Assets",
  order: 30,
  appliesTo: (section) => ["hero", "gallery", "details"].includes(section.section_key),
  Component: ({ context }) => {
    switch (context.section.section_key) {
      case "hero":
        return <HeroBannerAssets section={context.section} profile={context.profile} />;
      case "details":
        return <VenueAssets context={context} />;
      default:
        return <GalleryAssets context={context} />;
    }
  },
};

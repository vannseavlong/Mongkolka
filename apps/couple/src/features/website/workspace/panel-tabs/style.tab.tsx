"use client";

import { VariantBrowser } from "../variant-browser";
import type { SectionPanelTab } from "./types";

export const tab: SectionPanelTab = {
  id: "style",
  label: "Style",
  order: 10,
  Component: ({ context }) => <VariantBrowser context={context} />,
};

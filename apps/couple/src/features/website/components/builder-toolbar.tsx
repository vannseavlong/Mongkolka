"use client";

import { HeaderContent } from "@/components/layout/header-slot";
import type { WebsiteSettings } from "../data/schema";
import { PublishPanel } from "./publish-panel";

/** Builder controls placed in the app header: title, site status and link, publish. */
export function BuilderToolbar({ settings }: { settings: WebsiteSettings | undefined }) {
  return (
    <HeaderContent>
      <h1 className="text-lg font-semibold tracking-tight max-lg:hidden">Website builder</h1>
      <div className="min-w-0 flex-1">{settings && <PublishPanel settings={settings} />}</div>
    </HeaderContent>
  );
}

"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { UploadLimitsCard } from "./components/upload-limits-card";

export function Settings() {
  return (
    <Main>
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Platform-wide limits and options you can change without a redeploy.</p>
      </div>
      <UploadLimitsCard />
    </Main>
  );
}

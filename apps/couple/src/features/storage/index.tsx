"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { DriveConnectCard } from "./components/drive-connect-card";

export function Storage() {
  return (
    <Main>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Storage</h1>
        <p className="text-muted-foreground">Choose where your website photos are kept.</p>
      </div>
      <div className="max-w-2xl">
        <DriveConnectCard />
      </div>
    </Main>
  );
}

"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { DriveConnectCard } from "./components/drive-connect-card";
import { StorageLibraryCard } from "./components/storage-library-card";
import { StorageSummary } from "./components/storage-summary";

export function Storage() {
  return (
    <Main>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Storage</h1>
        <p className="text-muted-foreground">Your website photos and where they are kept.</p>
      </div>
      <div className="flex flex-col gap-6">
        <StorageSummary />
        {/* Drive settings are short and fixed; the library takes the rest of the width. Stacked below lg. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
          <DriveConnectCard />
          <StorageLibraryCard />
        </div>
      </div>
    </Main>
  );
}

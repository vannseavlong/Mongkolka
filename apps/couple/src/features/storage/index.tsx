"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
import { DriveConnectCard } from "./components/drive-connect-card";
import { StorageLibraryCard } from "./components/storage-library-card";
import { StorageSummary } from "./components/storage-summary";

export function Storage() {
  return (
    <>
      <PageHeader title="Storage" description="Your website photos and where they are kept." />
      <Main fluid>
        <div className="flex flex-col gap-6">
          <StorageSummary />
          {/* Drive settings are short and fixed; the library takes the rest of the width. Stacked below lg. */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
            <DriveConnectCard />
            <StorageLibraryCard />
          </div>
        </div>
      </Main>
    </>
  );
}

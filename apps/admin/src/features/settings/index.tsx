"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
import { UploadLimitsCard } from "./components/upload-limits-card";

export function Settings() {
  return (
    <>
      <PageHeader title="Settings" description="Platform-wide limits and options you can change without a redeploy." />
      <Main fluid>
        <UploadLimitsCard />
      </Main>
    </>
  );
}

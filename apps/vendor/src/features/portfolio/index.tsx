"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
import { useApiQuery } from "@/lib/use-api-query";
import { PortfolioDialogs } from "./components/portfolio-dialogs";
import { PortfolioGrid } from "./components/portfolio-grid";
import { PortfolioPrimaryButtons } from "./components/portfolio-primary-buttons";
import { PortfolioProvider } from "./components/portfolio-provider";
import type { PortfolioItem } from "./data/schema";

export function Portfolio() {
  const { data, error } = useApiQuery<{ items: PortfolioItem[] }>("/vendor/api/portfolio");

  return (
    <PortfolioProvider>
      <PageHeader title="Portfolio" actions={<PortfolioPrimaryButtons />} />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <PortfolioGrid data={data?.items ?? []} />
      </Main>
      <PortfolioDialogs />
    </PortfolioProvider>
  );
}

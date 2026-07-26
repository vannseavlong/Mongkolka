"use client";

import { Main } from "@mongkolka/ui/layout/main";
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
      <Main>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
          <PortfolioPrimaryButtons />
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <PortfolioGrid data={data?.items ?? []} />
      </Main>
      <PortfolioDialogs />
    </PortfolioProvider>
  );
}

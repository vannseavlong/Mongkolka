"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
import { useApiQuery } from "@/lib/use-api-query";
import { ThemesDialogs } from "./components/themes-dialogs";
import { ThemesPrimaryButtons } from "./components/themes-primary-buttons";
import { ThemesProvider } from "./components/themes-provider";
import { ThemesTable } from "./components/themes-table";
import type { Theme } from "./data/schema";

export function Themes() {
  const { data, error } = useApiQuery<{ themes: Theme[] }>("/admin/api/themes");

  return (
    <ThemesProvider>
      <PageHeader
        title="Themes"
        description="App-chrome color themes for the admin and couple portal UI. Activating a theme applies it everywhere at once."
        actions={<ThemesPrimaryButtons />}
      />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <ThemesTable data={data?.themes ?? []} />
      </Main>
      <ThemesDialogs />
    </ThemesProvider>
  );
}

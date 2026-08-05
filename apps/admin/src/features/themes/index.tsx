"use client";

import { Main } from "@mongkolka/ui/layout/main";
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
      <Main>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Themes</h1>
            <p className="text-muted-foreground">
              App-chrome color themes for the admin and couple portal UI. Activating a theme applies
              it everywhere at once.
            </p>
          </div>
          <ThemesPrimaryButtons />
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <ThemesTable data={data?.themes ?? []} />
      </Main>
      <ThemesDialogs />
    </ThemesProvider>
  );
}

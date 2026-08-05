"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SWRConfig } from "swr";
import { SidebarProvider, SidebarInset } from "@mongkolka/ui/sidebar";
import { Header } from "@mongkolka/ui/layout/header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getToken } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/");
    }
  }, [router]);

  return (
    <SWRConfig
      value={{
        // Data is already cached client-side by useApiQuery's key; without
        // this, SWR's defaults refetch on every tab/window focus and on
        // every remount (i.e. every time a page is revisited), which is
        // what was hammering the Sheets read quota. Writers call `refetch()`
        // explicitly, so this only stops the *implicit* background refetches.
        revalidateOnFocus: false,
        revalidateIfStale: false,
        dedupingInterval: 5000,
      }}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header fixed />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SWRConfig>
  );
}

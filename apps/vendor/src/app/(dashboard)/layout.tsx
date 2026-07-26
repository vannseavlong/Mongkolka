"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@mongkolka/ui/sidebar";
import { Separator } from "@mongkolka/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { getToken } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/");
    }
  }, [router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
        </header>
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

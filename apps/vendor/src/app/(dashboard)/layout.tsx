"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header fixed />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

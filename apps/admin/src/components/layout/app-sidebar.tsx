"use client";

import { useRouter } from "next/navigation";
import { Heart, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@mongkolka/ui/sidebar";
import { NavGroup } from "@mongkolka/ui/layout/nav-group";
import { clearToken } from "@/lib/auth";
import { sidebarData } from "./data/sidebar-data";

export function AppSidebar() {
  const router = useRouter();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Heart className="size-5 text-primary" />
          <span className="font-medium group-data-[collapsible=icon]:hidden">Mongkolka Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                clearToken();
                router.replace("/");
              }}
            >
              <LogOut />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

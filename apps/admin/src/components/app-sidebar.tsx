"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  Heart,
  Store,
  Tags,
  LayoutTemplate,
  Users,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@mongkolka/ui/sidebar";
import { clearToken } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/approvals", label: "Approvals", icon: UserCheck },
  { href: "/couples", label: "Couples", icon: Heart },
  { href: "/vendors", label: "Vendors", icon: Store },
  { href: "/vendor-categories", label: "Vendor categories", icon: Tags },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/users", label: "All users", icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Heart className="size-5 text-primary" />
          <span className="font-medium">Mongkolka Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
    </Sidebar>
  );
}

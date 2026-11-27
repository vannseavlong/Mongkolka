"use client";

import { useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";
import { BrandMark } from "@mongkolka/ui/layout/brand-mark";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mongkolka/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@mongkolka/ui/alert-dialog";
import { NavGroup } from "@mongkolka/ui/layout/nav-group";
import { exitAssist, useIsAssisting } from "@/features/assist/lib/use-assist-session";
import { clearToken } from "@/lib/auth";
import { sidebarData } from "./data/sidebar-data";

export function AppSidebar() {
  const router = useRouter();

  const assisting = useIsAssisting();

  function signOut() {
    // An admin leaving goes back to the admin app; the couple is not "signed out".
    if (assisting) return exitAssist();
    clearToken();
    router.replace("/");
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <BrandMark />
          <span className="font-medium group-data-[collapsible=icon]:hidden">Mongkolka</span>
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
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <UserCircle />
                    <span>Account</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56">
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <UserCircle />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(event) => event.preventDefault()}
                    >
                      <LogOut />
                      {assisting ? "Exit help session" : "Sign out"}
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{assisting ? "Exit the help session?" : "Sign out?"}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {assisting ? "You will go back to the admin app." : "You'll need to sign in again to access your account."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={signOut}>{assisting ? "Exit" : "Sign out"}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

import { LayoutDashboard, Users, Wallet, ListChecks, Milestone, Globe, Heart } from "lucide-react";
import type { SidebarNavData } from "@mongkolka/ui/layout/nav-types";

export const sidebarData: SidebarNavData = {
  navGroups: [
    {
      title: "Plan",
      items: [
        { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { title: "Guests", href: "/guests", icon: Users },
        { title: "Budget", href: "/budget", icon: Wallet },
        { title: "Checklist", href: "/checklist", icon: ListChecks },
        { title: "Milestones", href: "/milestones", icon: Milestone },
      ],
    },
    {
      title: "Website",
      items: [
        { title: "Builder", href: "/website", icon: Globe },
        { title: "Profile", href: "/profile", icon: Heart },
      ],
    },
  ],
};

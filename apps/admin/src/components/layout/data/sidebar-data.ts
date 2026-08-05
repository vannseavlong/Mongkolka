import {
  LayoutDashboard,
  UserCheck,
  Heart,
  Store,
  Tags,
  LayoutTemplate,
  Blocks,
  Palette,
  Users,
} from "lucide-react";
import type { SidebarNavData } from "@mongkolka/ui/layout/nav-types";

export const sidebarData: SidebarNavData = {
  navGroups: [
    {
      title: "Manage",
      items: [
        { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { title: "Approvals", href: "/approvals", icon: UserCheck },
        { title: "Couples", href: "/couples", icon: Heart },
        { title: "Vendors", href: "/vendors", icon: Store },
        { title: "Vendor categories", href: "/vendor-categories", icon: Tags },
        { title: "Site templates", href: "/site-templates", icon: LayoutTemplate },
        { title: "Section components", href: "/section-components", icon: Blocks },
        { title: "Themes", href: "/themes", icon: Palette },
        { title: "All users", href: "/users", icon: Users },
      ],
    },
  ],
};

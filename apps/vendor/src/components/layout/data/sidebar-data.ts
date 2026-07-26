import { LayoutDashboard, User, Images, Package, CalendarCheck } from "lucide-react";
import type { SidebarNavData } from "@mongkolka/ui/layout/nav-types";

export const sidebarData: SidebarNavData = {
  navGroups: [
    {
      title: "Manage",
      items: [
        { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { title: "Profile", href: "/profile", icon: User },
        { title: "Portfolio", href: "/portfolio", icon: Images },
        { title: "Services", href: "/services", icon: Package },
        { title: "Bookings", href: "/bookings", icon: CalendarCheck },
      ],
    },
  ],
};

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { TeamSwitcher } from "./team-switcher";
import { useGetAllClientsQuery } from "@/features/client/clientApiSlice";
import {
  LayoutDashboard,
  // Settings,
  SquareUserRound,
  Users,
} from "lucide-react";

export function AdminHPCSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: clients } = useGetAllClientsQuery();

  const sidebarItems = [
    {
      title: "Dashboard",
      url: "/hpc",
      icon: LayoutDashboard,
    },
    {
      title: "CRM",
      url: "/hpc/crm",
      icon: SquareUserRound,
    },
    {
      title: "Customers",
      url: "/hpc/customers",
      icon: Users,
    },
    // {
    //   title: "Settings",
    //   url: "/hpc/settings",
    //   icon: Settings,
    // },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher clients={clients} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

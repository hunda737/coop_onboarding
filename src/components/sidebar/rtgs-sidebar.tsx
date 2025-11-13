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
import { LayoutDashboard, SquareUserRound } from "lucide-react";

export function RtgsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: clients } = useGetAllClientsQuery();

  const sidebarItems = [
    {
      title: "Dashboard",
      url: "/rtgs",
      icon: LayoutDashboard,
    },
    {
      title: "Matchers",
      url: "/rtgs/matchers",
      icon: SquareUserRound,
    },
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

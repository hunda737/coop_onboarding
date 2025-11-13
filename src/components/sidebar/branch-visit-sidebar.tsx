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
  MessageSquareShare,
  // Settings,
  SquareUserRound,
  Target,
} from "lucide-react";

export function BranchVisitSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: clients } = useGetAllClientsQuery();

  const sidebarItems = [
    {
      title: "Dashboard",
      url: "/branch-visit",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/branch-visit/users",
      icon: SquareUserRound,
    },
    {
      title: "Targets",
      url: "/branch-visit/targets",
      icon: Target,
    },
    {
      title: "Feedback",
      url: "/branch-visit/feedback",
      icon: MessageSquareShare,
    },
    // {
    //   title: "Settings",
    //   url: "/branch-visit/settings",
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

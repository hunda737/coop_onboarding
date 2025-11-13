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
  BookUser,
  // DollarSign,
  LayoutDashboard,
  // ShieldAlert,
  Target,
  Telescope,
  // UserPlus,
  Users,
} from "lucide-react";
import { useParams } from "react-router-dom";

export function AdminClientSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: clients } = useGetAllClientsQuery();
  const params = useParams();

  const sidebarItems = [
    {
      title: "Dashboard",
      url: `/clients/${params.clientId}`,
      icon: LayoutDashboard,
    },
    {
      title: "Targets",
      url: `/clients/${params.clientId}/targets`,
      icon: Target,
    },
    {
      title: "Accounts",
      url: `/clients/${params.clientId}/accounts`,
      icon: BookUser,

    },
    {
      title: "Prospective",
      url: `/clients/${params.clientId}/prospectives`,
      icon: Telescope,
    },
    // {
    //   title: "Inactive Accounts",
    //   url: `/clients/${params.clientId}/inactive`,
    //   icon: ShieldAlert,
    // },
    {
      title: "Users",
      url: `/clients/${params.clientId}/users`,
      icon: Users,
    },
    // {
    //   title: "RTGS",
    //   url: `/clients/${params.clientId}/rtgs`,
    //   icon: DollarSign,
    // },
    // {
    //   title: "Agents",
    //   url: `/clients/${params.clientId}/agents`,
    //   icon: UserPlus,
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

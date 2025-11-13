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
import sidebarMenu from "./menu";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import logo from "@/assets/images/coop-logo.png";

const roleItems = (
  role: string
): (typeof sidebarMenu)[keyof typeof sidebarMenu] | undefined => {
  return role in sidebarMenu
    ? sidebarMenu[role as keyof typeof sidebarMenu]
    : undefined;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: clients } = useGetAllClientsQuery();
  const { data: currentUser } = useGetCurrentUserQuery();

  return (
    <Sidebar collapsible="icon" {...props} className="shadow-lg">
      <SidebarHeader className="h-16 justify-center border-b">
        {currentUser?.role === "SUPER-ADMIN" ? (
          <TeamSwitcher clients={clients} />
        ) : (
          <div className="flex items-center w-full justify-center">
            <img src={logo} width={80} height={40} alt="logo" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {currentUser?.role && roleItems(currentUser.role) && (
          <NavMain items={roleItems(currentUser.role) || []} />
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

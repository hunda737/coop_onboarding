import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Client } from "@/features/client/clientApiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useClientModal } from "@/hooks/use-client-modal";
import { ClientModal } from "../ui/modals/client-modal";

export function TeamSwitcher({ clients }: { clients: Client[] | undefined }) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const params = useParams();
  // const clientModal = useClientModal();
  const [activeTeam, setActiveTeam] = React.useState<Client | undefined>(
    undefined
  );

  const location = useLocation();
  const currentPath = location.pathname;

  React.useEffect(() => {
    if (params.clientId) {
      setActiveTeam(
        clients?.find((item) => String(item.id) === params.clientId)
      );
    }
  }, [clients, params.clientId]);

  const handleClientSelect = (client: Client | undefined) => {
    setActiveTeam(client);
    navigate(client ? `/clients/${client.id}` : "/");
  };

  return (
    <SidebarMenu>
      <ClientModal />
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeTeam && (
                  <img
                    src={
                      activeTeam?.logo ||
                      "https://coopbankoromia.com.et/wp-content/uploads/2023/02/Infinity-Logo.png"
                    }
                    alt=""
                    width={40}
                    height={40}
                  />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam?.clientName
                    ? activeTeam?.clientName
                    : currentPath.includes("/hpc")
                      ? "HPC"
                      : currentPath.includes("/branch-visit")
                        ? "BRANCH VISIT"
                        : currentPath.includes("/rtgs")
                          ? "RTGS"
                          : "All"}
                </span>
                <span className="truncate text-xs">
                  {activeTeam?.clientCode || ""}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-sm text-muted-foreground">
              Clients
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleClientSelect(undefined)}
              className="gap-2 p-2 cursor-pointer"
            >
              <div className="flex size-6 items-center justify-center bg-primary rounded-sm border" />
              <div className="flex items-center gap-2">All</div>
              <DropdownMenuShortcut>⌘{0}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <div className="h-60 overflow-hidden overflow-y-scroll custom-scrollbar">
              {clients?.map((client, index) => (
                <DropdownMenuItem
                  key={client.clientName}
                  onClick={() => handleClientSelect(client)}
                  className="gap-2 p-2 cursor-pointer"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <img
                      src={
                        client.logo ||
                        "https://coopbankoromia.com.et/wp-content/uploads/2023/02/Infinity-Logo.png"
                      }
                      alt=""
                      width={40}
                      height={20}
                    />
                  </div>
                  {client.clientName}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            {/* <DropdownMenuLabel className="text-sm text-muted-foreground">
              CRM & BRANCH
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                handleClientSelect(undefined);
                navigate("/hpc");
              }}
              className="gap-2 p-2 cursor-pointer"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <img
                  src={
                    "https://coopbankoromia.com.et/wp-content/uploads/2023/02/Infinity-Logo.png"
                  }
                  alt=""
                  width={40}
                  height={20}
                />
              </div>
              HPC
              <DropdownMenuShortcut>⌘ + H</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleClientSelect(undefined);
                navigate("/branch-visit");
              }}
              className="gap-2 p-2 cursor-pointer"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <img
                  src={
                    "https://coopbankoromia.com.et/wp-content/uploads/2023/02/Infinity-Logo.png"
                  }
                  alt=""
                  width={40}
                  height={20}
                />
              </div>
              BRANCH VISIT
              <DropdownMenuShortcut>⌘ + H</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleClientSelect(undefined);
                navigate("/rtgs");
              }}
              className="gap-2 p-2 cursor-pointer"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <img
                  src={
                    "https://coopbankoromia.com.et/wp-content/uploads/2023/02/Infinity-Logo.png"
                  }
                  alt=""
                  width={40}
                  height={20}
                />
              </div>
              RTGS
              <DropdownMenuShortcut>⌘ + R</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={clientModal.onOpen}
              className="gap-2 p-2 cursor-pointer"
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Client
              </div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

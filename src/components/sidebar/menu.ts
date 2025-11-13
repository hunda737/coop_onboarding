import {
  BookUser,
  Calendar,
  LayoutDashboard,
  LucideWorkflow,
  // Notebook,
  Settings2,
  // ShieldAlert,
  SquareUserRound,
  Target,
  Telescope,
  User,
  // UserPlus,
  Users,
  Users2
} from "lucide-react";

const sidebarMenu = {
  "SUPER-ADMIN": [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
      authorizedRoles: ["SUPER-ADMIN"],
    },
    {
      title: "Clients",
      url: "/clients",
      icon: User,
      authorizedRoles: ["SUPER-ADMIN"],
    },
    {
      title: "KYC Admins",
      url: "/kyc-admins",
      icon: Users2,
      authorizedRoles: ["SUPER-ADMIN"],
    },
    {
      title: "Flow Settings",
      url: "/flow-settings",
      icon: Settings2,
      authorizedRoles: ["SUPER-ADMIN"],
    },

    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings,
    //   authorizedRoles: ["SUPER-ADMIN"],
    //   items: [
    //     {
    //       title: "Email",
    //       url: "/settings/email",
    //       icon: Mail,
    //     },
    //     {
    //       title: "SMS",
    //       url: "/settings/sms",
    //       icon: MessageSquareText,
    //     },
    //   ],
    // },
  ],
  "CLIENT-ADMIN": [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Targets",
      url: `/targets`,
      icon: Target,
    },
    {
      title: "Accounts",
      url: "/accounts",
      icon: BookUser,
    },
    // {
    //   title: "Inactive Accounts",
    //   url: "/inactive",
    //   icon: ShieldAlert,
    // },
    {
      title: "Prospective",
      url: "/prospective",
      icon: Telescope,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
    // {
    //   title: "Agents",
    //   url: "/agents",
    //   icon: UserPlus,
    // },
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings,
    // },
  ],
  "ACCOUNT-APPROVER": [
    // {
    //   title: "Dashboard",
    //   url: "/",
    //   icon: LayoutDashboard,
    // },

    {
      title: "Accounts",
      url: "/accounts",
      icon: BookUser,
    },

    // {
    //   title: "Inactive Accounts",
    //   url: "/inactive",
    //   icon: ShieldAlert,
    // },
    // {
    //   title: "Prospective",
    //   url: "/prospective",
    //   icon: Telescope,
    // },
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings,
    // },
  ],
  "ACCOUNT-CREATOR": [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    // {
    //   title: "Targets",
    //   url: `/targets`,
    //   icon: Target,
    // },
    {
      title: "Accounts",
      url: "/accounts",
      icon: BookUser,
    },
    // {
    //   title: "Organization Account",
    //   url: "/organizational",
    //   icon: Users,
    // },
    // {
    //   title: "Inactive Accounts",
    //   url: "/inactive",
    //   icon: ShieldAlert,
    // },
    {
      title: "Prospective",
      url: "/prospective",
      icon: Telescope,
    },
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings,
    // },
  ],
  "BRANCH-ADMIN": [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    // {
    //   title: "Organization Account",
    //   url: "/organizational",
    //   icon: Users,
    // },
    {
      title: "Targets",
      url: `/targets`,
      icon: Target,
    },
    {
      title: "Accounts",
      url: "/accounts",
      icon: BookUser,
    },
    // {
    //   title: "Inactive Accounts",
    //   url: "/inactive",
    //   icon: ShieldAlert,
    // },
    {
      title: "Prospective",
      url: "/prospective",
      icon: Telescope,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
    // {
    //   title: "Agents",
    //   url: "/agents",
    //   icon: UserPlus,
    // },
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings,
    // },
  ],
  CRM: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Meetings",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: LucideWorkflow,
    },
    // {
    //   title: "Notes",
    //   url: "/notes",
    //   icon: Notebook,
    // },
    {
      title: "Customers",
      url: "/customers",
      icon: Users,
    },
    // {
    //   title: "Organization Account",
    //   url: "/organizational",
    //   icon: Users,
    // },
    // {
    //   title: "Settings",
    //   url: "/crm-settings",
    //   icon: Settings,
    // },
  ],
  "CRM-ADMIN": [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "CRM",
      url: "/crm",
      icon: SquareUserRound,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: Users,
    },
    // {
    //   title: "Settings",
    //   url: "/crm-settings",
    //   icon: Settings,
    // },
  ],
};

export default sidebarMenu;

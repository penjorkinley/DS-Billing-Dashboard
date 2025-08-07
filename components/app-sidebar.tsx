"use client";

import {
  Building2,
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  Settings,
  Shield,
  Users,
  BarChart3,
  Database,
  Server,
  UserPlus,
  Bell,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

// Super Admin Navigation Items
const superAdminNavItems = [
  {
    title: "Overview",
    icon: Home,
    url: "/dashboard/super-admin",
  },
  {
    title: "Organizations",
    icon: Building2,
    items: [
      {
        title: "All Organizations",
        url: "/dashboard/super-admin/organizations",
      },
      {
        title: "Create Organization",
        url: "/dashboard/super-admin/organizations/create",
      },
      {
        title: "Organization Reports",
        url: "/dashboard/super-admin/organizations/reports",
      },
    ],
  },
  {
    title: "User Management",
    icon: Users,
    items: [
      {
        title: "All Users",
        url: "/dashboard/super-admin/users",
      },
      {
        title: "Create User",
        url: "/dashboard/super-admin/users/create",
      },
      {
        title: "User Roles",
        url: "/dashboard/super-admin/users/roles",
      },
    ],
  },
  {
    title: "System",
    icon: Server,
    items: [
      {
        title: "Server Status",
        url: "/dashboard/super-admin/system/status",
      },
      {
        title: "Database",
        url: "/dashboard/super-admin/system/database",
      },
      {
        title: "Audit Logs",
        url: "/dashboard/super-admin/system/logs",
      },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    items: [
      {
        title: "Financial Reports",
        url: "/dashboard/super-admin/reports/financial",
      },
      {
        title: "Usage Analytics",
        url: "/dashboard/super-admin/reports/usage",
      },
      {
        title: "System Performance",
        url: "/dashboard/super-admin/reports/performance",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/super-admin/settings",
  },
];

// Organization Admin Navigation Items
const orgAdminNavItems = [
  {
    title: "Overview",
    icon: Home,
    url: "/dashboard/organization",
  },
  {
    title: "Users",
    icon: Users,
    items: [
      {
        title: "All Users",
        url: "/dashboard/organization/users",
      },
      {
        title: "Add User",
        url: "/dashboard/organization/users/add",
      },
      {
        title: "User Roles",
        url: "/dashboard/organization/users/roles",
      },
      {
        title: "Access Control",
        url: "/dashboard/organization/users/access",
      },
    ],
  },
  {
    title: "Services",
    icon: FileText,
    items: [
      {
        title: "Active Services",
        url: "/dashboard/organization/services",
      },
      {
        title: "Service Usage",
        url: "/dashboard/organization/services/usage",
      },
      {
        title: "Service Configuration",
        url: "/dashboard/organization/services/config",
      },
    ],
  },
  {
    title: "Billing",
    icon: CreditCard,
    items: [
      {
        title: "Current Bills",
        url: "/dashboard/organization/billing",
      },
      {
        title: "Payment History",
        url: "/dashboard/organization/billing/history",
      },
      {
        title: "Usage Reports",
        url: "/dashboard/organization/billing/reports",
      },
      {
        title: "Payment Methods",
        url: "/dashboard/organization/billing/methods",
      },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    items: [
      {
        title: "Usage Dashboard",
        url: "/dashboard/organization/analytics",
      },
      {
        title: "Performance",
        url: "/dashboard/organization/analytics/performance",
      },
      {
        title: "Reports",
        url: "/dashboard/organization/analytics/reports",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/organization/settings",
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole?: "SUPER_ADMIN" | "ORGANIZATION_ADMIN";
  user?: {
    userid: string;
    role: string;
    orgId: string | null;
  };
}

export function AppSidebar({
  userRole = "ORGANIZATION_ADMIN",
  user,
  ...props
}: AppSidebarProps) {
  const navItems =
    userRole === "SUPER_ADMIN" ? superAdminNavItems : orgAdminNavItems;

  const roleConfig = {
    SUPER_ADMIN: {
      icon: Shield,
      title: "Super Administrator",
      subtitle: "System-wide Access",
      color: "text-red-600",
    },
    ORGANIZATION_ADMIN: {
      icon: Building2,
      title: "Organization Admin",
      subtitle:
        user?.orgId === "ORG001"
          ? "Ministry of IT"
          : user?.orgId === "ORG002"
          ? "Department of Revenue"
          : "Organization",
      color: "text-blue-600",
    },
  };

  const config = roleConfig[userRole];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground`}
          >
            <config.icon className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{config.title}</span>
            <span className="truncate text-xs text-muted-foreground">
              {config.subtitle}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="w-full"
                        asChild={!item.items}
                      >
                        {!item.items && item.url ? (
                          <a
                            href={item.url}
                            className="flex w-full items-center"
                          >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </a>
                        ) : (
                          <div className="flex w-full items-center">
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            {item.items && (
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            )}
                          </div>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <Shield className="h-4 w-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">BNDIL Admin</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Bhutan NDI
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

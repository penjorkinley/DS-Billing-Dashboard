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
  LogOut,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
        url: "/dashboard/super-admin/create",
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
    ],
  },
  {
    title: "Pricing & Billing",
    icon: CreditCard,
    url: "/dashboard/super-admin/billing",
  },
  // {
  //   title: "Reports",
  //   icon: BarChart3,
  //   items: [
  //     {
  //       title: "Financial Reports",
  //       url: "/dashboard/super-admin/reports/financial",
  //     },
  //     {
  //       title: "Usage Analytics",
  //       url: "/dashboard/super-admin/reports/usage",
  //     },
  //     {
  //       title: "System Performance",
  //       url: "/dashboard/super-admin/reports/performance",
  //     },
  //   ],
  // },
  // {
  //   title: "Settings",
  //   icon: Settings,
  //   url: "/dashboard/super-admin/settings",
  // },
];

// Organization Admin Navigation Items
const orgAdminNavItems = [
  {
    title: "Overview",
    icon: Home,
    url: "/dashboard/organization",
  },
  {
    title: "Usage & Billing",
    icon: CreditCard,
    url: "/dashboard/organization/usage-billing",
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
    ],
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole?: "SUPER_ADMIN" | "ORGANIZATION_ADMIN";
  user?: {
    userid: string;
    role: string;
    orgId: string | null;
  };
  onLogout?: () => void;
}

export function AppSidebar({
  userRole = "ORGANIZATION_ADMIN",
  user,
  onLogout,
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

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <config.icon className="h-6 w-6" />
          </div>
          <div className="grid flex-1 text-left text-base leading-tight">
            <span className="truncate font-semibold text-lg">
              {config.title}
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {config.subtitle}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
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
                        tooltip={{
                          children: item.title,
                          className:
                            "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md px-3 py-2 text-sm font-medium opacity-100 [&>*]:hidden",
                        }}
                        className="w-full h-11 gap-3 px-3 rounded-md"
                        asChild={!item.items}
                      >
                        {!item.items && item.url ? (
                          <a
                            href={item.url}
                            className="flex w-full items-center gap-3"
                          >
                            {item.icon && (
                              <item.icon className="h-5 w-5 shrink-0" />
                            )}
                            <span className="flex-1 text-base font-medium">
                              {item.title}
                            </span>
                          </a>
                        ) : (
                          <div className="flex w-full items-center gap-3">
                            {item.icon && (
                              <item.icon className="h-5 w-5 shrink-0" />
                            )}
                            <span className="flex-1 text-base font-medium">
                              {item.title}
                            </span>
                            {item.items && (
                              <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            )}
                          </div>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items && (
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-6 mt-1 space-y-1 border-l border-border pl-4">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className="h-9 text-base"
                              >
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

      <SidebarFooter className="px-3 py-6">
        <SidebarMenu>
          {/* Logout Button with Alert Dialog */}
          <SidebarMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <SidebarMenuButton
                  tooltip={{
                    children: "Logout",
                    className:
                      "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md px-3 py-2 text-sm font-medium opacity-100 [&>*]:hidden",
                  }}
                  className="h-11 gap-3 px-3 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="font-medium text-base cursor-pointer">
                    Logout
                  </span>
                </SidebarMenuButton>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader className="text-left">
                  <AlertDialogTitle className="text-lg font-semibold">
                    Confirm Logout
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm leading-relaxed">
                    Are you sure you want to logout? You will be signed out of
                    your account and redirected to the login page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-2">
                  <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium"
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

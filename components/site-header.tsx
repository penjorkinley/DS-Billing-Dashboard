"use client";

import { Bell, LogOut, User, Settings } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface SiteHeaderProps {
  user?: {
    userid: string;
    role: string;
    orgId: string | null;
  };
  onLogout?: () => void;
  breadcrumbItems?: {
    title: string;
    href?: string;
  }[];
}

export function SiteHeader({
  user,
  onLogout,
  breadcrumbItems,
}: SiteHeaderProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Administrator";
      case "ORGANIZATION_ADMIN":
        return "Organization Admin";
      default:
        return role;
    }
  };

  const getOrgDisplayName = (orgId: string | null) => {
    if (!orgId) return "System-wide Access";

    switch (orgId) {
      case "ORG001":
        return "Ministry of IT";
      case "ORG002":
        return "Department of Revenue";
      case "ORG003":
        return "Digital Bhutan";
      default:
        return orgId;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "ORGANIZATION_ADMIN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[data-collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between px-4">
        {/* Left side - Sidebar trigger and breadcrumbs */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          {breadcrumbItems && breadcrumbItems.length > 0 ? (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                    <BreadcrumbItem
                      className={index === 0 ? "hidden md:block" : ""}
                    >
                      {item.href && index < breadcrumbItems.length - 1 ? (
                        <BreadcrumbLink href={item.href}>
                          {item.title}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          ) : (
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Bhutan NDI"
                width={80}
                height={24}
                priority
                className="hidden md:block"
              />
            </div>
          )}
        </div>

        {/* Right side - User menu and actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 flex items-center gap-2 px-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {user.userid.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{user.userid}</div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role === "SUPER_ADMIN"
                          ? "Super Admin"
                          : "Org Admin"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getOrgDisplayName(user.orgId)}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">
                        {user.userid}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role === "SUPER_ADMIN"
                          ? "Super Admin"
                          : "Org Admin"}
                      </span>
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {getRoleDisplayName(user.role)}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {getOrgDisplayName(user.orgId)}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}

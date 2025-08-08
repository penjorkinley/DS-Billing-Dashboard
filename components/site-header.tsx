"use client";

import Image from "next/image";
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
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[data-collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center px-4">
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
      </div>
    </header>
  );
}

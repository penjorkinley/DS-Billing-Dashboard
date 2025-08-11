// File: app/dashboard/super-admin/organizations/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/lib/toast-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Building2 } from "lucide-react";

// Import custom components
import {
  OrganizationCard,
  type OrganizationWithSubscription,
} from "@/components/organization/organization-card";
import { OrganizationStats } from "@/components/organization/organization-stats";
import { OrganizationFilters } from "@/components/organization/organization-filters";
import { OrganizationTableView } from "@/components/organization/organization-table-view";
import { type EditOrganizationData } from "@/lib/schemas/organization";

// Sample organization data with subscription details
const organizationsData: OrganizationWithSubscription[] = [
  {
    id: "ORG001",
    name: "Ministry of Information Technology",
    shortName: "MIT",
    status: "active",
    revenue: 25400,
    createdAt: "2023-03-15",
    contactEmail: "admin@mit.gov.bt",
    subscription: "postpaid",
    subscriptionDetails: {
      billingCycle: "quarterly",
      totalIncurred: 75600,
      singleSignaturesUsed: 1250,
      multipleSignaturesUsed: 890,
      subscriptionDate: "2023-03-15",
      subscriptionEndDate: "2024-03-15",
    },
  },
  {
    id: "ORG002",
    name: "Department of Revenue & Customs",
    shortName: "DRC",
    status: "active",
    revenue: 18200,
    createdAt: "2023-05-22",
    contactEmail: "admin@drc.gov.bt",
    subscription: "prepaid",
    subscriptionDetails: {
      remainingBalance: 45000,
      singleSignaturesUsed: 2100,
      multipleSignaturesUsed: 1200,
      subscriptionDate: "2023-05-22",
    },
  },
  {
    id: "ORG003",
    name: "Digital Bhutan Corporation",
    shortName: "DBC",
    status: "active",
    revenue: 35600,
    createdAt: "2023-01-10",
    contactEmail: "support@digitalBhutan.bt",
    subscription: "postpaid",
    subscriptionDetails: {
      billingCycle: "monthly",
      totalIncurred: 125300,
      singleSignaturesUsed: 3400,
      multipleSignaturesUsed: 2800,
      subscriptionDate: "2023-01-10",
      subscriptionEndDate: "2024-01-10",
    },
  },
  {
    id: "ORG004",
    name: "Ministry of Health",
    shortName: "MOH",
    status: "inactive",
    revenue: 12800,
    createdAt: "2023-07-08",
    contactEmail: "admin@health.gov.bt",
    subscription: "prepaid",
    subscriptionDetails: {
      remainingBalance: 8500,
      singleSignaturesUsed: 780,
      multipleSignaturesUsed: 450,
      subscriptionDate: "2023-07-08",
    },
  },
  {
    id: "ORG005",
    name: "Department of Education",
    shortName: "DOE",
    status: "active",
    revenue: 22900,
    createdAt: "2023-04-12",
    contactEmail: "admin@education.gov.bt",
    subscription: "postpaid",
    subscriptionDetails: {
      billingCycle: "half_yearly",
      totalIncurred: 68700,
      singleSignaturesUsed: 1800,
      multipleSignaturesUsed: 1100,
      subscriptionDate: "2023-04-12",
      subscriptionEndDate: "2024-04-12",
    },
  },
  {
    id: "ORG006",
    name: "Royal Insurance Corporation",
    shortName: "RIC",
    status: "active",
    revenue: 19500,
    createdAt: "2023-06-18",
    contactEmail: "tech@ric.bt",
    subscription: "prepaid",
    subscriptionDetails: {
      remainingBalance: 32000,
      singleSignaturesUsed: 1600,
      multipleSignaturesUsed: 920,
      subscriptionDate: "2023-06-18",
    },
  },
  {
    id: "ORG007",
    name: "Bhutan Power Corporation",
    shortName: "BPC",
    status: "active",
    revenue: 28900,
    createdAt: "2023-02-28",
    contactEmail: "digital@bpc.bt",
    subscription: "postpaid",
    subscriptionDetails: {
      billingCycle: "yearly",
      totalIncurred: 86700,
      singleSignaturesUsed: 2200,
      multipleSignaturesUsed: 1750,
      subscriptionDate: "2023-02-28",
      subscriptionEndDate: "2024-02-28",
    },
  },
  {
    id: "ORG008",
    name: "National Statistics Bureau",
    shortName: "NSB",
    status: "inactive",
    revenue: 8900,
    createdAt: "2023-09-05",
    contactEmail: "it@nsb.gov.bt",
    subscription: "prepaid",
    subscriptionDetails: {
      remainingBalance: 5200,
      singleSignaturesUsed: 420,
      multipleSignaturesUsed: 280,
      subscriptionDate: "2023-09-05",
    },
  },
];

type ViewMode = "grid" | "table";

export default function AllOrganizationsPage() {
  const { user, loading, error, isAuthenticated } = useAuth({
    requiredRole: "SUPER_ADMIN",
  });
  const router = useRouter();
  const { showToast } = useToast();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [organizations, setOrganizations] =
    useState<OrganizationWithSubscription[]>(organizationsData);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  // Handle card flip
  const handleCardClick = (orgId: string) => {
    setFlippedCards((prev) => {
      const newFlipped = new Set(prev);
      if (newFlipped.has(orgId)) {
        newFlipped.delete(orgId);
      } else {
        newFlipped.add(orgId);
      }
      return newFlipped;
    });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        showToast({
          type: "success",
          title: "Logged Out",
          message: "You have been successfully logged out. Redirecting...",
          duration: 2000,
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        showToast({
          type: "error",
          title: "Logout Error",
          message: "Failed to logout properly. Redirecting anyway...",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast({
        type: "error",
        title: "Connection Error",
        message: "Failed to logout properly. Redirecting anyway...",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  // Handle organization update
  const handleOrganizationUpdate = (
    orgId: string,
    updatedData: EditOrganizationData
  ) => {
    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === orgId
          ? {
              ...org,
              name: updatedData.name,
              status: updatedData.status,
              contactEmail: updatedData.contactEmail,
              subscription: updatedData.subscription,
            }
          : org
      )
    );

    showToast({
      type: "success",
      title: "Organization Updated",
      message: `${updatedData.name} has been successfully updated.`,
      duration: 3000,
    });
  };

  // Filter and search logic
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.shortName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || org.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [organizations, searchQuery, statusFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = organizations.length;
    const active = organizations.filter(
      (org) => org.status === "active"
    ).length;
    const inactive = total - active;
    const totalRevenue = organizations.reduce(
      (sum, org) => sum + org.revenue,
      0
    );

    return { total, active, inactive, totalRevenue };
  }, [organizations]);

  // Clear filters function
  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
          <span className="text-muted-foreground">
            Verifying authentication...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error || "Authentication failed"}
          </p>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "280px",
          "--header-height": "60px",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        userRole="SUPER_ADMIN"
        user={user}
        onLogout={handleLogout}
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader
          user={user}
          breadcrumbItems={[
            { title: "Super Administrator", href: "/dashboard/super-admin" },
            {
              title: "Organizations",
              href: "/dashboard/super-admin/organizations",
            },
            { title: "All Organizations" },
          ]}
        />

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 py-6">
            {/* Header Section */}
            <div className="px-4 lg:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    All Organizations
                  </h1>
                  <p className="text-muted-foreground">
                    Manage and monitor all organizations in your system. Click
                    on cards to view subscription details.
                  </p>
                </div>
                <Button
                  className="w-fit bg-green-600 hover:bg-green-700 text-white border-0"
                  onClick={() => router.push("/dashboard/super-admin/create")}
                >
                  Add Organization
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="px-4 lg:px-6">
              <OrganizationStats
                total={stats.total}
                active={stats.active}
                inactive={stats.inactive}
                totalRevenue={stats.totalRevenue}
              />
            </div>

            {/* Filters and Controls */}
            <div className="px-4 lg:px-6">
              <OrganizationFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalCount={organizations.length}
                filteredCount={filteredOrganizations.length}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Organizations Display */}
            <div className="px-4 lg:px-6">
              {viewMode === "grid" ? (
                /* Grid View with Flip Cards */
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredOrganizations.map((org) => (
                    <OrganizationCard
                      key={org.id}
                      organization={org}
                      isFlipped={flippedCards.has(org.id)}
                      onCardClick={() => handleCardClick(org.id)}
                      onUpdate={handleOrganizationUpdate}
                    />
                  ))}
                </div>
              ) : (
                /* Table View */
                <OrganizationTableView
                  organizations={filteredOrganizations}
                  onUpdate={handleOrganizationUpdate}
                />
              )}

              {filteredOrganizations.length === 0 && (
                <Card className="py-12 border-0 shadow-lg">
                  <CardContent className="text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No organizations found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your filters or search terms."
                        : "Get started by adding your first organization."}
                    </p>
                    {(searchQuery || statusFilter !== "all") && (
                      <Button variant="outline" onClick={handleClearFilters}>
                        Clear filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
